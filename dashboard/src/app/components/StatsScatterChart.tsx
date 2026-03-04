import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
  Legend,
} from 'recharts';
import type { TransferPlayer } from '@/app/data/transferData';

interface StatsScatterChartProps {
  players: TransferPlayer[];
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: { name: string; ppg: number; efficiency: number; minutesPerGame: number } }> }) {
  if (active && payload && payload.length) {
    const p = payload[0].payload;
    return (
      <div className="bg-white border border-border rounded-lg p-3 shadow-lg">
        <p className="font-medium text-primary">{p.name}</p>
        <p className="text-sm">PPG: {p.ppg}</p>
        <p className="text-sm">Efficiency: {p.efficiency}%</p>
        <p className="text-sm">MPG: {p.minutesPerGame}</p>
      </div>
    );
  }
  return null;
}

export function StatsScatterChart({ players }: StatsScatterChartProps) {
  const data = players.map((player) => {
    const eff =
      (player.stats.fgPercentage +
        player.stats.ftPercentage +
        (player.stats.threePointPercentage || 0)) /
      3;
    return {
      name: player.name,
      ppg: player.stats.ppg,
      efficiency: Number(eff.toFixed(1)),
      minutesPerGame: player.stats.minutesPerGame,
    };
  });

  return (
    <div className="bg-white border border-border rounded-lg p-6 shadow-sm">
      <h3 className="text-primary mb-4">PPG vs Shooting Efficiency</h3>
      <p className="text-sm text-muted-foreground mb-4">Bubble size represents minutes per game</p>
      {data.length === 0 ? (
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">No data</div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis type="number" dataKey="ppg" name="Points Per Game" tick={{ fontSize: 12 }} label={{ value: 'Points Per Game', position: 'bottom', fontSize: 12 }} />
            <YAxis type="number" dataKey="efficiency" name="Efficiency" tick={{ fontSize: 12 }} label={{ value: 'Shooting Efficiency %', angle: -90, position: 'insideLeft', fontSize: 12 }} />
            <ZAxis type="number" dataKey="minutesPerGame" range={[50, 400]} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Scatter name="Players" data={data} fill="#2D68C4" fillOpacity={0.6} />
          </ScatterChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
