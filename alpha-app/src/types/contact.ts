export type ContactStage = 'Lead' | 'Prospect' | 'Qualified' | 'Customer';

export const STAGES: ContactStage[] = ['Lead', 'Prospect', 'Qualified', 'Customer'];

export interface Contact {
  id: string;
  name: string;
  email: string | null;
  company: string | null;
  role: string | null;
  owner: string | null;
  labels: string[];
  stage: ContactStage;
  notes: string;
}

export type ViewMode = 'table' | 'board';

export interface Draft {
  stage: ContactStage;
  notes: string;
}
