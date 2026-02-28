import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { TransferPlayer } from '@/app/data/transferData';

interface DefensiveStatsChartProps {
  players: TransferPlayer[];
}

export function DefensiveStatsChart({ players }: DefensiveStatsChartProps) {
  const data = players.map((player) => ({
    name: player.name.split(' ')[1] || player.name,
    Steals: player.stats.spg,
    Blocks: player.stats.bpg,
    'Def Rating': Number(
      ((player.stats.spg + player.stats.bpg + player.stats.rpg) / 3).toFixed(2)
    ),
  }));

  return (
    <div className="bg-white border border-border rounded-lg p-6 shadow-sm">
      <h3 className="text-primary mb-4">Defensive Impact Analysis</h3>
      {data.length === 0 ? (
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">No data</div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
            <Legend />
            <Line type="monotone" dataKey="Steals" stroke="#2D68C4" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="Blocks" stroke="#FFD100" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="Def Rating" stroke="#005587" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
