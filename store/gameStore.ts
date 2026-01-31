import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SlotSymbol = 'Cherry' | 'Lemon' | 'Orange' | 'Watermelon' | 'Diamond' | 'Seven' | 'Star';

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
      reelResults: [],
      winLines: [],
      lastDailyBonus: 0,
      lastGMBonus: 0,
      gmStreak: 0,
      sessionSpinCount: 0,
      totalSpins: 0,
      
      setCredits: (credits) => set({ credits }),
      addCredits: (amount) => set({ credits: get().credits + amount }),
      deductCredits: (amount) => set({ credits: get().credits - amount }),
      setBet: (index) => set({ currentBetIndex: index, currentBet: BET_OPTIONS[index] }),
      setSpinState: (state) => set({ spinState: state }),
      setReelResults: (results) => set({ reelResults: results }),
      setWinLines: (lines) => set({ winLines: lines }),
      setLastWin: (amount) => set({ lastWin: amount }),
      claimDailyBonus: () => {
        const now = Date.now();
        if (now - get().lastDailyBonus >= 86400000) {
          set({ lastDailyBonus: now, credits: get().credits + DAILY_BONUS });
          return true;
        }
        return false;
      },
      claimGMBonus: () => {
        // Логика GM бонуса, если нужна
        return false;
      },
      incrementSpinCount: () => set({ sessionSpinCount: get().sessionSpinCount + 1, totalSpins: get().totalSpins + 1 }),
      resetGame: () => set({ credits: INITIAL_CREDITS, spinState: 'idle' }),
    }),
    { name: 'game-storage' }
  )
);