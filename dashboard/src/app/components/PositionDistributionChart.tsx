import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import type { TransferPlayer } from '@/app/data/transferData';

interface PositionDistributionChartProps {
  players: TransferPlayer[];
}

function CustomTooltip({
  active,
  payload,
  total,
}: {
  active?: boolean;
  payload?: Array<{ payload?: { value: number }; name?: string; value?: number }>;
  total: number;
}) {
  if (active && payload && payload.length) {
    const value = payload[0].value ?? payload[0].payload?.value ?? 0;
    const percentage = total ? ((value / total) * 100).toFixed(1) : '0';
    const name = payload[0].name ?? '';
    return (
      <div className="bg-white border border-border rounded-lg p-3 shadow-lg">
        <p className="font-medium text-primary">{name}</p>
        <p className="text-sm">Players: {value}</p>
        <p className="text-sm">Percentage: {percentage}%</p>
      </div>
    );
  }
  return null;
}

export function PositionDistributionChart({ players }: PositionDistributionChartProps) {
  const positionCounts = players.reduce((acc, player) => {
    acc[player.position] = (acc[player.position] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(positionCounts).map(([position, count]) => ({
    name: position,
    value: count,
  }));

  const COLORS = ['#2D68C4', '#FFD100', '#8BB8E8', '#005587', '#FFC72C'];

  return (
    <div className="bg-white border border-border rounded-lg p-6 shadow-sm">
      <h3 className="text-primary mb-4">Position Distribution</h3>
      {data.length === 0 ? (
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">No data</div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip total={players.length} />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
