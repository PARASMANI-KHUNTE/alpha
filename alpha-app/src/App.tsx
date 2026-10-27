import { useState, useCallback, useRef } from 'react';
import type { ViewMode } from './types/contact';
import { useContacts } from './hooks/useContacts';
import { AppHeader } from './components/AppHeader';
import { ContactsTable } from './components/ContactsTable';
import { ContactsBoard } from './components/ContactsBoard';
import { ContactDetailsPanel } from './components/ContactDetailsPanel';

function App() {
  const [activeView, setActiveView] = useState<ViewMode>('table');
  const {
    contacts,
    selectedContact,
    selectedContactId,
    draft,
    isDirty,
    openContact,
    closeContact,
    updateDraft,
    saveContact,
    cancelEdit,
  } = useContacts();

  // Track the element that opened the panel so we can restore focus
  const triggerRef = useRef<HTMLElement | null>(null);

  const handleSelectContact = useCallback(
    (id: string) => {
      // Save the triggering element for focus restoration
      triggerRef.current = document.activeElement as HTMLElement;
      openContact(id);
    },
    [openContact]
  );

  const handleClose = useCallback(() => {
    closeContact();
    // Restore focus to the triggering element
    requestAnimationFrame(() => {
      if (triggerRef.current && document.body.contains(triggerRef.current)) {
        triggerRef.current.focus();
      }
      triggerRef.current = null;
    });
  }, [closeContact]);

  const handleViewChange = useCallback(
    (view: ViewMode) => {
      // If panel is open with dirty draft, warn before switching
      // For this exercise, we keep the panel open during view switches
      setActiveView(view);
    },
    []
  );

  const isPanelOpen = selectedContact !== null && draft !== null;

  return (
    <div className="flex flex-col h-screen bg-stone-50">
      <AppHeader
        contactCount={contacts.length}
        activeView={activeView}
        onViewChange={handleViewChange}
      />

      <div className="flex flex-1 min-h-0">
        {/* Main content area */}
        <main
          className={`flex-1 overflow-auto p-6 transition-all ${
            isPanelOpen ? 'pr-0' : ''
          }`}
          id="view-panel"
        >
          <div className="mx-auto max-w-[1440px]">
            {activeView === 'table' ? (
              <ContactsTable
                contacts={contacts}
                selectedContactId={selectedContactId}
                onSelectContact={handleSelectContact}
              />
            ) : (
              <ContactsBoard
                contacts={contacts}
                selectedContactId={selectedContactId}
                onSelectContact={handleSelectContact}
              />
            )}
          </div>
        </main>

        {/* Details side panel */}
        {isPanelOpen && (
          <ContactDetailsPanel
            contact={selectedContact}
            draft={draft}
            isDirty={isDirty}
            onUpdateDraft={updateDraft}
            onSave={saveContact}
            onCancel={cancelEdit}
            onClose={handleClose}
          />
        )}
      </div>
    </div>
  );
}

export default App;
