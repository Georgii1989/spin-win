import type { SlotSymbol, WinLine, SpinResult } from '@/store/gameStore';  // Импорт типы, если они в gameStore.ts

const SYMBOL_MULTIPLIERS: Record<SlotSymbol, number> = {
  '💎': 100,
  '7️⃣': 50,
  '⭐': 25,
  '🍉': 10,
  '🍊': 8,
  '🍋': 6,
  '🍒': 5,
};

const SYMBOL_WEIGHTS: Record<SlotSymbol, number> = {
  '🍒': 25,
  '🍋': 20,
  '🍊': 18,
  '🍉': 15,
  '⭐': 10,
  '7️⃣': 8,
  '💎': 4,
};

// Win lines for 3x3 grid (0-8 positions)
// Grid layout:
// 0 1 2
// 3 4 5
// 6 7 8
// Only horizontal rows and diagonals count as wins (5 lines total)
const WIN_LINES: number[][] = [
  [0, 1, 2], // Top row
  [3, 4, 5], // Middle row
  [6, 7, 8], // Bottom row
  [0, 4, 8], // Diagonal top-left to bottom-right
  [2, 4, 6], // Diagonal top-right to bottom-left
];

function getWeightedRandomSymbol(): SlotSymbol {
  const totalWeight = Object.values(SYMBOL_WEIGHTS).reduce((sum: number, w: number) => sum + w, 0);
  let random = Math.random() * totalWeight;
  
  for (const [symbol, weight] of Object.entries(SYMBOL_WEIGHTS)) {
    random -= weight;
    if (random <= 0) {
      return symbol as SlotSymbol;
    }
  }
  
  return '🍒';
}

function checkWinLines(symbols: SlotSymbol[], bet: number): WinLine[] {
  const winLines: WinLine[] = [];

  WIN_LINES.forEach((line: number[], index: number) => {
    const [pos1, pos2, pos3] = line;
    const symbol1 = symbols[pos1];
    const symbol2 = symbols[pos2];
    const symbol3 = symbols[pos3];

    if (symbol1 === symbol2 && symbol2 === symbol3) {
      const multiplier = SYMBOL_MULTIPLIERS[symbol1];
      const payout = bet * multiplier;

      winLines.push({
        lineIndex: index,
        positions: line,
        symbol: symbol1,
        payout,
      });
    }
  });

  return winLines;
}

function calculateTotalPayout(winLines: WinLine[]): number {
  return winLines.reduce((total: number, line: WinLine) => total + line.payout, 0);
}

function shouldForceWin(): boolean {
  return Math.random() < 0.25; // 25% chance to win
}

function generateWinningGrid(bet: number): SlotSymbol[] {
  // Start with empty grid
  const symbols: SlotSymbol[] = Array(9).fill(null) as SlotSymbol[];
  
  // Decide how many lines to win
  const winChance = Math.random();
  
  if (winChance < 0.01) {
    // Jackpot: all 💎
    symbols.fill('💎');
  } else if (winChance < 0.05) {
    // Multiple win lines with high value symbols
    const symbol = ['💎', '7️⃣', '⭐'][Math.floor(Math.random() * 3)] as SlotSymbol;
    const numLines = Math.random() < 0.3 ? 2 : 1;
    
    if (numLines === 2) {
      // Two crossing lines (top row and diagonal)
      const lineIndices = [0, 3]; // Top row (0) and first diagonal (3)
      lineIndices.forEach((lineIdx: number) => {
        WIN_LINES[lineIdx].forEach((pos: number) => {
          symbols[pos] = symbol;
        });
      });
    } else {
      // One line - ensure all 3 positions are filled
      const lineIdx = Math.floor(Math.random() * WIN_LINES.length);
      WIN_LINES[lineIdx].forEach((pos: number) => {
        symbols[pos] = symbol;
      });
    }
  } else {
    // Single win line with random symbol
    const symbol = getWeightedRandomSymbol();
    const lineIdx = Math.floor(Math.random() * WIN_LINES.length);
    // Fill all 3 positions of the winning line
    WIN_LINES[lineIdx].forEach((pos: number) => {
      symbols[pos] = symbol;
    });
  }
  
  // Fill remaining positions with different symbols to avoid accidental wins
  const usedPositions = new Set<number>();
  WIN_LINES.forEach((line: number[]) => {
    const lineSymbols = line.map((pos: number) => symbols[pos]).filter((s: SlotSymbol) => s !== null);
    if (lineSymbols.length === 3 && lineSymbols[0] === lineSymbols[1] && lineSymbols[1] === lineSymbols[2]) {
      line.forEach((pos: number) => usedPositions.add(pos));
    }
  });
  
  for (let i = 0; i < 9; i++) {
    if (symbols[i] === null) {
      let newSymbol = getWeightedRandomSymbol();
      // Make sure we don't accidentally create a winning line
      let attempts = 0;
      while (attempts < 10) {
        symbols[i] = newSymbol;
        const winLines = checkWinLines(symbols, 1);
        // Check if new symbol creates unwanted win lines
        const unwantedWin = winLines.some((wl: WinLine) => 
          !wl.positions.every((p: number) => usedPositions.has(p))
        );
        if (!unwantedWin) break;
        newSymbol = getWeightedRandomSymbol();
        attempts++;
      }
      symbols[i] = newSymbol;
    }
  }
  
  return symbols;
}

function generateLosingGrid(): SlotSymbol[] {
  const symbols: SlotSymbol[] = [];
  
  for (let i = 0; i < 9; i++) {
    symbols.push(getWeightedRandomSymbol());
  }
  
  // Ensure no winning lines exist
  const winLines = checkWinLines(symbols, 1);
  if (winLines.length > 0) {
    // Break the first win line
    const firstWinLine = winLines[0];
    const posToChange = firstWinLine.positions[2];
    let newSymbol = getWeightedRandomSymbol();
    
    // Make sure new symbol is different
    while (newSymbol === symbols[firstWinLine.positions[0]]) {
      newSymbol = getWeightedRandomSymbol();
    }
    
    symbols[posToChange] = newSymbol;
  }
  
  return symbols;
}

function checkNearMiss(symbols: SlotSymbol[]): boolean {
  // Near miss: 2 symbols match in any win line, but not all 3
  for (const line of WIN_LINES) {
    const [pos1, pos2, pos3] = line;
    const symbol1 = symbols[pos1];
    const symbol2 = symbols[pos2];
    const symbol3 = symbols[pos3];
    
    if ((symbol1 === symbol2 && symbol1 !== symbol3) ||
        (symbol2 === symbol3 && symbol2 !== symbol1) ||
        (symbol1 === symbol3 && symbol1 !== symbol2)) {
      return true;
    }
  }
  
  return false;
}

export function spinSlotMachine(bet: number): SpinResult {
  let symbols: SlotSymbol[];
  
  if (shouldForceWin()) {
    symbols = generateWinningGrid(bet);
  } else {
    symbols = generateLosingGrid();
  }
  
  const winLines = checkWinLines(symbols, bet);
  const payout = calculateTotalPayout(winLines);
  const isNearMiss = winLines.length === 0 && checkNearMiss(symbols);
  
  let winType: 'none' | 'small' | 'normal' | 'big' | 'jackpot' = 'none';
  if (payout > 0) {
    const multiplier = payout / bet;
    if (multiplier >= 100) {
      winType = 'jackpot';
    } else if (multiplier >= 50) {
      winType = 'big';
    } else if (multiplier >= 10) {
      winType = 'normal';
    } else {
      winType = 'small';
    }
  }
  
  return {
    symbols,
    payout,
    winType,
    winLines,
    isNearMiss,
  };
}

export function getPayoutInfo(symbols: SlotSymbol[], bet: number): string {
  const winLines = checkWinLines(symbols, bet);
  const payout = calculateTotalPayout(winLines);
  
  if (payout === 0) return 'No win';
  
  const multiplier = payout / bet;
  return `Win: ${payout} (${multiplier}x) - ${winLines.length} line${winLines.length > 1 ? 's' : ''}`;
}