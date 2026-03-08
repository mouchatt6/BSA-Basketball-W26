import { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { FilterPanel, type FilterState } from './components/FilterPanel';
import { SortPanel, type SortState } from './components/SortPanel';
import { PlayerCard } from './components/PlayerCard';
import { StatsOverview } from './components/StatsOverview';
import { PointsComparisonChart } from './components/PointsComparisonChart';
import { ShootingPercentageChart } from './components/ShootingPercentageChart';
import { StatsScatterChart } from './components/StatsScatterChart';
import { PositionDistributionChart } from './components/PositionDistributionChart';
import { DefensiveStatsChart } from './components/DefensiveStatsChart';
import { PlayerComparisonModal } from './components/PlayerComparisonModal';
import { getTransferPlayers, type TransferPlayer } from './data/transferData';
import { BarChart3, GitCompare, Search } from 'lucide-react';

export default function App() {
  const players = useMemo(() => getTransferPlayers(), []);
  const allTeams = useMemo(() => [...new Set(players.map((p) => p.previousSchool))].sort(), [players]);

  const [filters, setFilters] = useState<FilterState>({
    position: [],
    availability: [],
    classYear: [],
    team: [],
    ppgMin: 0,
    ppgMax: 30,
    transferOnly: false,
  });

  const [selectedPlayers, setSelectedPlayers] = useState<TransferPlayer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sort, setSort] = useState<SortState>({ field: null, direction: 'desc' });
  const [showComparisonModal, setShowComparisonModal] = useState(false);

  const filteredPlayers = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return players.filter((player) => {
      if (filters.transferOnly && !player.transferInfo) return false;
      if (query && !player.name.toLowerCase().includes(query) && !player.previousSchool.toLowerCase().includes(query)) return false;
      if (filters.position.length > 0 && !filters.position.includes(player.position)) return false;
      if (filters.availability.length > 0 && !filters.availability.includes(player.availability)) return false;
      if (filters.classYear.length > 0 && !filters.classYear.includes(player.year)) return false;
      if (filters.team.length > 0 && !filters.team.includes(player.previousSchool)) return false;
      if (player.stats.ppg < filters.ppgMin || player.stats.ppg > filters.ppgMax) return false;
      return true;
    });
  }, [players, filters, searchQuery]);

  const sortedPlayers = useMemo(() => {
    if (!sort.field) return filteredPlayers;
    const field = sort.field;
    const dir = sort.direction === 'desc' ? -1 : 1;
    return [...filteredPlayers].sort((a, b) => {
      const aVal = a.stats[field];
      const bVal = b.stats[field];
      return (aVal - bVal) * dir;
    });
  }, [filteredPlayers, sort]);

  const MAX_DISPLAY = 20;
  const cappedPlayers = sortedPlayers.slice(0, MAX_DISPLAY);

  const handlePlayerClick = (player: TransferPlayer) => {
    setSelectedPlayers((prev) => {
      const isSelected = prev.some((p) => p.id === player.id);
      if (isSelected) return prev.filter((p) => p.id !== player.id);
      if (prev.length >= 3) return [...prev.slice(1), player];
      return [...prev, player];
    });
  };

  const displayPlayers = selectedPlayers.length > 0 ? selectedPlayers : filteredPlayers;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header playerCount={filteredPlayers.length} />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <StatsOverview players={filteredPlayers} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
          <div className="lg:col-span-1">
            <FilterPanel filters={filters} onFilterChange={setFilters} teams={allTeams} />
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white border border-border rounded-lg p-6 shadow-sm mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-primary">All Players</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {selectedPlayers.length > 0 && (
                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm">
                      {selectedPlayers.length} selected
                    </span>
                  )}
                  {selectedPlayers.length >= 2 && (
                    <button
                      onClick={() => setShowComparisonModal(true)}
                      className="flex items-center gap-1 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm hover:opacity-90 transition-opacity"
                    >
                      <GitCompare className="w-3.5 h-3.5" />
                      Compare
                    </button>
                  )}
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Click on players to select them for comparison in the charts below (max 3)
              </p>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by player name or school..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
              {sortedPlayers.length > MAX_DISPLAY && (
                <p className="text-sm text-muted-foreground mb-4">
                  Showing {MAX_DISPLAY} of {sortedPlayers.length} results
                </p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cappedPlayers.map((player) => (
                  <PlayerCard
                    key={player.id}
                    player={player}
                    onClick={handlePlayerClick}
                    isSelected={selectedPlayers.some((p) => p.id === player.id)}
                  />
                ))}
              </div>
              {filteredPlayers.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No players match the current filters</p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <SortPanel sort={sort} onSortChange={setSort} />
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-primary mb-4">Analytics Dashboard</h2>
          <p className="text-sm text-muted-foreground mb-6">
            {selectedPlayers.length > 0
              ? `Viewing analytics for selected players (${selectedPlayers.length})`
              : 'Viewing analytics for all filtered players'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <PointsComparisonChart players={displayPlayers} />
          <StatsScatterChart players={displayPlayers} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ShootingPercentageChart players={displayPlayers} />
          <PositionDistributionChart players={filteredPlayers} />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <DefensiveStatsChart players={displayPlayers} />
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground border-t border-border pt-6">
          <p>Bruin Sports Analaytics WBB Stats & Recruiting Dashboard</p>
          <p className="mt-1">Data: Sports Reference 2024-25 season</p>
        </div>
      </div>

      {showComparisonModal && (
        <PlayerComparisonModal
          players={selectedPlayers}
          onClose={() => setShowComparisonModal(false)}
        />
      )}
    </div>
  );
}
