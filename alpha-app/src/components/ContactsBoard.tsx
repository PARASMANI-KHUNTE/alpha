import type { Contact } from '../types/contact';
import { STAGES } from '../types/contact';
import { groupByStage } from '../utils/contactHelpers';
import { BoardColumn } from './BoardColumn';

interface ContactsBoardProps {
  contacts: Contact[];
  selectedContactId: string | null;
  onSelectContact: (id: string) => void;
}

export function ContactsBoard({
  contacts,
  selectedContactId,
  onSelectContact,
}: ContactsBoardProps) {
  const grouped = groupByStage(contacts);

  return (
    <div className="flex gap-4 overflow-x-auto pb-4" role="tabpanel" id="view-panel">
      {STAGES.map((stage) => (
        <BoardColumn
          key={stage}
          stage={stage}
          contacts={grouped[stage]}
          selectedContactId={selectedContactId}
          onSelectContact={onSelectContact}
        />
      ))}
    </div>
  );
}
