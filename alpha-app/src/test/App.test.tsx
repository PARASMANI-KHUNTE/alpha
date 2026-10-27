import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

describe('App Component Integration', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders table view by default with all 10 contacts', () => {
    render(<App />);

    // Header count
    expect(screen.getByText('10 contacts')).toBeInTheDocument();

    // Table headers
    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Email' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Stage' })).toBeInTheDocument();

    // Verify presence of sample contacts
    expect(screen.getByText('Elena Marchetti')).toBeInTheDocument();
    expect(screen.getByText('Oliver Hartmann')).toBeInTheDocument();
    expect(screen.getByText('Daniel Abiodun')).toBeInTheDocument();
  });

  it('displays em-dash placeholders and "No labels" for missing optional data', () => {
    render(<App />);

    // Oliver Hartmann has no company and no labels
    expect(screen.getByText('No labels')).toBeInTheDocument();

    // Priya Narayanan has null email - em-dashes should be present
    const dashes = screen.getAllByText('—');
    expect(dashes.length).toBeGreaterThan(0);
  });

  it('switches between Table and Board views smoothly', async () => {
    const user = userEvent.setup();
    render(<App />);

    const boardTab = screen.getByRole('tab', { name: /board/i });
    const tableTab = screen.getByRole('tab', { name: /table/i });

    // Switch to Board
    await user.click(boardTab);
    expect(boardTab).toHaveAttribute('aria-selected', 'true');
    expect(tableTab).toHaveAttribute('aria-selected', 'false');

    // Verify all 4 stage columns exist on board
    expect(screen.getByText('Lead')).toBeInTheDocument();
    expect(screen.getByText('Prospect')).toBeInTheDocument();
    expect(screen.getByText('Qualified')).toBeInTheDocument();
    expect(screen.getByText('Customer')).toBeInTheDocument();

    // Verify empty state for Qualified stage
    expect(screen.getByText('No contacts in this stage')).toBeInTheDocument();

    // Switch back to Table
    await user.click(tableTab);
    expect(tableTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument();
  });

  it('opens contact details panel from table view and displays all 8 fields', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Click on Elena Marchetti row
    const elenaRow = screen.getByRole('button', { name: /open details for elena marchetti/i });
    await user.click(elenaRow);

    // Details panel is rendered
    const panel = screen.getByRole('dialog', { name: /details for elena marchetti/i });
    expect(panel).toBeInTheDocument();

    // Verify read-only fields inside the panel
    expect(panel).toHaveTextContent('elena.marchetti@example.com');
    expect(panel).toHaveTextContent('Birchwood Analytics');
    expect(panel).toHaveTextContent('VP of Marketing');
    expect(panel).toHaveTextContent('Sarah Chen');

    // Verify editable fields: stage select and notes textarea
    const stageSelect = screen.getByLabelText(/stage/i);
    expect(stageSelect).toHaveValue('Lead');

    const notesTextarea = screen.getByLabelText(/notes/i);
    expect(notesTextarea).toHaveValue(
      'Met at the SaaS Connect conference in March. Interested in our analytics dashboard for their marketing team. Follow up with a product demo next week.'
    );

    // Save and Cancel buttons should be disabled initially (isDirty is false)
    const saveButton = screen.getByRole('button', { name: /save/i });
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    expect(saveButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();
  });

  it('edits stage and notes, cancels changes safely', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /open details for elena marchetti/i }));

    const stageSelect = screen.getByLabelText(/stage/i);
    const notesTextarea = screen.getByLabelText(/notes/i);
    const saveButton = screen.getByRole('button', { name: /save/i });
    const cancelButton = screen.getByRole('button', { name: /cancel/i });

    // Change stage to Prospect
    await user.selectOptions(stageSelect, 'Prospect');
    expect(stageSelect).toHaveValue('Prospect');
    expect(saveButton).toBeEnabled();
    expect(cancelButton).toBeEnabled();

    // Modify notes
    await user.type(notesTextarea, ' Additional test note.');

    // Cancel changes
    await user.click(cancelButton);

    // Should revert back to initial state
    expect(stageSelect).toHaveValue('Lead');
    expect(saveButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();
  });

  it('saves stage and notes changes, and synchronizes with Table and Board views', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Open Elena from Table
    await user.click(screen.getByRole('button', { name: /open details for elena marchetti/i }));

    const stageSelect = screen.getByLabelText(/stage/i);
    const notesTextarea = screen.getByLabelText(/notes/i);
    const saveButton = screen.getByRole('button', { name: /save/i });

    // Move Elena from Lead to Qualified (which previously had 0 contacts!)
    await user.selectOptions(stageSelect, 'Qualified');
    await user.clear(notesTextarea);
    await user.type(notesTextarea, 'Successfully qualified through direct call.');

    expect(saveButton).toBeEnabled();
    await user.click(saveButton);

    // Saved indicator should be visible
    expect(screen.getByText('Saved')).toBeInTheDocument();

    // Switch to Board view to check synchronized state
    await user.click(screen.getByRole('tab', { name: /board/i }));

    // Qualified column now has Elena Marchetti! Empty state message should be gone
    expect(screen.queryByText('No contacts in this stage')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /open details for elena marchetti/i })).toBeInTheDocument();

    // Current active view was preserved
    expect(screen.getByRole('tab', { name: /board/i })).toHaveAttribute('aria-selected', 'true');
  });

  it('closes panel and retains active view', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Switch to Board view
    await user.click(screen.getByRole('tab', { name: /board/i }));

    // Open a contact card from Board
    await user.click(screen.getByRole('button', { name: /open details for marcus rivera/i }));
    expect(screen.getByRole('dialog', { name: /details for marcus rivera/i })).toBeInTheDocument();

    // Close panel
    const closeBtn = screen.getByRole('button', { name: /close details panel/i });
    await user.click(closeBtn);

    // Panel is removed
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    // Still on Board view!
    expect(screen.getByRole('tab', { name: /board/i })).toHaveAttribute('aria-selected', 'true');
  });

  it('warns when closing panel with unsaved changes', async () => {
    const user = userEvent.setup();
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false); // Reject discard
    render(<App />);

    await user.click(screen.getByRole('button', { name: /open details for elena marchetti/i }));

    const stageSelect = screen.getByLabelText(/stage/i);
    await user.selectOptions(stageSelect, 'Prospect');

    const closeBtn = screen.getByRole('button', { name: /close details panel/i });
    await user.click(closeBtn);

    expect(confirmSpy).toHaveBeenCalledWith('You have unsaved changes. Discard them and close?');
    // Because user cancelled confirm, panel remains open
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Now confirm discard
    confirmSpy.mockReturnValue(true);
    await user.click(closeBtn);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes panel on Escape key press', async () => {
    render(<App />);

    // Open panel
    fireEvent.click(screen.getByRole('button', { name: /open details for elena marchetti/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Press Escape
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape', code: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
