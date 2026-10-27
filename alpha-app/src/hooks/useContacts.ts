import { useState, useCallback } from 'react';
import type { Contact, Draft } from '../types/contact';
import { initialContacts } from '../data/contacts';

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);

  const selectedContact = selectedContactId
    ? contacts.find((c) => c.id === selectedContactId) ?? null
    : null;

  const openContact = useCallback(
    (id: string) => {
      const contact = contacts.find((c) => c.id === id);
      if (!contact) return;

      setSelectedContactId(id);
      setDraft({ stage: contact.stage, notes: contact.notes });
    },
    [contacts]
  );

  const closeContact = useCallback(() => {
    setSelectedContactId(null);
    setDraft(null);
  }, []);

  const updateDraft = useCallback(
    (changes: Partial<Draft>) => {
      setDraft((prev) => (prev ? { ...prev, ...changes } : prev));
    },
    []
  );

  const saveContact = useCallback(() => {
    if (!selectedContactId || !draft) return;

    setContacts((current) =>
      current.map((contact) =>
        contact.id === selectedContactId
          ? { ...contact, stage: draft.stage, notes: draft.notes }
          : contact
      )
    );

    // Draft remains at the new saved values (already up to date)
  }, [selectedContactId, draft]);

  const cancelEdit = useCallback(() => {
    if (!selectedContact) return;
    setDraft({ stage: selectedContact.stage, notes: selectedContact.notes });
  }, [selectedContact]);

  const isDirty =
    draft !== null &&
    selectedContact !== null &&
    (draft.stage !== selectedContact.stage ||
      draft.notes !== selectedContact.notes);

  return {
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
  };
}
