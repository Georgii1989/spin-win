'use client';

import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { spinSlotMachine } from '@/lib/slotMachine';
import { audioManager } from '@/lib/audioManager';
import { PixiStage } from './PixiStage';
import { HUDOverlay } from './HUDOverlay';
import { DailyBonusModal } from './DailyBonusModal';
import { Leaderboard } from './Leaderboard';

export function SlotMachine(): JSX.Element {
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

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-black via-purple-950 to-black overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
      
      <div className="absolute top-4 left-4 z-10">
        <button
          onClick={() => setShowLeaderboard(!showLeaderboard)}
          className="px-4 py-2 rounded-lg bg-purple-600/50 hover:bg-purple-500/70 text-white font-bold border-2 border-purple-400 transition-all"
        >
          {showLeaderboard ? '← Back' : '🏆 Leaderboard'}
        </button>
      </div>

      {showLeaderboard ? (
        <div className="flex items-center justify-center h-full pt-16">
          <Leaderboard />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-center h-full">
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
