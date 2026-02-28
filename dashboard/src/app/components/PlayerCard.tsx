import type { TransferPlayer } from '@/app/data/transferData';
import { Award, TrendingUp } from 'lucide-react';

interface PlayerCardProps {
  player: TransferPlayer;
  onClick: (player: TransferPlayer) => void;
  isSelected: boolean;
}

export function PlayerCard({ player, onClick, isSelected }: PlayerCardProps) {
  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'Available':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'Considering':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'Committed':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <div
      onClick={() => onClick(player)}
      className={`bg-white border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-lg ${
        isSelected ? 'border-primary shadow-md' : 'border-border'
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg text-primary mb-1">{player.name}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="bg-accent text-accent-foreground px-2 py-0.5 rounded">
              {player.position}
            </span>
            <span>{player.height}</span>
            <span>•</span>
            <span>{player.year}</span>
          </div>
        </div>
        <span
          className={`px-2 py-1 text-xs rounded border ${getAvailabilityColor(
            player.availability
          )}`}
        >
          {player.availability}
        </span>
      </div>

      <div className="text-sm text-muted-foreground mb-3">
        <Award className="w-4 h-4 inline mr-1" />
        {player.previousSchool}
      </div>

      <div className="grid grid-cols-4 gap-3 pt-3 border-t border-border">
        <div className="text-center">
          <div className="text-xs text-muted-foreground mb-1">PPG</div>
          <div className="text-primary">{player.stats.ppg}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-muted-foreground mb-1">RPG</div>
          <div className="text-primary">{player.stats.rpg}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-muted-foreground mb-1">APG</div>
          <div className="text-primary">{player.stats.apg}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-muted-foreground mb-1">FG%</div>
          <div className="text-primary">{player.stats.fgPercentage.toFixed(1)}%</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-border">
        <div className="text-center">
          <div className="text-xs text-muted-foreground mb-1">3PT%</div>
          <div className="text-sm">
            {player.stats.threePointPercentage > 0
              ? `${player.stats.threePointPercentage.toFixed(1)}%`
              : 'N/A'}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-muted-foreground mb-1">FT%</div>
          <div className="text-sm">{player.stats.ftPercentage.toFixed(1)}%</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-muted-foreground mb-1">MPG</div>
          <div className="text-sm">{player.stats.minutesPerGame.toFixed(1)}</div>
        </div>
      </div>

      {isSelected && (
        <div className="mt-3 pt-3 border-t border-primary/20">
          <div className="flex items-center gap-1 text-xs text-primary">
            <TrendingUp className="w-3 h-3" />
            Selected for comparison
          </div>
        </div>
      )}
    </div>
  );
}
