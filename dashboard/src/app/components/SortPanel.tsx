import { ArrowUpDown, ChevronUp, ChevronDown, X } from 'lucide-react';

export type SortField = 'ppg' | 'rpg' | 'apg' | 'tsPercentage' | 'obpm' | 'dbpm';
export type SortDirection = 'asc' | 'desc';

export interface SortState {
  field: SortField | null;
  direction: SortDirection;
}

interface SortPanelProps {
  sort: SortState;
  onSortChange: (sort: SortState) => void;
}

const basicStats: { field: SortField; label: string }[] = [
  { field: 'ppg', label: 'Points' },
  { field: 'rpg', label: 'Rebounds' },
  { field: 'apg', label: 'Assists' },
];

const advancedStats: { field: SortField; label: string }[] = [
  { field: 'tsPercentage', label: 'TS%' },
  { field: 'obpm', label: 'OBPM' },
  { field: 'dbpm', label: 'DBPM' },
];

export function SortPanel({ sort, onSortChange }: SortPanelProps) {
  const handleClick = (field: SortField) => {
    if (sort.field === field) {
      if (sort.direction === 'desc') {
        onSortChange({ field, direction: 'asc' });
      } else {
        onSortChange({ field: null, direction: 'desc' });
      }
    } else {
      onSortChange({ field, direction: 'desc' });
    }
  };

  const renderButton = ({ field, label }: { field: SortField; label: string }) => {
    const isActive = sort.field === field;
    return (
      <button
        key={field}
        onClick={() => handleClick(field)}
        className={`flex items-center justify-between w-full px-3 py-2 rounded-md text-sm transition-colors ${
          isActive
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted hover:bg-muted/80'
        }`}
      >
        <span>{label}</span>
        {isActive ? (
          sort.direction === 'desc' ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronUp className="w-4 h-4" />
          )
        ) : (
          <ArrowUpDown className="w-4 h-4 opacity-40" />
        )}
      </button>
    );
  };

  return (
    <div className="bg-white border border-border rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-5 h-5 text-primary" />
          <h3 className="text-primary">Sort</h3>
        </div>
        {sort.field && (
          <button
            onClick={() => onSortChange({ field: null, direction: 'desc' })}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-muted hover:bg-muted/80 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm mb-2">Basic Stats</label>
          <div className="space-y-2">
            {basicStats.map(renderButton)}
          </div>
        </div>

        <div>
          <label className="block text-sm mb-2">Advanced</label>
          <div className="space-y-2">
            {advancedStats.map(renderButton)}
          </div>
        </div>
      </div>
    </div>
  );
}
