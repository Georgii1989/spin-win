import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SlotSymbol = '🍒' | '🍋' | '🍊' | '🍉' | '💎' | '7️⃣' | '⭐';

export type SpinState = 'idle' | 'spinning' | 'stopping' | 'stopped' | 'win_locked';

export interface WinLine {
  lineIndex: number;
  positions: number[];
  symbol: SlotSymbol;
  payout: number;
}

export interface GameState {
  credits: number;
  currentBet: number;
  betOptions: number[];
  currentBetIndex: number;
  spinState: SpinState;
  lastWin: number;
  reelResults: SlotSymbol[]; // Now 9 symbols for 3x3 grid
  winLines: WinLine[];
  lastDailyBonus: number;
  lastGMBonus: number;
  gmStreak: number;
  sessionSpinCount: number;
  totalSpins: number;
  
  // Actions
  setCredits: (credits: number) => void;
  addCredits: (amount: number) => void;
  deductCredits: (amount: number) => void;
  setBet: (betIndex: number) => void;
  setSpinState: (state: SpinState) => void;
  setReelResults: (results: SlotSymbol[]) => void;
  setWinLines: (lines: WinLine[]) => void;
  setLastWin: (amount: number) => void;
  claimDailyBonus: () => boolean;
  claimGMBonus: () => boolean;
  incrementSpinCount: () => void;
  resetGame: () => void;
}

const INITIAL_CREDITS = 1000;
const DAILY_BONUS = 500;
const GM_BONUS = 200;
const BET_OPTIONS = [10, 50, 100, 500];

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      credits: INITIAL_CREDITS,
      currentBet: BET_OPTIONS[0],
      betOptions: BET_OPTIONS,
      currentBetIndex: 0,
      spinState: 'idle',
      lastWin: 0,
      reelResults: ['🍒', '🍒', '🍒', '🍒', '🍒', '🍒', '🍒', '🍒', '🍒'], // 3x3 grid
      winLines: [],
      lastDailyBonus: 0,
      lastGMBonus: 0,
      gmStreak: 0,
      sessionSpinCount: 0,
      totalSpins: 0,

      setCredits: (credits: number) => set({ credits }),
      
      addCredits: (amount: number) => set((state: GameState) => ({ 
        credits: state.credits + amount 
      })),
      
      deductCredits: (amount: number) => set((state: GameState) => ({ 
        credits: Math.max(0, state.credits - amount) 
      })),
      
      setBet: (betIndex: number) => set((state: GameState) => ({ 
        currentBetIndex: betIndex,
        currentBet: state.betOptions[betIndex]
      })),
      
      setSpinState: (spinState: SpinState) => set({ spinState }),
      
      setReelResults: (reelResults: SlotSymbol[]) => set({ reelResults }),
      
      setWinLines: (winLines: WinLine[]) => set({ winLines }),
      
      setLastWin: (lastWin: number) => set({ lastWin }),
      
      claimDailyBonus: () => {
        const now = Date.now();
        const lastClaim = get().lastDailyBonus;
        const dayInMs = 24 * 60 * 60 * 1000;
        
        if (now - lastClaim >= dayInMs) {
          set((state: GameState) => ({
            credits: state.credits + DAILY_BONUS,
            lastDailyBonus: now,
          }));
          return true;
        }
        return false;
      },
      
      claimGMBonus: () => {
        const now = Date.now();
        const lastClaim = get().lastGMBonus;
        const dayInMs = 24 * 60 * 60 * 1000;
        const twoDaysInMs = 48 * 60 * 60 * 1000;
        
        if (now - lastClaim >= dayInMs) {
          const isConsecutive = (now - lastClaim) <= twoDaysInMs;
          
          set((state: GameState) => ({
            credits: state.credits + GM_BONUS,
            lastGMBonus: now,
            gmStreak: isConsecutive ? state.gmStreak + 1 : 1,
          }));
          return true;
        }
        return false;
      },
      
      incrementSpinCount: () => set((state: GameState) => ({
        sessionSpinCount: state.sessionSpinCount + 1,
        totalSpins: state.totalSpins + 1,
      })),
      
      resetGame: () => set({
        credits: INITIAL_CREDITS,
        currentBet: BET_OPTIONS[0],
        currentBetIndex: 0,
        spinState: 'idle',
        lastWin: 0,
        reelResults: ['🍒', '🍒', '🍒', '🍒', '🍒', '🍒', '🍒', '🍒', '🍒'],
        winLines: [],
        sessionSpinCount: 0,
      }),
    }),
    {
      name: 'neon-pulse-slots-storage',
    }
  )
);
