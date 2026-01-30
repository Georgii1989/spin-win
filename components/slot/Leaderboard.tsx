'use client';

import { useGameStore } from '@/store/gameStore';

interface LeaderboardEntry {
  rank: number;
  username: string;
  credits: number;
  isCurrentUser: boolean;
}

export function Leaderboard(): JSX.Element {
  const credits = useGameStore((state: ReturnType<typeof useGameStore.getState>) => state.credits);

  const mockLeaderboard: LeaderboardEntry[] = [
    { rank: 1, username: 'CryptoKing', credits: 50000, isCurrentUser: false },
    { rank: 2, username: 'LuckyWhale', credits: 35000, isCurrentUser: false },
    { rank: 3, username: 'SlotMaster', credits: 28000, isCurrentUser: false },
    { rank: 4, username: 'DiamondHands', credits: 22000, isCurrentUser: false },
    { rank: 5, username: 'NeonRider', credits: 18000, isCurrentUser: false },
    { rank: 6, username: 'You', credits: credits, isCurrentUser: true },
    { rank: 7, username: 'BaseBuilder', credits: 12000, isCurrentUser: false },
    { rank: 8, username: 'JackpotJoe', credits: 9500, isCurrentUser: false },
    { rank: 9, username: 'SpinDoctor', credits: 7800, isCurrentUser: false },
    { rank: 10, username: 'ReelDeal', credits: 6200, isCurrentUser: false },
  ];

  return (
    <div className="w-full max-w-sm rounded-lg border-2 border-purple-500/50 bg-black/70 p-4 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
      <h3 className="mb-3 text-center text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
        🏆 Leaderboard
      </h3>
      
      <div className="space-y-2">
        {mockLeaderboard.map((entry: LeaderboardEntry) => (
          <div
            key={entry.rank}
            className={`flex items-center justify-between rounded px-3 py-2 text-sm transition-colors ${
              entry.isCurrentUser
                ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/50'
                : 'bg-purple-900/20'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className={`font-bold ${
                entry.rank === 1 ? 'text-yellow-400' :
                entry.rank === 2 ? 'text-gray-300' :
                entry.rank === 3 ? 'text-orange-400' :
                entry.isCurrentUser ? 'text-cyan-400' :
                'text-purple-300'
              }`}>
                #{entry.rank.toString()}
              </span>
              <span className={entry.isCurrentUser ? 'text-cyan-300 font-bold' : 'text-purple-200'}>
                {entry.username}
              </span>
            </div>
            <span className="font-mono font-bold text-yellow-400">
              {entry.credits.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
