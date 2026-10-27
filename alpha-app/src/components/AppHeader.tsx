import type { ViewMode } from '../types/contact';
import { ViewSwitcher } from './ViewSwitcher';

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
            <img
              src="/alpha-logo.svg"
              alt="Alpha Contacts Logo"
              className="h-9 w-9 rounded-lg shadow-xs flex-shrink-0"
            />
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
