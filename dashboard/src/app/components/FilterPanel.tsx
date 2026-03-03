import { Filter, X } from 'lucide-react';

export interface FilterState {
  position: string[];
  availability: string[];
  ppgMin: number;
  ppgMax: number;
  transferOnly: boolean;
}

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export function FilterPanel({ filters, onFilterChange }: FilterPanelProps) {
  const positions = ['PG', 'SG', 'SF', 'PF', 'C'];
  const availabilities = ['Available', 'Considering', 'Committed'];

  const toggleArrayFilter = (
    key: 'position' | 'availability',
    value: string
  ) => {
    const current = filters[key];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onFilterChange({ ...filters, [key]: updated });
  };

  const resetFilters = () => {
    onFilterChange({
      position: [],
      availability: [],
      ppgMin: 0,
      ppgMax: 30,
      transferOnly: false,
    });
  };

  const hasActiveFilters =
    filters.position.length > 0 ||
    filters.availability.length > 0 ||
    filters.ppgMin > 0 ||
    filters.ppgMax < 30 ||
    filters.transferOnly;

  return (
    <div className="bg-white border border-border rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-primary" />
          <h3 className="text-primary">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-muted hover:bg-muted/80 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <label className="text-sm">Transfer Players Only</label>
          <button
            onClick={() => onFilterChange({ ...filters, transferOnly: !filters.transferOnly })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              filters.transferOnly ? 'bg-primary' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                filters.transferOnly ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div>
          <label className="block text-sm mb-2">Position</label>
          <div className="flex flex-wrap gap-2">
            {positions.map((pos) => (
              <button
                key={pos}
                onClick={() => toggleArrayFilter('position', pos)}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                  filters.position.includes(pos)
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {pos}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm mb-2">Availability</label>
          <div className="flex flex-wrap gap-2">
            {availabilities.map((avail) => (
              <button
                key={avail}
                onClick={() => toggleArrayFilter('availability', avail)}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                  filters.availability.includes(avail)
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {avail}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm mb-2">PPG range</label>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{filters.ppgMin}</span>
            <input
              type="range"
              min={0}
              max={30}
              value={filters.ppgMax}
              onChange={(e) =>
                onFilterChange({ ...filters, ppgMax: Number(e.target.value) })
              }
              className="flex-1"
            />
            <span>{filters.ppgMax}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
