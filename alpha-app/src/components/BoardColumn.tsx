import type { Contact, ContactStage } from '../types/contact';
import { ContactCard } from './ContactCard';
import { StageBadge } from './StageBadge';
import { Inbox } from 'lucide-react';

interface BoardColumnProps {
  stage: ContactStage;
  contacts: Contact[];
  selectedContactId: string | null;
  onSelectContact: (id: string) => void;
}

export function BoardColumn({
  stage,
  contacts,
  selectedContactId,
  onSelectContact,
}: BoardColumnProps) {
  return (
    <div className="flex flex-col min-w-[260px] max-w-[320px] flex-1">
      <div className="flex items-center gap-2 px-1 pb-3">
        <StageBadge stage={stage} size="md" />
        <span className="text-sm font-medium text-stone-400">{contacts.length}</span>
      </div>

      <div className="flex-1 space-y-2.5 rounded-lg bg-stone-50/50 p-2.5 min-h-[120px] border border-stone-100">
        {contacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[100px] text-center px-4">
            <Inbox size={24} className="text-stone-300 mb-2" aria-hidden="true" />
            <p className="text-sm text-stone-400">No contacts in this stage</p>
          </div>
        ) : (
          contacts.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              isSelected={selectedContactId === contact.id}
              onSelect={onSelectContact}
            />
          ))
        )}
      </div>
    </div>
  );
}
