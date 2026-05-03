'use client';

import { useEffect, useState, type ReactElement } from 'react';
import { useGameStore } from '@/store/gameStore';
import { Button } from '@/components/ui/button';
import { audioManager } from '@/lib/audioManager';
import { Gift } from 'lucide-react';

export function DailyBonusModal(): ReactElement | null {
  const [isOpen, setIsOpen] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const claimDailyBonus = useGameStore((state: ReturnType<typeof useGameStore.getState>) => state.claimDailyBonus);

  useEffect(() => {
    setMounted(true);
    const checkBonus = (): void => {
      const lastBonus = useGameStore.getState().lastDailyBonus;
      const now = Date.now();
      const dayInMs = 24 * 60 * 60 * 1000;
      
      if (now - lastBonus >= dayInMs) {
        setIsOpen(true);
      }
    };

    checkBonus();
  }, []);

  const handleClaim = (): void => {
    audioManager.play('win');
    const success = claimDailyBonus();
    if (success) {
      setClaimed(true);
      setTimeout(() => {
        setIsOpen(false);
      }, 1500);
    }
  };

  if (!mounted || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-[90vw] max-w-md rounded-2xl border border-cyan-300/60 bg-gradient-to-b from-purple-900/95 via-[#130b2c] to-black p-8 shadow-[0_0_45px_rgba(34,211,238,0.45)]">
        <div className="mb-6 text-center">
          <h2 className="mb-2 text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-purple-400">
            Daily Supply Drop
          </h2>
          <p className="text-lg text-cyan-200">
            Your daily credits are ready!
          </p>
        </div>

        {!claimed ? (
          <Button
            onClick={handleClaim}
            className="w-full h-16 text-2xl font-bold bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 shadow-[0_0_20px_rgba(0,240,255,0.6)] transition-all duration-200 active:scale-95"
          >
            <span className="inline-flex items-center gap-2">
              <Gift className="h-5 w-5" />
              Open Crate (+500 Credits)
            </span>
          </Button>
        ) : (
          <div className="text-center">
            <div className="text-5xl font-bold text-yellow-400 animate-pulse">
              {'+500'}
            </div>
            <p className="mt-2 text-cyan-300">Credits added!</p>
          </div>
        )}
      </div>
    </div>
  );
}
