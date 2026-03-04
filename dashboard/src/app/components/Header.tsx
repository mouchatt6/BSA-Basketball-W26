import { Users } from 'lucide-react';

interface HeaderProps {
  playerCount: number;
}

export function Header({ playerCount }: HeaderProps) {
  return (
    <div className="bg-primary text-primary-foreground shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl mb-2">WBB Transfer Portal</h1>
            <p className="text-lg opacity-90">Dashboard</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4 border border-white/20">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8" />
              <div>
                <div className="text-2xl">{playerCount}</div>
                <div className="text-sm opacity-90">Players</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
