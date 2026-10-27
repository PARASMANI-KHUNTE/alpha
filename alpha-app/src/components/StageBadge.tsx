import type { ContactStage } from '../types/contact';

const stageStyles: Record<ContactStage, string> = {
  Lead: 'bg-amber-50 text-amber-700 ring-amber-200',
  Prospect: 'bg-blue-50 text-blue-700 ring-blue-200',
  Qualified: 'bg-violet-50 text-violet-700 ring-violet-200',
  Customer: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
};

interface StageBadgeProps {
  stage: ContactStage;
  size?: 'sm' | 'md';
}

export function StageBadge({ stage, size = 'sm' }: StageBadgeProps) {
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ring-1 ring-inset whitespace-nowrap ${sizeClasses} ${stageStyles[stage]}`}
    >
      {stage}
    </span>
  );
}
