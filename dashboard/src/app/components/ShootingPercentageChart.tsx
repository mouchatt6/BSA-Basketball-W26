import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import type { TransferPlayer } from '@/app/data/transferData';

interface ShootingPercentageChartProps {
  players: TransferPlayer[];
}

export function ShootingPercentageChart({ players }: ShootingPercentageChartProps) {
  const selectedPlayers = players.slice(0, 3);

  const data = [
    {
      metric: 'FG%',
      ...Object.fromEntries(
        selectedPlayers.map((p) => [p.name.split(' ')[1] || p.name, p.stats.fgPercentage])
      ),
    },
    {
      metric: '3PT%',
      ...Object.fromEntries(
        selectedPlayers.map((p) => [p.name.split(' ')[1] || p.name, p.stats.threePointPercentage || 0])
      ),
    },
    {
      metric: 'FT%',
      ...Object.fromEntries(
        selectedPlayers.map((p) => [p.name.split(' ')[1] || p.name, p.stats.ftPercentage])
      ),
    },
    {
      metric: 'PPG×5',
      ...Object.fromEntries(
        selectedPlayers.map((p) => [p.name.split(' ')[1] || p.name, p.stats.ppg * 5])
      ),
    },
    {
      metric: 'RPG×10',
      ...Object.fromEntries(
        selectedPlayers.map((p) => [p.name.split(' ')[1] || p.name, p.stats.rpg * 10])
      ),
    },
  ];

  const colors = ['#2D68C4', '#FFD100', '#005587'];

  return (
    <div className="bg-white border border-border rounded-lg p-6 shadow-sm">
      <h3 className="text-primary mb-4">Player Performance Radar</h3>
      {selectedPlayers.length === 0 ? (
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">Select players to compare</div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={data}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
            <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
            {selectedPlayers.map((player, index) => (
              <Radar
                key={player.id}
                name={player.name.split(' ')[1] || player.name}
                dataKey={player.name.split(' ')[1] || player.name}
                stroke={colors[index]}
                fill={colors[index]}
                fillOpacity={0.3}
              />
            ))}
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
