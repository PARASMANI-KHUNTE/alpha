import { useEffect, useRef, useCallback } from 'react';
import type { Contact, ContactStage, Draft } from '../types/contact';
import { STAGES } from '../types/contact';
import { displayValue } from '../utils/contactHelpers';
import { StageBadge } from './StageBadge';
import { X, Save, RotateCcw, Check } from 'lucide-react';

interface ContactDetailsPanelProps {
  contact: Contact;
  draft: Draft;
  isDirty: boolean;
  onUpdateDraft: (changes: Partial<Draft>) => void;
  onSave: () => void;
  onCancel: () => void;
  onClose: () => void;
}

export function ContactDetailsPanel({
  contact,
  draft,
  isDirty,
  onUpdateDraft,
  onSave,
  onCancel,
  onClose,
}: ContactDetailsPanelProps) {
  const panelRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const showSavedRef = useRef(false);
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Focus panel heading on open
  useEffect(() => {
    closeButtonRef.current?.focus();
  }, [contact.id]);

  // Clean up saved timer on unmount
  useEffect(() => {
    return () => {
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
    };
  }, []);

  const handleClose = useCallback(() => {
    if (isDirty) {
      const confirmed = window.confirm(
        'You have unsaved changes. Discard them and close?'
      );
      if (!confirmed) return;
    }
    onClose();
  }, [isDirty, onClose]);

  const handleSave = useCallback(() => {
    onSave();
    // Show saved confirmation
    showSavedRef.current = true;
    // Force re-render by using a state trick through the parent
    // Instead, let's use a local mechanism
    const el = document.getElementById('save-confirmation');
    if (el) {
      el.classList.remove('opacity-0');
      el.classList.add('opacity-100');
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
      savedTimerRef.current = setTimeout(() => {
        el.classList.remove('opacity-100');
        el.classList.add('opacity-0');
      }, 2000);
    }
  }, [onSave]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        handleClose();
      }
    },
    [handleClose]
  );

  return (
    <aside
      ref={panelRef}
      role="dialog"
      aria-label={`Details for ${contact.name}`}
      onKeyDown={handleKeyDown}
      className="flex flex-col h-full w-full max-w-[420px] min-w-[320px] border-l border-stone-200 bg-white overflow-y-auto"
    >
      {/* Panel header */}
      <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
        <h2 className="text-base font-semibold text-stone-900 truncate pr-4">
          {contact.name}
        </h2>
        <button
          ref={closeButtonRef}
          type="button"
          aria-label="Close details panel"
          onClick={handleClose}
          className="flex-shrink-0 rounded-md p-1.5 text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-stone-500"
        >
          <X size={18} />
        </button>
      </div>

      {/* Panel body */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
        {/* Read-only fields */}
        <div className="space-y-4">
          <DetailField label="Name" value={contact.name} />
          <DetailField label="Email" value={displayValue(contact.email)} />
          <DetailField label="Company" value={displayValue(contact.company)} />
          <DetailField label="Role" value={displayValue(contact.role)} />
          <DetailField label="Owner" value={displayValue(contact.owner)} />
          <div>
            <dt className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-1.5">
              Labels
            </dt>
            <dd>
              {contact.labels.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {contact.labels.map((label) => (
                    <span
                      key={label}
                      className="inline-flex items-center rounded-md bg-stone-100 px-2 py-0.5 text-xs text-stone-700"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-sm text-stone-400 italic">No labels</span>
              )}
            </dd>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-stone-200" />

        {/* Editable fields */}
        <div className="space-y-4">
          <div>
            <label
              htmlFor="stage-select"
              className="block text-xs font-medium text-stone-500 uppercase tracking-wide mb-1.5"
            >
              Stage
              <span className="ml-1.5 text-[10px] font-normal normal-case text-stone-400 tracking-normal">
                (editable)
              </span>
            </label>
            <div className="relative">
              <select
                id="stage-select"
                value={draft.stage}
                onChange={(e) =>
                  onUpdateDraft({ stage: e.target.value as ContactStage })
                }
                className="w-full appearance-none rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 shadow-sm focus:border-stone-500 focus:ring-1 focus:ring-stone-500 focus:outline-none transition-colors"
              >
                {STAGES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <svg
                  className="h-4 w-4 text-stone-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            {/* Show current vs draft stage */}
            {draft.stage !== contact.stage && (
              <div className="mt-2 flex items-center gap-2 text-xs">
                <span className="text-stone-400">Current:</span>
                <StageBadge stage={contact.stage} />
                <span className="text-stone-400">→</span>
                <StageBadge stage={draft.stage} />
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="notes-textarea"
              className="block text-xs font-medium text-stone-500 uppercase tracking-wide mb-1.5"
            >
              Notes
              <span className="ml-1.5 text-[10px] font-normal normal-case text-stone-400 tracking-normal">
                (editable)
              </span>
            </label>
            <textarea
              id="notes-textarea"
              value={draft.notes}
              onChange={(e) => onUpdateDraft({ notes: e.target.value })}
              rows={5}
              placeholder="Add notes about this contact…"
              className="w-full resize-y rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 shadow-sm placeholder:text-stone-400 focus:border-stone-500 focus:ring-1 focus:ring-stone-500 focus:outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Panel footer — actions */}
      <div className="border-t border-stone-200 px-5 py-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={!isDirty}
            className="inline-flex items-center gap-1.5 rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-stone-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-500 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-stone-900"
          >
            <Save size={15} aria-hidden="true" />
            Save
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={!isDirty}
            className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 shadow-sm transition-colors hover:bg-stone-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-500 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <RotateCcw size={15} aria-hidden="true" />
            Cancel
          </button>

          {/* Save confirmation */}
          <div
            id="save-confirmation"
            className="ml-auto flex items-center gap-1 text-emerald-600 text-sm font-medium opacity-0 transition-opacity duration-300"
            aria-live="polite"
          >
            <Check size={15} aria-hidden="true" />
            Saved
          </div>
        </div>
      </div>
    </aside>
  );
}

/** Small helper for read-only fields in the panel */
function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-1">
        {label}
      </dt>
      <dd className="text-sm text-stone-900">{value}</dd>
    </div>
  );
}
