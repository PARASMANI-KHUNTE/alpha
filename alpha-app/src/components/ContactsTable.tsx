import type { Contact } from '../types/contact';
import { StageBadge } from './StageBadge';
import { displayValue } from '../utils/contactHelpers';
import { ChevronRight } from 'lucide-react';

interface ContactsTableProps {
  contacts: Contact[];
  selectedContactId: string | null;
  onSelectContact: (id: string) => void;
}

export function ContactsTable({
  contacts,
  selectedContactId,
  onSelectContact,
}: ContactsTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-stone-200 bg-white">
      <table className="w-full min-w-[720px] text-sm">
        <thead>
          <tr className="border-b border-stone-200 bg-stone-50/60">
            <th className="px-4 py-3 text-left font-medium text-stone-500 w-[200px]">Name</th>
            <th className="px-4 py-3 text-left font-medium text-stone-500 w-[200px]">Email</th>
            <th className="px-4 py-3 text-left font-medium text-stone-500 w-[160px]">Company</th>
            <th className="px-4 py-3 text-left font-medium text-stone-500 w-[110px]">Stage</th>
            <th className="px-4 py-3 text-left font-medium text-stone-500 w-[140px]">Owner</th>
            <th className="px-4 py-3 text-left font-medium text-stone-500">Labels</th>
            <th className="px-4 py-3 w-10">
              <span className="sr-only">Open</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {contacts.map((contact) => (
            <tr
              key={contact.id}
              data-contact-id={contact.id}
              role="button"
              tabIndex={0}
              aria-label={`Open details for ${contact.name}`}
              onClick={() => onSelectContact(contact.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectContact(contact.id);
                }
              }}
              className={`cursor-pointer transition-colors hover:bg-stone-50 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-stone-500 ${
                selectedContactId === contact.id
                  ? 'bg-stone-50 ring-1 ring-inset ring-stone-300'
                  : ''
              }`}
            >
              <td className="px-4 py-3">
                <span className="font-medium text-stone-900 truncate block max-w-[200px]">
                  {contact.name}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className="text-stone-600 truncate block max-w-[200px]">
                  {displayValue(contact.email)}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className="text-stone-600 truncate block max-w-[160px]">
                  {displayValue(contact.company)}
                </span>
              </td>
              <td className="px-4 py-3">
                <StageBadge stage={contact.stage} />
              </td>
              <td className="px-4 py-3">
                <span className="text-stone-600 truncate block max-w-[140px]">
                  {displayValue(contact.owner)}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {contact.labels.length > 0 ? (
                    contact.labels.map((label) => (
                      <span
                        key={label}
                        className="inline-flex items-center rounded-md bg-stone-100 px-1.5 py-0.5 text-xs text-stone-600"
                      >
                        {label}
                      </span>
                    ))
                  ) : (
                    <span className="text-stone-400 text-xs italic">No labels</span>
                  )}
                </div>
              </td>
              <td className="px-4 py-3 text-stone-400">
                <ChevronRight size={16} aria-hidden="true" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
