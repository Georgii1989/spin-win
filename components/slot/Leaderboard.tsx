'use client';

import { useEffect, useMemo, useState, type ReactElement } from 'react';
import { useGameStore } from '@/store/gameStore';

interface LeaderboardEntry {
  id: string;
  username: string;
  credits: number;
  isCurrentUser: boolean;
}

const CURRENT_USER = '1x321';
const VISIBLE_TOP = 10;

const NAME_POOL = [
  'CryptoKing', 'LuckyWhale', 'SlotMaster', 'DiamondHands', 'NeonRider',
  'BaseBuilder', 'JackpotJoe', 'ReelDeal', 'TurboSpin', 'PixelFortune',
  'ChainWizard', 'MoonSpinner', 'CoinPilot', 'BlockGamer', 'MetaRoller',
];

function randomName(index: number): string {
  return `${NAME_POOL[index % NAME_POOL.length]}_${(100 + index).toString()}`;
}

function createInitialPool(): LeaderboardEntry[] {
  const pool: LeaderboardEntry[] = [];
  for (let i = 0; i < 180; i++) {
    pool.push({
      id: `bot-${i}`,
      username: randomName(i),
      credits: Math.floor(2500 + Math.random() * 60000),
      isCurrentUser: false,
    });
  }
  return pool;
}

export function Leaderboard(): ReactElement {
  const credits = useGameStore((state: ReturnType<typeof useGameStore.getState>) => state.credits);
  const [entries, setEntries] = useState<LeaderboardEntry[]>(() => {
    return [
      ...createInitialPool(),
      { id: 'user-1x321', username: CURRENT_USER, credits, isCurrentUser: true },
    ];
  });

  useEffect(() => {
    setEntries((prev: LeaderboardEntry[]) =>
      prev.map((entry: LeaderboardEntry) =>
        entry.isCurrentUser ? { ...entry, credits } : entry
      )
    );
  }, [credits]);

  // "Live" updates: bots gain/lose credits and new rows appear over time.
  useEffect(() => {
    const interval = setInterval(() => {
      setEntries((prev: LeaderboardEntry[]) => {
        const updated = prev.map((entry: LeaderboardEntry) => {
          if (entry.isCurrentUser) return entry;
          const delta = Math.floor(Math.random() * 1400) - 300;
          return { ...entry, credits: Math.max(800, entry.credits + delta) };
        });

        if (Math.random() < 0.35) {
          const idx = updated.length;
          updated.push({
            id: `bot-${idx}`,
            username: randomName(idx),
            credits: Math.floor(3000 + Math.random() * 32000),
            isCurrentUser: false,
          });
        }
        return updated;
      });
    }, 2200);

    return () => clearInterval(interval);
  }, []);

  const ranked = useMemo(() => {
    return [...entries]
      .sort((a: LeaderboardEntry, b: LeaderboardEntry) => b.credits - a.credits)
      .map((entry: LeaderboardEntry, idx: number) => ({ ...entry, rank: idx + 1 }));
  }, [entries]);

  const topTen = ranked.slice(0, VISIBLE_TOP);
  const currentUserRow = ranked.find((entry) => entry.isCurrentUser);
  const feedRows = ranked.slice(VISIBLE_TOP);

  return (
    <div className="w-full max-w-xl rounded-2xl border border-cyan-400/30 bg-black/70 p-4 shadow-[0_0_30px_rgba(0,240,255,0.2)] backdrop-blur-md">
      <h3 className="mb-2 text-center text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-purple-400">
        Live Leaderboard
      </h3>
      <p className="mb-3 text-center text-xs text-cyan-200/80">
        Infinite ranking stream, top 10 pinned
      </p>

      <div className="mb-3 rounded-xl border border-yellow-400/30 bg-yellow-500/5 p-3">
        <a
          href="https://base.app/profile/1x321"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between text-sm text-yellow-300 hover:text-yellow-200 transition-colors"
        >
          <span>Your Base profile: @{CURRENT_USER}</span>
          <span>Open profile</span>
        </a>
        {currentUserRow && (
          <div className="mt-2 text-xs text-cyan-200">
            Current rank: #{currentUserRow.rank.toString()} | Credits: {currentUserRow.credits.toLocaleString()}
          </div>
        )}
      </div>

      <div className="rounded-xl border border-cyan-400/30 bg-cyan-500/5 p-3">
        <div className="mb-2 text-sm font-semibold text-cyan-200">Top 10</div>
        <div className="space-y-2">
          {topTen.map((entry) => (
            <div
              key={entry.id}
              className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${
                entry.isCurrentUser
                  ? 'bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/20 border border-cyan-300/50'
                  : 'bg-black/40 border border-white/5'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`font-bold ${
                  entry.rank === 1 ? 'text-yellow-300' :
                  entry.rank === 2 ? 'text-gray-300' :
                  entry.rank === 3 ? 'text-orange-300' :
                  'text-purple-200'
                }`}>
                  #{entry.rank.toString()}
                </span>
                <span className={entry.isCurrentUser ? 'text-cyan-200 font-semibold' : 'text-purple-100'}>
                  {entry.username}
                </span>
              </div>
              <span className="font-mono text-yellow-300">{entry.credits.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-purple-400/30 bg-purple-500/5 p-3">
        <div className="mb-2 text-sm font-semibold text-purple-200">Live Feed (infinite)</div>
        <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
          {feedRows.map((entry) => (
            <div
              key={entry.id}
              className={`flex items-center justify-between rounded px-3 py-2 text-xs ${
                entry.isCurrentUser ? 'bg-cyan-500/15 border border-cyan-300/40' : 'bg-black/30'
              }`}
            >
              <span className="text-purple-100">
                #{entry.rank.toString()} {entry.username}
              </span>
              <span className="font-mono text-cyan-200">{entry.credits.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
