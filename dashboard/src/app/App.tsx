import { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { FilterPanel, type FilterState } from './components/FilterPanel';
import { PlayerCard } from './components/PlayerCard';
import { StatsOverview } from './components/StatsOverview';
import { PointsComparisonChart } from './components/PointsComparisonChart';
import { ShootingPercentageChart } from './components/ShootingPercentageChart';
import { StatsScatterChart } from './components/StatsScatterChart';
import { PositionDistributionChart } from './components/PositionDistributionChart';
import { DefensiveStatsChart } from './components/DefensiveStatsChart';
import { getTransferPlayers, type TransferPlayer } from './data/transferData';
import { BarChart3 } from 'lucide-react';

export default function App() {
  const players = useMemo(() => getTransferPlayers(), []);

  const [filters, setFilters] = useState<FilterState>({
    position: [],
    year: [],
    availability: [],
    ppgMin: 0,
    ppgMax: 30,
  });

  const [selectedPlayers, setSelectedPlayers] = useState<TransferPlayer[]>([]);

  const filteredPlayers = useMemo(() => {
    return players.filter((player) => {
      if (filters.position.length > 0 && !filters.position.includes(player.position)) return false;
      if (filters.year.length > 0 && !filters.year.includes(player.year)) return false;
      if (filters.availability.length > 0 && !filters.availability.includes(player.availability)) return false;
      if (player.stats.ppg < filters.ppgMin || player.stats.ppg > filters.ppgMax) return false;
      return true;
    });
  }, [players, filters]);

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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-1">
            <FilterPanel filters={filters} onFilterChange={setFilters} />
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white border border-border rounded-lg p-6 shadow-sm mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-primary">Transfer Players</h2>
                <div className="text-sm text-muted-foreground">
                  {selectedPlayers.length > 0 && (
                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full">
                      {selectedPlayers.length} selected
                    </span>
                  )}
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Click on players to select them for comparison in the charts below (max 3)
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredPlayers.map((player) => (
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
          <p>WBB Transfer Portal Dashboard</p>
          <p className="mt-1">Data: mock; super tables in data/player_tables/batch2_supers/ (see player-tables-scraper.ipynb)</p>
        </div>
      </div>
    </div>
  );
}
