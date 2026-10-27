import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useContacts } from '../hooks/useContacts';

describe('useContacts hook', () => {
  it('initializes with seed contacts and no selected contact', () => {
    const { result } = renderHook(() => useContacts());
    expect(result.current.contacts.length).toBe(10);
    expect(result.current.selectedContactId).toBeNull();
    expect(result.current.selectedContact).toBeNull();
    expect(result.current.draft).toBeNull();
    expect(result.current.isDirty).toBe(false);
  });

  it('opens a contact and initializes the draft correctly', () => {
    const { result } = renderHook(() => useContacts());
    const firstContact = result.current.contacts[0];

    act(() => {
      result.current.openContact(firstContact.id);
    });

    expect(result.current.selectedContactId).toBe(firstContact.id);
    expect(result.current.selectedContact?.name).toBe(firstContact.name);
    expect(result.current.draft).toEqual({
      stage: firstContact.stage,
      notes: firstContact.notes,
    });
    expect(result.current.isDirty).toBe(false);
  });

  it('tracks dirty status when draft is modified', () => {
    const { result } = renderHook(() => useContacts());
    const firstContact = result.current.contacts[0];

    act(() => {
      result.current.openContact(firstContact.id);
    });

    act(() => {
      result.current.updateDraft({ notes: 'Updated notes content' });
    });

    expect(result.current.isDirty).toBe(true);
    expect(result.current.draft?.notes).toBe('Updated notes content');
    // Ensure canonical contact is untouched until saved
    expect(result.current.selectedContact?.notes).toBe(firstContact.notes);
  });

  it('cancels changes and reverts draft to canonical values', () => {
    const { result } = renderHook(() => useContacts());
    const firstContact = result.current.contacts[0];

    act(() => {
      result.current.openContact(firstContact.id);
      result.current.updateDraft({ stage: 'Customer', notes: 'Draft note' });
    });

    expect(result.current.isDirty).toBe(true);

    act(() => {
      result.current.cancelEdit();
    });

    expect(result.current.isDirty).toBe(false);
    expect(result.current.draft).toEqual({
      stage: firstContact.stage,
      notes: firstContact.notes,
    });
  });

  it('saves changes and updates canonical contacts list', () => {
    const { result } = renderHook(() => useContacts());
    const firstContact = result.current.contacts[0];

    act(() => {
      result.current.openContact(firstContact.id);
      result.current.updateDraft({ stage: 'Qualified', notes: 'Now qualified' });
    });

    act(() => {
      result.current.saveContact();
    });

    expect(result.current.isDirty).toBe(false);
    expect(result.current.selectedContact?.stage).toBe('Qualified');
    expect(result.current.selectedContact?.notes).toBe('Now qualified');

    // Check in contacts collection
    const updatedInList = result.current.contacts.find((c) => c.id === firstContact.id);
    expect(updatedInList?.stage).toBe('Qualified');
    expect(updatedInList?.notes).toBe('Now qualified');
  });

  it('closes contact and clears draft', () => {
    const { result } = renderHook(() => useContacts());
    act(() => {
      result.current.openContact(result.current.contacts[0].id);
    });
    expect(result.current.selectedContactId).not.toBeNull();

    act(() => {
      result.current.closeContact();
    });

    expect(result.current.selectedContactId).toBeNull();
    expect(result.current.selectedContact).toBeNull();
    expect(result.current.draft).toBeNull();
  });
});
