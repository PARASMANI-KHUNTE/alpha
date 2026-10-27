import type { Contact, ContactStage } from '../types/contact';

/** Render a consistent placeholder for missing optional values */
export function displayValue(value: string | null | undefined): string {
  return value?.trim() ? value : '—';
}

/** Format labels for display; returns fallback text when empty */
export function displayLabels(labels: string[]): string {
  return labels.length > 0 ? labels.join(', ') : 'No labels';
}

/** Group contacts by their current stage */
export function groupByStage(
  contacts: Contact[]
): Record<ContactStage, Contact[]> {
  const groups: Record<ContactStage, Contact[]> = {
    Lead: [],
    Prospect: [],
    Qualified: [],
    Customer: [],
  };

  for (const contact of contacts) {
    groups[contact.stage].push(contact);
  }

  return groups;
}

/** Get the count of contacts in each stage */
export function stageCounts(
  contacts: Contact[]
): Record<ContactStage, number> {
  const groups = groupByStage(contacts);
  return {
    Lead: groups.Lead.length,
    Prospect: groups.Prospect.length,
    Qualified: groups.Qualified.length,
    Customer: groups.Customer.length,
  };
}
