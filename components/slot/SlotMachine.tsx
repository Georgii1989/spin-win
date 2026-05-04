'use client';

import { useState, useEffect, type ReactElement } from 'react';
import { Trophy, ChevronLeft } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { spinSlotMachine } from '@/lib/slotMachine';
import { audioManager } from '@/lib/audioManager';
import { PixiStage } from './PixiStage';
import { HUDOverlay } from './HUDOverlay';
import { DailyBonusModal } from './DailyBonusModal';
import { Leaderboard } from './Leaderboard';
import { SplashScreen } from './SplashScreen';

export function SlotMachine(): ReactElement {
  const credits = useGameStore((state: ReturnType<typeof useGameStore.getState>) => state.credits);
  const currentBet = useGameStore((state: ReturnType<typeof useGameStore.getState>) => state.currentBet);
  const spinState = useGameStore((state: ReturnType<typeof useGameStore.getState>) => state.spinState);
  const reelResults = useGameStore((state: ReturnType<typeof useGameStore.getState>) => state.reelResults);
  const winLines = useGameStore((state: ReturnType<typeof useGameStore.getState>) => state.winLines);
  const deductCredits = useGameStore((state: ReturnType<typeof useGameStore.getState>) => state.deductCredits);
  const addCredits = useGameStore((state: ReturnType<typeof useGameStore.getState>) => state.addCredits);
  const setSpinState = useGameStore((state: ReturnType<typeof useGameStore.getState>) => state.setSpinState);
  const setReelResults = useGameStore((state: ReturnType<typeof useGameStore.getState>) => state.setReelResults);
  const setWinLines = useGameStore((state: ReturnType<typeof useGameStore.getState>) => state.setWinLines);
  const setLastWin = useGameStore((state: ReturnType<typeof useGameStore.getState>) => state.setLastWin);
  const incrementSpinCount = useGameStore((state: ReturnType<typeof useGameStore.getState>) => state.incrementSpinCount);

  const [isNearMiss, setIsNearMiss] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    setMounted(true);
    audioManager.init();
  }, []);

  const handleSpin = (): void => {
    if (spinState !== 'idle' || credits < currentBet) return;

    deductCredits(currentBet);
    setSpinState('spinning');
    setLastWin(0);
    setWinLines([]);
    incrementSpinCount();

    const result = spinSlotMachine(currentBet);
    
    setReelResults(result.symbols);
    setIsNearMiss(result.isNearMiss);

    setTimeout(() => {
      if (result.payout > 0) {
        addCredits(result.payout);
        setLastWin(result.payout);
        setWinLines(result.winLines);
        
        if (result.winType === 'jackpot') {
          audioManager.play('jackpot');
        } else {
          audioManager.play('win');
        }

        setTimeout(() => {
          setLastWin(0);
          setWinLines([]);
        }, 4000);
      }
      
      // Always reset spin state after animation completes
      setTimeout(() => {
        setSpinState('idle');
      }, 500);
    }, result.isNearMiss ? 3500 : 2000);
  };

  const handleSpinComplete = (): void => {
    setSpinState('idle');
  };

  if (showSplash) {
    return <SplashScreen onStart={() => setShowSplash(false)} />;
  }

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-[#05040d]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(124,58,237,0.25),transparent_35%),radial-gradient(circle_at_75%_25%,rgba(6,182,212,0.2),transparent_30%),radial-gradient(circle_at_50%_80%,rgba(236,72,153,0.2),transparent_40%)]" />
      <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
      
      <div className="absolute top-4 left-4 z-10">
        <button
          onClick={() => setShowLeaderboard(!showLeaderboard)}
          className="inline-flex items-center gap-2 rounded-xl border border-cyan-300/40 bg-black/50 px-4 py-2 font-semibold text-cyan-100 shadow-[0_0_20px_rgba(34,211,238,0.2)] backdrop-blur-md transition-all hover:scale-[1.02] hover:bg-cyan-500/20"
        >
          {showLeaderboard ? <ChevronLeft className="h-4 w-4" /> : <Trophy className="h-4 w-4" />}
          {showLeaderboard ? 'Back' : 'Leaderboard'}
        </button>
      </div>

      {showLeaderboard ? (
        <div className="flex items-center justify-center h-full pt-16">
          <Leaderboard />
        </div>
      ) : (
        <>
          <div className="flex h-full items-start justify-center pt-24 pb-80">
            <PixiStage
              symbols={reelResults}
              onSpinComplete={handleSpinComplete}
              isSpinning={spinState === 'spinning'}
              isNearMiss={isNearMiss}
              winLines={winLines}
            />
          </div>

          <HUDOverlay
            onSpin={handleSpin}
            canSpin={spinState === 'idle'}
          />
        </>
      )}

      <DailyBonusModal />
    </div>
  );
}
