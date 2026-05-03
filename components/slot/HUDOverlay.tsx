'use client';

import { useEffect, useState, type ReactElement } from 'react';
import { useGameStore } from '@/store/gameStore';
import { Button } from '@/components/ui/button';
import { audioManager } from '@/lib/audioManager';
import gsap from 'gsap';
import { Coins, Crown, Flame, Play, Sparkles } from 'lucide-react';

interface HUDOverlayProps {
  onSpin: () => void;
  canSpin: boolean;
}

export function HUDOverlay({ onSpin, canSpin }: HUDOverlayProps): ReactElement | null {
  const credits = useGameStore((state: ReturnType<typeof useGameStore.getState>) => state.credits);
  const currentBet = useGameStore((state: ReturnType<typeof useGameStore.getState>) => state.currentBet);
  const currentBetIndex = useGameStore((state: ReturnType<typeof useGameStore.getState>) => state.currentBetIndex);
  const betOptions = useGameStore((state: ReturnType<typeof useGameStore.getState>) => state.betOptions);
  const lastWin = useGameStore((state: ReturnType<typeof useGameStore.getState>) => state.lastWin);
  const winLines = useGameStore((state: ReturnType<typeof useGameStore.getState>) => state.winLines);
  const gmStreak = useGameStore((state: ReturnType<typeof useGameStore.getState>) => state.gmStreak);
  const lastGMBonus = useGameStore((state: ReturnType<typeof useGameStore.getState>) => state.lastGMBonus);
  const setBet = useGameStore((state: ReturnType<typeof useGameStore.getState>) => state.setBet);
  const claimGMBonus = useGameStore((state: ReturnType<typeof useGameStore.getState>) => state.claimGMBonus);

  const [displayCredits, setDisplayCredits] = useState(0);
  const [canClaimGM, setCanClaimGM] = useState(false);
  const [gmCooldown, setGMCooldown] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) {
      setDisplayCredits(credits);
      return;
    }
    gsap.to({ value: displayCredits }, {
      value: credits,
      duration: 0.5,
      ease: 'power2.out',
      onUpdate: function() {
        setDisplayCredits(Math.floor((this.targets()[0] as { value: number }).value));
      },
    });
  }, [credits, mounted, displayCredits]);

  useEffect(() => {
    const checkGMStatus = (): void => {
      const now = Date.now();
      const dayInMs = 24 * 60 * 60 * 1000;
      const timeSinceLastGM = now - lastGMBonus;
      
      if (timeSinceLastGM >= dayInMs) {
        setCanClaimGM(true);
        setGMCooldown('');
      } else {
        setCanClaimGM(false);
        const remainingMs = dayInMs - timeSinceLastGM;
        const hours = Math.floor(remainingMs / (60 * 60 * 1000));
        const minutes = Math.floor((remainingMs % (60 * 60 * 1000)) / (60 * 1000));
        setGMCooldown(`${hours}h ${minutes}m`);
      }
    };

    checkGMStatus();
    const interval = setInterval(checkGMStatus, 60000);
    return () => clearInterval(interval);
  }, [lastGMBonus]);

  const handleSpin = (): void => {
    if (canSpin && credits >= currentBet) {
      audioManager.play('click');
      onSpin();
    }
  };

  const handleBetChange = (index: number): void => {
    audioManager.play('click');
    setBet(index);
  };

  const handleGMClick = (): void => {
    if (canClaimGM) {
      audioManager.play('win');
      claimGMBonus();
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-between p-4 pt-12 pointer-events-none">
      <div className="w-full max-w-md flex justify-between items-start pointer-events-auto">
        <div className="rounded-xl border border-cyan-300/35 bg-black/70 px-4 py-2 shadow-[0_0_25px_rgba(34,211,238,0.2)] backdrop-blur-md">
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-cyan-200/80">
            <Coins className="h-3.5 w-3.5" />
            Credits
          </div>
          <div className="text-2xl font-black font-mono text-yellow-300 drop-shadow-[0_0_8px_rgba(253,224,71,0.4)]">
            {displayCredits.toLocaleString()}
          </div>
        </div>

        <Button
          onClick={handleGMClick}
          disabled={!canClaimGM}
          className={`rounded-full w-16 h-16 text-2xl font-bold transition-all duration-300 ${
            canClaimGM
              ? 'bg-gradient-to-br from-yellow-300 to-orange-500 hover:from-yellow-200 hover:to-orange-400 shadow-[0_0_25px_rgba(251,191,36,0.65)] animate-pulse'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          } ${gmStreak >= 3 ? 'ring-4 ring-red-500 ring-offset-2 ring-offset-black' : ''}`}
        >
          {canClaimGM ? <Flame className="mx-auto h-7 w-7" /> : '🔒'}
        </Button>
      </div>

      {!canClaimGM && gmCooldown && (
        <div className="absolute top-24 right-4 text-xs text-cyan-300 bg-black/60 px-2 py-1 rounded pointer-events-none">
          Next GM: {gmCooldown}
        </div>
      )}

      {lastWin > 0 && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 pointer-events-none">
          <div className="text-6xl font-bold text-yellow-400 animate-pulse drop-shadow-[0_0_20px_rgba(251,191,36,1)]">
            +{lastWin.toLocaleString()}
          </div>
          {winLines.length > 1 && (
            <div className="text-3xl font-bold text-cyan-400 animate-pulse drop-shadow-[0_0_15px_rgba(0,240,255,1)]">
              {winLines.length.toString()} LINES!
            </div>
          )}
        </div>
      )}

      <div className="w-full max-w-md space-y-4 pointer-events-auto rounded-2xl border border-white/10 bg-black/40 p-3 backdrop-blur-md shadow-[0_20px_60px_rgba(2,6,23,0.7)]">
        <div className="flex justify-center gap-2">
          {betOptions.map((bet: number, index: number) => (
            <Button
              key={bet}
              onClick={() => handleBetChange(index)}
              className={`px-6 py-2 font-bold transition-all duration-200 ${
                currentBetIndex === index
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-600 shadow-[0_0_20px_rgba(34,211,238,0.6)] scale-110'
                  : 'bg-purple-900/50 hover:bg-purple-800/70 border border-white/10'
              }`}
            >
              {bet.toString()}
            </Button>
          ))}
        </div>

        <Button
          onClick={handleSpin}
          disabled={!canSpin || credits < currentBet}
          className={`w-full h-20 text-3xl font-bold transition-all duration-200 ${
            canSpin && credits >= currentBet
              ? 'bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 hover:from-pink-400 hover:via-purple-500 hover:to-cyan-400 shadow-[0_0_30px_rgba(236,72,153,0.65)] animate-pulse active:scale-95'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed opacity-50'
          }`}
        >
          <span className="inline-flex items-center gap-2">
            <Play className="h-6 w-6" />
            {credits < currentBet ? 'INSUFFICIENT CREDITS' : 'SPIN'}
          </span>
        </Button>

        {credits < currentBet && (
          <div className="text-center text-sm text-red-400 animate-pulse">
            Need {(currentBet - credits).toString()} more credits
          </div>
        )}

        <a
          href="https://base.app/profile/1x321"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full mt-4"
        >
          <div className="w-full rounded-lg border border-yellow-300/45 bg-gradient-to-r from-purple-900/80 to-pink-900/80 px-4 py-3 shadow-[0_0_15px_rgba(251,191,36,0.3)] hover:shadow-[0_0_25px_rgba(251,191,36,0.5)] transition-all duration-300 hover:scale-105">
            <div className="text-center">
              <div className="mb-1 inline-flex items-center gap-1.5 text-sm font-semibold text-yellow-200">
                <Crown className="h-4 w-4" />
                Follow & I'll Follow Back
              </div>
              <div className="inline-flex items-center gap-1 text-xs text-cyan-200">
                <Sparkles className="h-3.5 w-3.5" />
                Let's support each other!
              </div>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}
