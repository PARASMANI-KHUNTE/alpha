import type { Contact } from '../types/contact';
import { displayValue } from '../utils/contactHelpers';

interface ContactCardProps {
  contact: Contact;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function ContactCard({ contact, isSelected, onSelect }: ContactCardProps) {
  return (
    <button
      type="button"
      data-contact-id={contact.id}
      aria-label={`Open details for ${contact.name}`}
      onClick={() => onSelect(contact.id)}
      className={`w-full text-left rounded-lg border bg-white p-3.5 transition-all hover:shadow-md hover:border-stone-300 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-stone-500 ${
        isSelected
          ? 'border-stone-400 shadow-md ring-1 ring-stone-300'
          : 'border-stone-200 shadow-sm'
      }`}
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-stone-900 text-sm leading-snug truncate">
            {contact.name}
          </h3>
        </div>

        <div className="space-y-1">
          {contact.company && (
            <p className="text-xs text-stone-600 truncate">{contact.company}</p>
          )}
          <p className="text-xs text-stone-500 truncate">
            {displayValue(contact.role || contact.email)}
          </p>
        </div>

        {contact.labels.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-0.5">
            {contact.labels.map((label) => (
              <span
                key={label}
                className="inline-flex items-center rounded-md bg-stone-100 px-1.5 py-0.5 text-[11px] text-stone-600"
              >
                {label}
              </span>
            ))}
          </div>
        )}
      </div>
    </button>
  );
}
