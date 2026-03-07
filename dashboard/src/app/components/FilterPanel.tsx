import { useState } from 'react';
import { Filter, X, Search } from 'lucide-react';

export interface FilterState {
  position: string[];
  availability: string[];
  classYear: string[];
  team: string[];
  ppgMin: number;
  ppgMax: number;
  transferOnly: boolean;
}

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  teams: string[];
}

export function FilterPanel({ filters, onFilterChange, teams }: FilterPanelProps) {
  const [teamSearch, setTeamSearch] = useState('');
  const [teamDropdownOpen, setTeamDropdownOpen] = useState(false);

  const filteredTeams = teamSearch
    ? teams.filter((t) => t.toLowerCase().includes(teamSearch.toLowerCase())).slice(0, 10)
    : [];

  const toggleTeam = (team: string) => {
    const updated = filters.team.includes(team)
      ? filters.team.filter((t) => t !== team)
      : [...filters.team, team];
    onFilterChange({ ...filters, team: updated });
  };
  const positions = ['G', 'F', 'C'];
  const availabilities = ['Available', 'Considering', 'Committed'];
  const classYears = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate'];

  const toggleArrayFilter = (
    key: 'position' | 'availability' | 'classYear',
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
      classYear: [],
      team: [],
      ppgMin: 0,
      ppgMax: 30,
      transferOnly: false,
    });
  };

  const hasActiveFilters =
    filters.position.length > 0 ||
    filters.availability.length > 0 ||
    filters.classYear.length > 0 ||
    filters.team.length > 0 ||
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
          <label className="block text-sm mb-2">Class Year</label>
          <div className="flex flex-wrap gap-2">
            {classYears.map((year) => (
              <button
                key={year}
                onClick={() => toggleArrayFilter('classYear', year)}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                  filters.classYear.includes(year)
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {year}
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
          <label className="block text-sm mb-2">Team</label>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search teams..."
              value={teamSearch}
              onChange={(e) => {
                setTeamSearch(e.target.value);
                setTeamDropdownOpen(true);
              }}
              onFocus={() => setTeamDropdownOpen(true)}
              className="w-full pl-8 pr-3 py-1.5 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
            {teamDropdownOpen && filteredTeams.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-border rounded-md shadow-lg max-h-40 overflow-y-auto">
                {filteredTeams.map((team) => (
                  <button
                    key={team}
                    onClick={() => {
                      toggleTeam(team);
                      setTeamSearch('');
                      setTeamDropdownOpen(false);
                    }}
                    className={`block w-full text-left px-3 py-1.5 text-sm hover:bg-muted transition-colors ${
                      filters.team.includes(team) ? 'bg-primary/10 text-primary' : ''
                    }`}
                  >
                    {team}
                  </button>
                ))}
              </div>
            )}
          </div>
          {filters.team.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {filters.team.map((team) => (
                <span
                  key={team}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary text-primary-foreground rounded text-xs"
                >
                  {team}
                  <button onClick={() => toggleTeam(team)} className="hover:opacity-70">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
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
