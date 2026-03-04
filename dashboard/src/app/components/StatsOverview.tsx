import type { TransferPlayer } from '@/app/data/transferData';
import { TrendingUp, Target, Activity, Award } from 'lucide-react';

interface StatsOverviewProps {
  players: TransferPlayer[];
}

export function StatsOverview({ players }: StatsOverviewProps) {
  if (players.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {['Avg PPG', 'Avg RPG', 'Avg APG', 'Avg FG%'].map((label) => (
          <div
            key={label}
            className="bg-white border border-border rounded-lg p-5 shadow-sm"
          >
            <p className="text-sm text-muted-foreground mb-1">{label}</p>
            <p className="text-2xl text-primary">—</p>
          </div>
        ))}
      </div>
    );
  }

  const avgPPG = (
    players.reduce((sum, p) => sum + p.stats.ppg, 0) / players.length
  ).toFixed(1);
  const avgRPG = (
    players.reduce((sum, p) => sum + p.stats.rpg, 0) / players.length
  ).toFixed(1);
  const avgAPG = (
    players.reduce((sum, p) => sum + p.stats.apg, 0) / players.length
  ).toFixed(1);
  const avgFG = (
    players.reduce((sum, p) => sum + p.stats.fgPercentage, 0) / players.length
  ).toFixed(1);

  const stats = [
    { label: 'Avg PPG', value: avgPPG, icon: TrendingUp, color: 'bg-blue-50 text-blue-600' },
    { label: 'Avg RPG', value: avgRPG, icon: Activity, color: 'bg-yellow-50 text-yellow-600' },
    { label: 'Avg APG', value: avgAPG, icon: Target, color: 'bg-green-50 text-green-600' },
    { label: 'Avg FG%', value: `${avgFG}%`, icon: Award, color: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="bg-white border border-border rounded-lg p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-2xl text-primary">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
