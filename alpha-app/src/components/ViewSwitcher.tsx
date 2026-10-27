import { LayoutGrid, Table2 } from 'lucide-react';
import type { ViewMode } from '../types/contact';

interface ViewSwitcherProps {
  activeView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export function ViewSwitcher({ activeView, onViewChange }: ViewSwitcherProps) {
  return (
    <div className="inline-flex rounded-lg bg-stone-100 p-0.5" role="tablist" aria-label="View mode">
      <button
        role="tab"
        aria-selected={activeView === 'table'}
        aria-controls="view-panel"
        onClick={() => onViewChange('table')}
        className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-stone-500 ${
          activeView === 'table'
            ? 'bg-white text-stone-900 shadow-sm'
            : 'text-stone-500 hover:text-stone-700'
        }`}
      >
        <Table2 size={15} aria-hidden="true" />
        Table
      </button>
      <button
        role="tab"
        aria-selected={activeView === 'board'}
        aria-controls="view-panel"
        onClick={() => onViewChange('board')}
        className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-stone-500 ${
          activeView === 'board'
            ? 'bg-white text-stone-900 shadow-sm'
            : 'text-stone-500 hover:text-stone-700'
        }`}
      >
        <LayoutGrid size={15} aria-hidden="true" />
        Board
      </button>
    </div>
  );
}
