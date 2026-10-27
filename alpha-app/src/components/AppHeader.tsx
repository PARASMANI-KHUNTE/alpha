import type { ViewMode } from '../types/contact';
import { ViewSwitcher } from './ViewSwitcher';
import { Users } from 'lucide-react';

interface AppHeaderProps {
  contactCount: number;
  activeView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export function AppHeader({ contactCount, activeView, onViewChange }: AppHeaderProps) {
  return (
    <header className="border-b border-stone-200 bg-white">
      <div className="mx-auto max-w-[1440px] px-6 py-5">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-stone-900">
              <Users size={18} className="text-white" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-stone-900 leading-tight">Contacts</h1>
              <p className="text-sm text-stone-500">
                {contactCount} {contactCount === 1 ? 'contact' : 'contacts'}
              </p>
            </div>
          </div>
          <ViewSwitcher activeView={activeView} onViewChange={onViewChange} />
        </div>
      </div>
    </header>
  );
}
