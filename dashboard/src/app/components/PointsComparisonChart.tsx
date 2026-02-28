import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { TransferPlayer } from '@/app/data/transferData';

interface PointsComparisonChartProps {
  players: TransferPlayer[];
}

export function PointsComparisonChart({ players }: PointsComparisonChartProps) {
  const data = players.map((player) => ({
    name: player.name.split(' ')[1] || player.name,
    PPG: player.stats.ppg,
    RPG: player.stats.rpg,
    APG: player.stats.apg,
  }));

  return (
    <div className="bg-white border border-border rounded-lg p-6 shadow-sm">
      <h3 className="text-primary mb-4">Points, Rebounds & Assists Comparison</h3>
      {data.length === 0 ? (
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">No data</div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
            <Legend />
            <Bar dataKey="PPG" fill="#2D68C4" radius={[4, 4, 0, 0]} />
            <Bar dataKey="RPG" fill="#FFD100" radius={[4, 4, 0, 0]} />
            <Bar dataKey="APG" fill="#8BB8E8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
