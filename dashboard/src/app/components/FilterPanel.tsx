import { Filter, X } from 'lucide-react';

export interface FilterState {
  position: string[];
  year: string[];
  availability: string[];
  ppgMin: number;
  ppgMax: number;
}

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export function FilterPanel({ filters, onFilterChange }: FilterPanelProps) {
  const positions = ['PG', 'SG', 'SF', 'PF', 'C'];
  const years = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate'];
  const availabilities = ['Available', 'Considering', 'Committed'];

  const toggleArrayFilter = (
    key: 'position' | 'year' | 'availability',
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
      year: [],
      availability: [],
      ppgMin: 0,
      ppgMax: 30,
    });
  };

  const hasActiveFilters =
    filters.position.length > 0 ||
    filters.year.length > 0 ||
    filters.availability.length > 0 ||
    filters.ppgMin > 0 ||
    filters.ppgMax < 30;

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
          <label className="block text-sm mb-2">Year</label>
          <div className="flex flex-wrap gap-2">
            {years.map((yr) => (
              <button
                key={yr}
                onClick={() => toggleArrayFilter('year', yr)}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                  filters.year.includes(yr)
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {yr}
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
