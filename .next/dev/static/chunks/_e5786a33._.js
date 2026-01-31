(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/store/gameStore.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useGameStore",
    ()=>useGameStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
;
;
const INITIAL_CREDITS = 1000;
const DAILY_BONUS = 500;
const GM_BONUS = 200;
const BET_OPTIONS = [
    10,
    50,
    100,
    500
];
const useGameStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
        credits: INITIAL_CREDITS,
        currentBet: BET_OPTIONS[0],
        betOptions: BET_OPTIONS,
        currentBetIndex: 0,
        spinState: 'idle',
        lastWin: 0,
        reelResults: [
            '🍒',
            '🍒',
            '🍒',
            '🍒',
            '🍒',
            '🍒',
            '🍒',
            '🍒',
            '🍒'
        ],
        winLines: [],
        lastDailyBonus: 0,
        lastGMBonus: 0,
        gmStreak: 0,
        sessionSpinCount: 0,
        totalSpins: 0,
        setCredits: (credits)=>set({
                credits
            }),
        addCredits: (amount)=>set((state)=>({
                    credits: state.credits + amount
                })),
        deductCredits: (amount)=>set((state)=>({
                    credits: Math.max(0, state.credits - amount)
                })),
        setBet: (betIndex)=>set((state)=>({
                    currentBetIndex: betIndex,
                    currentBet: state.betOptions[betIndex]
                })),
        setSpinState: (spinState)=>set({
                spinState
            }),
        setReelResults: (reelResults)=>set({
                reelResults
            }),
        setWinLines: (winLines)=>set({
                winLines
            }),
        setLastWin: (lastWin)=>set({
                lastWin
            }),
        claimDailyBonus: ()=>{
            const now = Date.now();
            const lastClaim = get().lastDailyBonus;
            const dayInMs = 24 * 60 * 60 * 1000;
            if (now - lastClaim >= dayInMs) {
                set((state)=>({
                        credits: state.credits + DAILY_BONUS,
                        lastDailyBonus: now
                    }));
                return true;
            }
            return false;
        },
        claimGMBonus: ()=>{
            const now = Date.now();
            const lastClaim = get().lastGMBonus;
            const dayInMs = 24 * 60 * 60 * 1000;
            const twoDaysInMs = 48 * 60 * 60 * 1000;
            if (now - lastClaim >= dayInMs) {
                const isConsecutive = now - lastClaim <= twoDaysInMs;
                set((state)=>({
                        credits: state.credits + GM_BONUS,
                        lastGMBonus: now,
                        gmStreak: isConsecutive ? state.gmStreak + 1 : 1
                    }));
                return true;
            }
            return false;
        },
        incrementSpinCount: ()=>set((state)=>({
                    sessionSpinCount: state.sessionSpinCount + 1,
                    totalSpins: state.totalSpins + 1
                })),
        resetGame: ()=>set({
                credits: INITIAL_CREDITS,
                currentBet: BET_OPTIONS[0],
                currentBetIndex: 0,
                spinState: 'idle',
                lastWin: 0,
                reelResults: [
                    '🍒',
                    '🍒',
                    '🍒',
                    '🍒',
                    '🍒',
                    '🍒',
                    '🍒',
                    '🍒',
                    '🍒'
                ],
                winLines: [],
                sessionSpinCount: 0
            })
    }), {
    name: 'neon-pulse-slots-storage'
}));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/slotMachine.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getPayoutInfo",
    ()=>getPayoutInfo,
    "spinSlotMachine",
    ()=>spinSlotMachine
]);
const SYMBOLS = [
    '🍒',
    '🍋',
    '🍊',
    '🍉',
    '💎',
    '7️⃣',
    '⭐'
];
// Payout multipliers for 3 matching symbols on a line
const SYMBOL_MULTIPLIERS = {
    '💎': 100,
    '7️⃣': 50,
    '⭐': 25,
    '🍉': 10,
    '🍊': 8,
    '🍋': 6,
    '🍒': 5
};
const SYMBOL_WEIGHTS = {
    '🍒': 25,
    '🍋': 20,
    '🍊': 18,
    '🍉': 15,
    '⭐': 10,
    '7️⃣': 8,
    '💎': 4
};
// Win lines for 3x3 grid (0-8 positions)
// Grid layout:
// 0 1 2
// 3 4 5
// 6 7 8
// Only horizontal rows and diagonals count as wins (5 lines total)
const WIN_LINES = [
    [
        0,
        1,
        2
    ],
    [
        3,
        4,
        5
    ],
    [
        6,
        7,
        8
    ],
    [
        0,
        4,
        8
    ],
    [
        2,
        4,
        6
    ]
];
function getWeightedRandomSymbol() {
    const totalWeight = Object.values(SYMBOL_WEIGHTS).reduce((sum, w)=>sum + w, 0);
    let random = Math.random() * totalWeight;
    for (const [symbol, weight] of Object.entries(SYMBOL_WEIGHTS)){
        random -= weight;
        if (random <= 0) {
            return symbol;
        }
    }
    return '🍒';
}
function checkWinLines(symbols, bet) {
    const winLines = [];
    WIN_LINES.forEach((line, index)=>{
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
                payout
            });
        }
    });
    return winLines;
}
function calculateTotalPayout(winLines) {
    return winLines.reduce((total, line)=>total + line.payout, 0);
}
function shouldForceWin() {
    return Math.random() < 0.25; // 25% chance to win
}
function generateWinningGrid(bet) {
    // Start with empty grid
    const symbols = Array(9).fill(null);
    // Decide how many lines to win
    const winChance = Math.random();
    if (winChance < 0.01) {
        // Jackpot: all 💎
        symbols.fill('💎');
    } else if (winChance < 0.05) {
        // Multiple win lines with high value symbols
        const symbol = [
            '💎',
            '7️⃣',
            '⭐'
        ][Math.floor(Math.random() * 3)];
        const numLines = Math.random() < 0.3 ? 2 : 1;
        if (numLines === 2) {
            // Two crossing lines (top row and diagonal)
            const lineIndices = [
                0,
                3
            ]; // Top row (0) and first diagonal (3)
            lineIndices.forEach((lineIdx)=>{
                WIN_LINES[lineIdx].forEach((pos)=>{
                    symbols[pos] = symbol;
                });
            });
        } else {
            // One line - ensure all 3 positions are filled
            const lineIdx = Math.floor(Math.random() * WIN_LINES.length);
            WIN_LINES[lineIdx].forEach((pos)=>{
                symbols[pos] = symbol;
            });
        }
    } else {
        // Single win line with random symbol
        const symbol = getWeightedRandomSymbol();
        const lineIdx = Math.floor(Math.random() * WIN_LINES.length);
        // Fill all 3 positions of the winning line
        WIN_LINES[lineIdx].forEach((pos)=>{
            symbols[pos] = symbol;
        });
    }
    // Fill remaining positions with different symbols to avoid accidental wins
    const usedPositions = new Set();
    WIN_LINES.forEach((line)=>{
        const lineSymbols = line.map((pos)=>symbols[pos]).filter((s)=>s !== null);
        if (lineSymbols.length === 3 && lineSymbols[0] === lineSymbols[1] && lineSymbols[1] === lineSymbols[2]) {
            line.forEach((pos)=>usedPositions.add(pos));
        }
    });
    for(let i = 0; i < 9; i++){
        if (symbols[i] === null) {
            let newSymbol = getWeightedRandomSymbol();
            // Make sure we don't accidentally create a winning line
            let attempts = 0;
            while(attempts < 10){
                symbols[i] = newSymbol;
                const winLines = checkWinLines(symbols, 1);
                // Check if new symbol creates unwanted win lines
                const unwantedWin = winLines.some((wl)=>!wl.positions.every((p)=>usedPositions.has(p)));
                if (!unwantedWin) break;
                newSymbol = getWeightedRandomSymbol();
                attempts++;
            }
            symbols[i] = newSymbol;
        }
    }
    return symbols;
}
function generateLosingGrid() {
    const symbols = [];
    for(let i = 0; i < 9; i++){
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
        while(newSymbol === symbols[firstWinLine.positions[0]]){
            newSymbol = getWeightedRandomSymbol();
        }
        symbols[posToChange] = newSymbol;
    }
    return symbols;
}
function checkNearMiss(symbols) {
    // Near miss: 2 symbols match in any win line, but not all 3
    for (const line of WIN_LINES){
        const [pos1, pos2, pos3] = line;
        const symbol1 = symbols[pos1];
        const symbol2 = symbols[pos2];
        const symbol3 = symbols[pos3];
        if (symbol1 === symbol2 && symbol1 !== symbol3 || symbol2 === symbol3 && symbol2 !== symbol1 || symbol1 === symbol3 && symbol1 !== symbol2) {
            return true;
        }
    }
    return false;
}
function spinSlotMachine(bet) {
    let symbols;
    if (shouldForceWin()) {
        symbols = generateWinningGrid(bet);
    } else {
        symbols = generateLosingGrid();
    }
    const winLines = checkWinLines(symbols, bet);
    const payout = calculateTotalPayout(winLines);
    const isNearMiss = winLines.length === 0 && checkNearMiss(symbols);
    let winType = 'none';
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
        isNearMiss
    };
}
function getPayoutInfo(symbols, bet) {
    const winLines = checkWinLines(symbols, bet);
    const payout = calculateTotalPayout(winLines);
    if (payout === 0) return 'No win';
    const multiplier = payout / bet;
    return `Win: ${payout} (${multiplier}x) - ${winLines.length} line${winLines.length > 1 ? 's' : ''}`;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/audioManager.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "audioManager",
    ()=>audioManager
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$howler$2f$dist$2f$howler$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/howler/dist/howler.js [app-client] (ecmascript)");
;
class AudioManager {
    sounds = new Map();
    initialized = false;
    volume = 0.5;
    init() {
        if (this.initialized) return;
        this.sounds.set('spin', new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$howler$2f$dist$2f$howler$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Howl"]({
            src: [
                this.generateSpinSound()
            ],
            volume: this.volume,
            loop: true
        }));
        this.sounds.set('stop', new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$howler$2f$dist$2f$howler$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Howl"]({
            src: [
                this.generateStopSound()
            ],
            volume: this.volume * 0.8
        }));
        this.sounds.set('win', new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$howler$2f$dist$2f$howler$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Howl"]({
            src: [
                this.generateWinSound()
            ],
            volume: this.volume * 0.9
        }));
        this.sounds.set('jackpot', new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$howler$2f$dist$2f$howler$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Howl"]({
            src: [
                this.generateJackpotSound()
            ],
            volume: this.volume
        }));
        this.sounds.set('click', new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$howler$2f$dist$2f$howler$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Howl"]({
            src: [
                this.generateClickSound()
            ],
            volume: this.volume * 0.6
        }));
        this.sounds.set('tension', new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$howler$2f$dist$2f$howler$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Howl"]({
            src: [
                this.generateTensionSound()
            ],
            volume: this.volume * 0.7,
            loop: true
        }));
        this.initialized = true;
    }
    generateSpinSound() {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const duration = 0.5;
        const sampleRate = ctx.sampleRate;
        const length = sampleRate * duration;
        const buffer = ctx.createBuffer(1, length, sampleRate);
        const data = buffer.getChannelData(0);
        for(let i = 0; i < length; i++){
            const t = i / sampleRate;
            const freq = 200 + t / duration * 100;
            data[i] = Math.sin(2 * Math.PI * freq * t) * 0.1 * (1 - t / duration);
        }
        return this.bufferToDataURL(buffer);
    }
    generateStopSound() {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const duration = 0.15;
        const sampleRate = ctx.sampleRate;
        const length = sampleRate * duration;
        const buffer = ctx.createBuffer(1, length, sampleRate);
        const data = buffer.getChannelData(0);
        for(let i = 0; i < length; i++){
            const t = i / sampleRate;
            data[i] = Math.sin(2 * Math.PI * 150 * t) * 0.3 * Math.exp(-t * 10);
        }
        return this.bufferToDataURL(buffer);
    }
    generateWinSound() {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const duration = 0.8;
        const sampleRate = ctx.sampleRate;
        const length = sampleRate * duration;
        const buffer = ctx.createBuffer(1, length, sampleRate);
        const data = buffer.getChannelData(0);
        const notes = [
            523.25,
            659.25,
            783.99
        ];
        for(let i = 0; i < length; i++){
            const t = i / sampleRate;
            let sample = 0;
            for(let j = 0; j < notes.length; j++){
                const noteStart = j * duration / notes.length;
                if (t >= noteStart) {
                    const noteT = t - noteStart;
                    sample += Math.sin(2 * Math.PI * notes[j] * noteT) * 0.1 * Math.exp(-noteT * 3);
                }
            }
            data[i] = sample;
        }
        return this.bufferToDataURL(buffer);
    }
    generateJackpotSound() {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const duration = 1.5;
        const sampleRate = ctx.sampleRate;
        const length = sampleRate * duration;
        const buffer = ctx.createBuffer(1, length, sampleRate);
        const data = buffer.getChannelData(0);
        for(let i = 0; i < length; i++){
            const t = i / sampleRate;
            const freq = 440 * Math.pow(2, t);
            data[i] = Math.sin(2 * Math.PI * freq * t) * 0.2 * (1 - t / duration);
        }
        return this.bufferToDataURL(buffer);
    }
    generateClickSound() {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const duration = 0.05;
        const sampleRate = ctx.sampleRate;
        const length = sampleRate * duration;
        const buffer = ctx.createBuffer(1, length, sampleRate);
        const data = buffer.getChannelData(0);
        for(let i = 0; i < length; i++){
            data[i] = (Math.random() * 2 - 1) * 0.1 * (1 - i / length);
        }
        return this.bufferToDataURL(buffer);
    }
    generateTensionSound() {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const duration = 2.0;
        const sampleRate = ctx.sampleRate;
        const length = sampleRate * duration;
        const buffer = ctx.createBuffer(1, length, sampleRate);
        const data = buffer.getChannelData(0);
        for(let i = 0; i < length; i++){
            const t = i / sampleRate;
            const freq = 100 + t / duration * 300;
            data[i] = Math.sin(2 * Math.PI * freq * t) * 0.15 * (t / duration);
        }
        return this.bufferToDataURL(buffer);
    }
    bufferToDataURL(buffer) {
        const data = buffer.getChannelData(0);
        const wav = this.createWAV(data, buffer.sampleRate);
        const blob = new Blob([
            wav
        ], {
            type: 'audio/wav'
        });
        return URL.createObjectURL(blob);
    }
    createWAV(samples, sampleRate) {
        const buffer = new ArrayBuffer(44 + samples.length * 2);
        const view = new DataView(buffer);
        const writeString = (offset, str)=>{
            for(let i = 0; i < str.length; i++){
                view.setUint8(offset + i, str.charCodeAt(i));
            }
        };
        writeString(0, 'RIFF');
        view.setUint32(4, 36 + samples.length * 2, true);
        writeString(8, 'WAVE');
        writeString(12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, 1, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * 2, true);
        view.setUint16(32, 2, true);
        view.setUint16(34, 16, true);
        writeString(36, 'data');
        view.setUint32(40, samples.length * 2, true);
        let offset = 44;
        for(let i = 0; i < samples.length; i++){
            const sample = Math.max(-1, Math.min(1, samples[i]));
            view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
            offset += 2;
        }
        return buffer;
    }
    play(soundName) {
        if (!this.initialized) this.init();
        const sound = this.sounds.get(soundName);
        if (sound) {
            sound.play();
        }
    }
    stop(soundName) {
        const sound = this.sounds.get(soundName);
        if (sound) {
            sound.stop();
        }
    }
    setVolume(vol) {
        this.volume = Math.max(0, Math.min(1, vol));
        this.sounds.forEach((sound)=>{
            sound.volume(this.volume);
        });
    }
}
const audioManager = new AudioManager();
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/slot/PixiStage.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PixiStage",
    ()=>PixiStage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pixi$2e$js$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/pixi.js/lib/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pixi$2e$js$2f$lib$2f$app$2f$Application$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/pixi.js/lib/app/Application.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pixi$2e$js$2f$lib$2f$scene$2f$container$2f$Container$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/pixi.js/lib/scene/container/Container.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pixi$2e$js$2f$lib$2f$scene$2f$graphics$2f$shared$2f$Graphics$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/pixi.js/lib/scene/graphics/shared/Graphics.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pixi$2e$js$2f$lib$2f$scene$2f$text$2f$Text$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/pixi.js/lib/scene/text/Text.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/gsap/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$audioManager$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/audioManager.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
const SYMBOL_SIZE = 80;
const SLOT_SIZE = 100;
const GRID_SPACING = 10;
const GRID_SIZE = 3;
function PixiStage({ symbols, onSpinComplete, isSpinning, isNearMiss, winLines }) {
    _s();
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const appRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const slotsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    const winLineGraphicsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const symbolsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(Array(9).fill('🍒'));
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PixiStage.useEffect": ()=>{
            if (!containerRef.current || appRef.current) return;
            const app = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pixi$2e$js$2f$lib$2f$app$2f$Application$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Application"]();
            const gridWidth = GRID_SIZE * SLOT_SIZE + (GRID_SIZE - 1) * GRID_SPACING;
            const gridHeight = GRID_SIZE * SLOT_SIZE + (GRID_SIZE - 1) * GRID_SPACING;
            const canvasWidth = gridWidth + 40;
            const canvasHeight = gridHeight + 40;
            app.init({
                width: canvasWidth,
                height: canvasHeight,
                backgroundColor: 0x050505,
                antialias: true
            }).then({
                "PixiStage.useEffect": ()=>{
                    if (containerRef.current) {
                        containerRef.current.appendChild(app.canvas);
                        appRef.current = app;
                        initGrid(app);
                    }
                }
            }["PixiStage.useEffect"]).catch({
                "PixiStage.useEffect": (error)=>{
                    console.error('Failed to initialize Pixi:', error);
                }
            }["PixiStage.useEffect"]);
            return ({
                "PixiStage.useEffect": ()=>{
                    if (appRef.current) {
                        appRef.current.destroy(true, {
                            children: true,
                            texture: true
                        });
                        appRef.current = null;
                    }
                }
            })["PixiStage.useEffect"];
        }
    }["PixiStage.useEffect"], []);
    const initGrid = (app)=>{
        const slots = [];
        const offsetX = 20;
        const offsetY = 20;
        // Create 3x3 grid
        for(let row = 0; row < GRID_SIZE; row++){
            for(let col = 0; col < GRID_SIZE; col++){
                const index = row * GRID_SIZE + col;
                const slot = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pixi$2e$js$2f$lib$2f$scene$2f$container$2f$Container$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Container"]();
                slot.x = offsetX + col * (SLOT_SIZE + GRID_SPACING);
                slot.y = offsetY + row * (SLOT_SIZE + GRID_SPACING);
                // Background
                const bg = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pixi$2e$js$2f$lib$2f$scene$2f$graphics$2f$shared$2f$Graphics$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Graphics"]();
                bg.rect(0, 0, SLOT_SIZE, SLOT_SIZE);
                bg.fill({
                    color: 0x1a1a2e,
                    alpha: 0.8
                });
                bg.stroke({
                    width: 2,
                    color: 0x00f0ff,
                    alpha: 0.5
                });
                slot.addChild(bg);
                // Symbol text
                const symbolText = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pixi$2e$js$2f$lib$2f$scene$2f$text$2f$Text$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Text"]({
                    text: '🍒',
                    style: {
                        fontSize: SYMBOL_SIZE,
                        align: 'center'
                    }
                });
                symbolText.x = SLOT_SIZE / 2;
                symbolText.y = SLOT_SIZE / 2;
                symbolText.anchor.set(0.5);
                slot.addChild(symbolText);
                app.stage.addChild(slot);
                slots.push(slot);
            }
        }
        // Create win line graphics layer
        const winLineGraphics = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pixi$2e$js$2f$lib$2f$scene$2f$graphics$2f$shared$2f$Graphics$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Graphics"]();
        app.stage.addChild(winLineGraphics);
        winLineGraphicsRef.current = winLineGraphics;
        slotsRef.current = slots;
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PixiStage.useEffect": ()=>{
            if (isSpinning && slotsRef.current.length > 0) {
                spinSlots();
            }
        }
    }["PixiStage.useEffect"], [
        isSpinning
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PixiStage.useEffect": ()=>{
            if (winLines.length > 0 && !isSpinning) {
                drawWinLines();
            } else {
                clearWinLines();
            }
        }
    }["PixiStage.useEffect"], [
        winLines,
        isSpinning
    ]);
    const spinSlots = ()=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$audioManager$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audioManager"].play('spin');
        clearWinLines();
        const slots = slotsRef.current;
        const timeline = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].timeline();
        // Spin all slots with staggered start
        slots.forEach((slot, index)=>{
            const symbolText = slot.children[1];
            const row = Math.floor(index / GRID_SIZE);
            const col = index % GRID_SIZE;
            const delay = row * 0.05 + col * 0.05;
            timeline.to(symbolText, {
                rotation: Math.PI * 6,
                duration: 0.5,
                ease: 'power2.in',
                onUpdate: ()=>{
                    symbolText.text = [
                        '🍒',
                        '🍋',
                        '🍊',
                        '🍉',
                        '💎',
                        '7️⃣',
                        '⭐'
                    ][Math.floor(Math.random() * 7)];
                }
            }, delay);
        });
        timeline.call(()=>{
            stopSlots();
        });
    };
    const stopSlots = ()=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$audioManager$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audioManager"].stop('spin');
        const slots = slotsRef.current;
        const stopTimeline = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].timeline();
        // Stop slots row by row
        slots.forEach((slot, index)=>{
            const symbolText = slot.children[1];
            const row = Math.floor(index / GRID_SIZE);
            const delay = row * 0.3;
            stopTimeline.to(symbolText, {
                rotation: 0,
                duration: 0.3,
                ease: 'back.out',
                onStart: ()=>{
                    symbolText.text = symbols[index];
                    if (row === 0 && index % GRID_SIZE === 0) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$audioManager$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audioManager"].play('stop');
                    }
                }
            }, delay);
        });
        stopTimeline.call(()=>{
            onSpinComplete();
        });
    };
    const drawWinLines = ()=>{
        const graphics = winLineGraphicsRef.current;
        if (!graphics) return;
        graphics.clear();
        const offsetX = 20;
        const offsetY = 20;
        winLines.forEach((winLine)=>{
            const positions = winLine.positions;
            const startPos = positions[0];
            const endPos = positions[positions.length - 1];
            const startRow = Math.floor(startPos / GRID_SIZE);
            const startCol = startPos % GRID_SIZE;
            const endRow = Math.floor(endPos / GRID_SIZE);
            const endCol = endPos % GRID_SIZE;
            const startX = offsetX + startCol * (SLOT_SIZE + GRID_SPACING) + SLOT_SIZE / 2;
            const startY = offsetY + startRow * (SLOT_SIZE + GRID_SPACING) + SLOT_SIZE / 2;
            const endX = offsetX + endCol * (SLOT_SIZE + GRID_SPACING) + SLOT_SIZE / 2;
            const endY = offsetY + endRow * (SLOT_SIZE + GRID_SPACING) + SLOT_SIZE / 2;
            // Draw glowing line
            graphics.moveTo(startX, startY);
            graphics.lineTo(endX, endY);
            graphics.stroke({
                width: 4,
                color: 0xffd700,
                alpha: 0.8
            });
            // Animate the line
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].fromTo(graphics, {
                alpha: 0.5
            }, {
                alpha: 1,
                duration: 0.5,
                repeat: 5,
                yoyo: true
            });
        });
        // Highlight winning slots
        winLines.forEach((winLine)=>{
            winLine.positions.forEach((pos)=>{
                const slot = slotsRef.current[pos];
                const bg = slot.children[0];
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].to(bg, {
                    alpha: 1,
                    duration: 0.3,
                    repeat: 5,
                    yoyo: true
                });
            });
        });
    };
    const clearWinLines = ()=>{
        const graphics = winLineGraphicsRef.current;
        if (graphics) {
            graphics.clear();
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: containerRef,
        className: "flex items-center justify-center",
        style: {
            filter: 'drop-shadow(0 0 20px rgba(0, 240, 255, 0.5))'
        }
    }, void 0, false, {
        fileName: "[project]/components/slot/PixiStage.tsx",
        lineNumber: 251,
        columnNumber: 5
    }, this);
}
_s(PixiStage, "yB7Ufnn4SeBVpiRqm2xjyQbx6Z8=");
_c = PixiStage;
var _c;
__turbopack_context__.k.register(_c, "PixiStage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/slot/HUDOverlay.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HUDOverlay",
    ()=>HUDOverlay
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$gameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/store/gameStore.ts [app-client] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '@/components/ui/button'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$audioManager$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/audioManager.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/gsap/index.js [app-client] (ecmascript) <locals>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
function HUDOverlay({ onSpin, canSpin }) {
    _s();
    const credits = (0, __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$gameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "HUDOverlay.useGameStore[credits]": (state)=>state.credits
    }["HUDOverlay.useGameStore[credits]"]);
    const currentBet = (0, __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$gameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "HUDOverlay.useGameStore[currentBet]": (state)=>state.currentBet
    }["HUDOverlay.useGameStore[currentBet]"]);
    const currentBetIndex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$gameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "HUDOverlay.useGameStore[currentBetIndex]": (state)=>state.currentBetIndex
    }["HUDOverlay.useGameStore[currentBetIndex]"]);
    const betOptions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$gameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "HUDOverlay.useGameStore[betOptions]": (state)=>state.betOptions
    }["HUDOverlay.useGameStore[betOptions]"]);
    const lastWin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$gameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "HUDOverlay.useGameStore[lastWin]": (state)=>state.lastWin
    }["HUDOverlay.useGameStore[lastWin]"]);
    const winLines = (0, __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$gameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "HUDOverlay.useGameStore[winLines]": (state)=>state.winLines
    }["HUDOverlay.useGameStore[winLines]"]);
    const gmStreak = (0, __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$gameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "HUDOverlay.useGameStore[gmStreak]": (state)=>state.gmStreak
    }["HUDOverlay.useGameStore[gmStreak]"]);
    const lastGMBonus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$gameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "HUDOverlay.useGameStore[lastGMBonus]": (state)=>state.lastGMBonus
    }["HUDOverlay.useGameStore[lastGMBonus]"]);
    const setBet = (0, __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$gameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "HUDOverlay.useGameStore[setBet]": (state)=>state.setBet
    }["HUDOverlay.useGameStore[setBet]"]);
    const claimGMBonus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$gameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "HUDOverlay.useGameStore[claimGMBonus]": (state)=>state.claimGMBonus
    }["HUDOverlay.useGameStore[claimGMBonus]"]);
    const [displayCredits, setDisplayCredits] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [canClaimGM, setCanClaimGM] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [gmCooldown, setGMCooldown] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HUDOverlay.useEffect": ()=>{
            setMounted(true);
        }
    }["HUDOverlay.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HUDOverlay.useEffect": ()=>{
            if (!mounted) {
                setDisplayCredits(credits);
                return;
            }
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].to({
                value: displayCredits
            }, {
                value: credits,
                duration: 0.5,
                ease: 'power2.out',
                onUpdate: {
                    "HUDOverlay.useEffect": function() {
                        setDisplayCredits(Math.floor(this.targets()[0].value));
                    }
                }["HUDOverlay.useEffect"]
            });
        }
    }["HUDOverlay.useEffect"], [
        credits,
        mounted,
        displayCredits
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HUDOverlay.useEffect": ()=>{
            const checkGMStatus = {
                "HUDOverlay.useEffect.checkGMStatus": ()=>{
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
                        const minutes = Math.floor(remainingMs % (60 * 60 * 1000) / (60 * 1000));
                        setGMCooldown(`${hours}h ${minutes}m`);
                    }
                }
            }["HUDOverlay.useEffect.checkGMStatus"];
            checkGMStatus();
            const interval = setInterval(checkGMStatus, 60000);
            return ({
                "HUDOverlay.useEffect": ()=>clearInterval(interval)
            })["HUDOverlay.useEffect"];
        }
    }["HUDOverlay.useEffect"], [
        lastGMBonus
    ]);
    const handleSpin = ()=>{
        if (canSpin && credits >= currentBet) {
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$audioManager$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audioManager"].play('click');
            onSpin();
        }
    };
    const handleBetChange = (index)=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$audioManager$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audioManager"].play('click');
        setBet(index);
    };
    const handleGMClick = ()=>{
        if (canClaimGM) {
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$audioManager$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audioManager"].play('win');
            claimGMBonus();
        }
    };
    if (!mounted) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "absolute inset-0 flex flex-col items-center justify-between p-4 pt-12 pointer-events-none",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full max-w-md flex justify-between items-start pointer-events-auto",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-lg border-2 border-cyan-400/50 bg-black/80 px-4 py-2 shadow-[0_0_15px_rgba(0,240,255,0.3)]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xs text-cyan-300",
                                children: "Credits"
                            }, void 0, false, {
                                fileName: "[project]/components/slot/HUDOverlay.tsx",
                                lineNumber: 100,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-2xl font-bold font-mono text-yellow-400",
                                children: displayCredits.toLocaleString()
                            }, void 0, false, {
                                fileName: "[project]/components/slot/HUDOverlay.tsx",
                                lineNumber: 101,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/slot/HUDOverlay.tsx",
                        lineNumber: 99,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Button, {
                        onClick: handleGMClick,
                        disabled: !canClaimGM,
                        className: `rounded-full w-16 h-16 text-2xl font-bold transition-all duration-300 ${canClaimGM ? 'bg-gradient-to-br from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 shadow-[0_0_20px_rgba(251,191,36,0.6)] animate-pulse' : 'bg-gray-700 text-gray-400 cursor-not-allowed'} ${gmStreak >= 3 ? 'ring-4 ring-red-500 ring-offset-2 ring-offset-black' : ''}`,
                        children: canClaimGM ? 'GM' : '🔒'
                    }, void 0, false, {
                        fileName: "[project]/components/slot/HUDOverlay.tsx",
                        lineNumber: 106,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/slot/HUDOverlay.tsx",
                lineNumber: 98,
                columnNumber: 7
            }, this),
            !canClaimGM && gmCooldown && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute top-24 right-4 text-xs text-cyan-300 bg-black/60 px-2 py-1 rounded pointer-events-none",
                children: [
                    "Next GM: ",
                    gmCooldown
                ]
            }, void 0, true, {
                fileName: "[project]/components/slot/HUDOverlay.tsx",
                lineNumber: 120,
                columnNumber: 9
            }, this),
            lastWin > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 pointer-events-none",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-6xl font-bold text-yellow-400 animate-pulse drop-shadow-[0_0_20px_rgba(251,191,36,1)]",
                        children: [
                            "+",
                            lastWin.toLocaleString()
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/slot/HUDOverlay.tsx",
                        lineNumber: 127,
                        columnNumber: 11
                    }, this),
                    winLines.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-3xl font-bold text-cyan-400 animate-pulse drop-shadow-[0_0_15px_rgba(0,240,255,1)]",
                        children: [
                            winLines.length.toString(),
                            " LINES!"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/slot/HUDOverlay.tsx",
                        lineNumber: 131,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/slot/HUDOverlay.tsx",
                lineNumber: 126,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full max-w-md space-y-4 pointer-events-auto",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-center gap-2",
                        children: betOptions.map((bet, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Button, {
                                onClick: ()=>handleBetChange(index),
                                className: `px-6 py-2 font-bold transition-all duration-200 ${currentBetIndex === index ? 'bg-gradient-to-r from-cyan-500 to-purple-600 shadow-[0_0_15px_rgba(0,240,255,0.6)] scale-110' : 'bg-purple-900/50 hover:bg-purple-800/70'}`,
                                children: bet.toString()
                            }, bet, false, {
                                fileName: "[project]/components/slot/HUDOverlay.tsx",
                                lineNumber: 141,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/components/slot/HUDOverlay.tsx",
                        lineNumber: 139,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Button, {
                        onClick: handleSpin,
                        disabled: !canSpin || credits < currentBet,
                        className: `w-full h-20 text-3xl font-bold transition-all duration-200 ${canSpin && credits >= currentBet ? 'bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 hover:from-pink-400 hover:via-purple-500 hover:to-cyan-400 shadow-[0_0_25px_rgba(236,72,153,0.6)] animate-pulse active:scale-95' : 'bg-gray-700 text-gray-400 cursor-not-allowed opacity-50'}`,
                        children: credits < currentBet ? 'INSUFFICIENT CREDITS' : 'SPIN'
                    }, void 0, false, {
                        fileName: "[project]/components/slot/HUDOverlay.tsx",
                        lineNumber: 155,
                        columnNumber: 9
                    }, this),
                    credits < currentBet && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center text-sm text-red-400 animate-pulse",
                        children: [
                            "Need ",
                            (currentBet - credits).toString(),
                            " more credits"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/slot/HUDOverlay.tsx",
                        lineNumber: 168,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        href: "https://base.app/profile/1x321",
                        target: "_blank",
                        rel: "noopener noreferrer",
                        className: "block w-full mt-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-full rounded-lg border-2 border-yellow-400/50 bg-gradient-to-r from-purple-900/80 to-pink-900/80 px-4 py-3 shadow-[0_0_15px_rgba(251,191,36,0.3)] hover:shadow-[0_0_25px_rgba(251,191,36,0.5)] transition-all duration-300 hover:scale-105",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-sm font-semibold text-yellow-300 mb-1",
                                        children: "🤝 Follow & I'll Follow Back"
                                    }, void 0, false, {
                                        fileName: "[project]/components/slot/HUDOverlay.tsx",
                                        lineNumber: 181,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-xs text-cyan-200",
                                        children: "Let's support each other!"
                                    }, void 0, false, {
                                        fileName: "[project]/components/slot/HUDOverlay.tsx",
                                        lineNumber: 184,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/slot/HUDOverlay.tsx",
                                lineNumber: 180,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/slot/HUDOverlay.tsx",
                            lineNumber: 179,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/slot/HUDOverlay.tsx",
                        lineNumber: 173,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/slot/HUDOverlay.tsx",
                lineNumber: 138,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/slot/HUDOverlay.tsx",
        lineNumber: 97,
        columnNumber: 5
    }, this);
}
_s(HUDOverlay, "xG1MqtBJkz8OkhSs46C22xNW2bY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$gameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$gameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$gameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$gameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$gameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$gameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$gameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$gameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$gameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$gameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"]
    ];
});
_c = HUDOverlay;
var _c;
__turbopack_context__.k.register(_c, "HUDOverlay");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/slot/DailyBonusModal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DailyBonusModal",
    ()=>DailyBonusModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$gameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/store/gameStore.ts [app-client] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '@/components/ui/button'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$audioManager$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/audioManager.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function DailyBonusModal() {
    _s();
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [claimed, setClaimed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const claimDailyBonus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$gameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "DailyBonusModal.useGameStore[claimDailyBonus]": (state)=>state.claimDailyBonus
    }["DailyBonusModal.useGameStore[claimDailyBonus]"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DailyBonusModal.useEffect": ()=>{
            setMounted(true);
            const checkBonus = {
                "DailyBonusModal.useEffect.checkBonus": ()=>{
                    const lastBonus = __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$gameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"].getState().lastDailyBonus;
                    const now = Date.now();
                    const dayInMs = 24 * 60 * 60 * 1000;
                    if (now - lastBonus >= dayInMs) {
                        setIsOpen(true);
                    }
                }
            }["DailyBonusModal.useEffect.checkBonus"];
            checkBonus();
        }
    }["DailyBonusModal.useEffect"], []);
    const handleClaim = ()=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$audioManager$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audioManager"].play('win');
        const success = claimDailyBonus();
        if (success) {
            setClaimed(true);
            setTimeout(()=>{
                setIsOpen(false);
            }, 1500);
        }
    };
    if (!mounted || !isOpen) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "relative w-[90vw] max-w-md rounded-lg border-2 border-cyan-400 bg-gradient-to-b from-purple-900 to-black p-8 shadow-[0_0_30px_rgba(0,240,255,0.5)]",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-6 text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "mb-2 text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500",
                            children: "Daily Supply Drop"
                        }, void 0, false, {
                            fileName: "[project]/components/slot/DailyBonusModal.tsx",
                            lineNumber: 46,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-lg text-cyan-300",
                            children: "Your daily credits are ready!"
                        }, void 0, false, {
                            fileName: "[project]/components/slot/DailyBonusModal.tsx",
                            lineNumber: 49,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/slot/DailyBonusModal.tsx",
                    lineNumber: 45,
                    columnNumber: 9
                }, this),
                !claimed ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Button, {
                    onClick: handleClaim,
                    className: "w-full h-16 text-2xl font-bold bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 shadow-[0_0_20px_rgba(0,240,255,0.6)] transition-all duration-200 active:scale-95",
                    children: "Open Crate (+500 Credits)"
                }, void 0, false, {
                    fileName: "[project]/components/slot/DailyBonusModal.tsx",
                    lineNumber: 55,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-5xl font-bold text-yellow-400 animate-pulse",
                            children: '+500'
                        }, void 0, false, {
                            fileName: "[project]/components/slot/DailyBonusModal.tsx",
                            lineNumber: 63,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-2 text-cyan-300",
                            children: "Credits added!"
                        }, void 0, false, {
                            fileName: "[project]/components/slot/DailyBonusModal.tsx",
                            lineNumber: 66,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/slot/DailyBonusModal.tsx",
                    lineNumber: 62,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/slot/DailyBonusModal.tsx",
            lineNumber: 44,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/slot/DailyBonusModal.tsx",
        lineNumber: 43,
        columnNumber: 5
    }, this);
}
_s(DailyBonusModal, "+sLfCoMhiRO5teYcyUHpz6lFQzs=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$gameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"]
    ];
});
_c = DailyBonusModal;
var _c;
__turbopack_context__.k.register(_c, "DailyBonusModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/slot/Leaderboard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Leaderboard",
    ()=>Leaderboard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$gameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/store/gameStore.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
function Leaderboard() {
    _s();
    const credits = (0, __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$gameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "Leaderboard.useGameStore[credits]": (state)=>state.credits
    }["Leaderboard.useGameStore[credits]"]);
    const mockLeaderboard = [
        {
            rank: 1,
            username: 'CryptoKing',
            credits: 50000,
            isCurrentUser: false
        },
        {
            rank: 2,
            username: 'LuckyWhale',
            credits: 35000,
            isCurrentUser: false
        },
        {
            rank: 3,
            username: 'SlotMaster',
            credits: 28000,
            isCurrentUser: false
        },
        {
            rank: 4,
            username: 'DiamondHands',
            credits: 22000,
            isCurrentUser: false
        },
        {
            rank: 5,
            username: 'NeonRider',
            credits: 18000,
            isCurrentUser: false
        },
        {
            rank: 6,
            username: 'You',
            credits: credits,
            isCurrentUser: true
        },
        {
            rank: 7,
            username: 'BaseBuilder',
            credits: 12000,
            isCurrentUser: false
        },
        {
            rank: 8,
            username: 'JackpotJoe',
            credits: 9500,
            isCurrentUser: false
        },
        {
            rank: 9,
            username: 'SpinDoctor',
            credits: 7800,
            isCurrentUser: false
        },
        {
            rank: 10,
            username: 'ReelDeal',
            credits: 6200,
            isCurrentUser: false
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full max-w-sm rounded-lg border-2 border-purple-500/50 bg-black/70 p-4 shadow-[0_0_15px_rgba(168,85,247,0.3)]",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "mb-3 text-center text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500",
                children: "🏆 Leaderboard"
            }, void 0, false, {
                fileName: "[project]/components/slot/Leaderboard.tsx",
                lineNumber: 30,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-2",
                children: mockLeaderboard.map((entry)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `flex items-center justify-between rounded px-3 py-2 text-sm transition-colors ${entry.isCurrentUser ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/50' : 'bg-purple-900/20'}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `font-bold ${entry.rank === 1 ? 'text-yellow-400' : entry.rank === 2 ? 'text-gray-300' : entry.rank === 3 ? 'text-orange-400' : entry.isCurrentUser ? 'text-cyan-400' : 'text-purple-300'}`,
                                        children: [
                                            "#",
                                            entry.rank.toString()
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/slot/Leaderboard.tsx",
                                        lineNumber: 45,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: entry.isCurrentUser ? 'text-cyan-300 font-bold' : 'text-purple-200',
                                        children: entry.username
                                    }, void 0, false, {
                                        fileName: "[project]/components/slot/Leaderboard.tsx",
                                        lineNumber: 54,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/slot/Leaderboard.tsx",
                                lineNumber: 44,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-mono font-bold text-yellow-400",
                                children: entry.credits.toLocaleString()
                            }, void 0, false, {
                                fileName: "[project]/components/slot/Leaderboard.tsx",
                                lineNumber: 58,
                                columnNumber: 13
                            }, this)
                        ]
                    }, entry.rank, true, {
                        fileName: "[project]/components/slot/Leaderboard.tsx",
                        lineNumber: 36,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/slot/Leaderboard.tsx",
                lineNumber: 34,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/slot/Leaderboard.tsx",
        lineNumber: 29,
        columnNumber: 5
    }, this);
}
_s(Leaderboard, "CsRtNW5m/BC1H3/Lk1lE+KOkXIk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$gameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"]
    ];
});
_c = Leaderboard;
var _c;
__turbopack_context__.k.register(_c, "Leaderboard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/slot/SlotMachine.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SlotMachine",
    ()=>SlotMachine
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$gameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/store/gameStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$slotMachine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/slotMachine.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$audioManager$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/audioManager.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$slot$2f$PixiStage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/slot/PixiStage.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$slot$2f$HUDOverlay$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/slot/HUDOverlay.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$slot$2f$DailyBonusModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/slot/DailyBonusModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$slot$2f$Leaderboard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/slot/Leaderboard.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
function SlotMachine() {
    _s();
    const credits = (0, __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$gameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "SlotMachine.useGameStore[credits]": (state)=>state.credits
    }["SlotMachine.useGameStore[credits]"]);
    const currentBet = (0, __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$gameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "SlotMachine.useGameStore[currentBet]": (state)=>state.currentBet
    }["SlotMachine.useGameStore[currentBet]"]);
    const spinState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$gameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "SlotMachine.useGameStore[spinState]": (state)=>state.spinState
    }["SlotMachine.useGameStore[spinState]"]);
    const reelResults = (0, __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$gameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "SlotMachine.useGameStore[reelResults]": (state)=>state.reelResults
    }["SlotMachine.useGameStore[reelResults]"]);
    const winLines = (0, __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$gameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "SlotMachine.useGameStore[winLines]": (state)=>state.winLines
    }["SlotMachine.useGameStore[winLines]"]);
    const deductCredits = (0, __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$gameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "SlotMachine.useGameStore[deductCredits]": (state)=>state.deductCredits
    }["SlotMachine.useGameStore[deductCredits]"]);
    const addCredits = (0, __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$gameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "SlotMachine.useGameStore[addCredits]": (state)=>state.addCredits
    }["SlotMachine.useGameStore[addCredits]"]);
    const setSpinState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$gameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "SlotMachine.useGameStore[setSpinState]": (state)=>state.setSpinState
    }["SlotMachine.useGameStore[setSpinState]"]);
    const setReelResults = (0, __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$gameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "SlotMachine.useGameStore[setReelResults]": (state)=>state.setReelResults
    }["SlotMachine.useGameStore[setReelResults]"]);
    const setWinLines = (0, __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$gameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "SlotMachine.useGameStore[setWinLines]": (state)=>state.setWinLines
    }["SlotMachine.useGameStore[setWinLines]"]);
    const setLastWin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$gameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "SlotMachine.useGameStore[setLastWin]": (state)=>state.setLastWin
    }["SlotMachine.useGameStore[setLastWin]"]);
    const incrementSpinCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$gameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "SlotMachine.useGameStore[incrementSpinCount]": (state)=>state.incrementSpinCount
    }["SlotMachine.useGameStore[incrementSpinCount]"]);
    const [isNearMiss, setIsNearMiss] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showLeaderboard, setShowLeaderboard] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SlotMachine.useEffect": ()=>{
            setMounted(true);
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$audioManager$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audioManager"].init();
        }
    }["SlotMachine.useEffect"], []);
    const handleSpin = ()=>{
        if (spinState !== 'idle' || credits < currentBet) return;
        deductCredits(currentBet);
        setSpinState('spinning');
        setLastWin(0);
        setWinLines([]);
        incrementSpinCount();
        const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$slotMachine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["spinSlotMachine"])(currentBet);
        setReelResults(result.symbols);
        setIsNearMiss(result.isNearMiss);
        setTimeout(()=>{
            if (result.payout > 0) {
                addCredits(result.payout);
                setLastWin(result.payout);
                setWinLines(result.winLines);
                if (result.winType === 'jackpot') {
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$audioManager$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audioManager"].play('jackpot');
                } else {
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$audioManager$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audioManager"].play('win');
                }
                setTimeout(()=>{
                    setLastWin(0);
                    setWinLines([]);
                }, 4000);
            }
            // Always reset spin state after animation completes
            setTimeout(()=>{
                setSpinState('idle');
            }, 500);
        }, result.isNearMiss ? 3500 : 2000);
    };
    const handleSpinComplete = ()=>{
        setSpinState('idle');
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative w-full h-screen bg-gradient-to-b from-black via-purple-950 to-black overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"
            }, void 0, false, {
                fileName: "[project]/components/slot/SlotMachine.tsx",
                lineNumber: 80,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute top-4 left-4 z-10",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>setShowLeaderboard(!showLeaderboard),
                    className: "px-4 py-2 rounded-lg bg-purple-600/50 hover:bg-purple-500/70 text-white font-bold border-2 border-purple-400 transition-all",
                    children: showLeaderboard ? '← Back' : '🏆 Leaderboard'
                }, void 0, false, {
                    fileName: "[project]/components/slot/SlotMachine.tsx",
                    lineNumber: 83,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/slot/SlotMachine.tsx",
                lineNumber: 82,
                columnNumber: 7
            }, this),
            showLeaderboard ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-center h-full pt-16",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$slot$2f$Leaderboard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Leaderboard"], {}, void 0, false, {
                    fileName: "[project]/components/slot/SlotMachine.tsx",
                    lineNumber: 93,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/slot/SlotMachine.tsx",
                lineNumber: 92,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-center h-full",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$slot$2f$PixiStage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PixiStage"], {
                            symbols: reelResults,
                            onSpinComplete: handleSpinComplete,
                            isSpinning: spinState === 'spinning',
                            isNearMiss: isNearMiss,
                            winLines: winLines
                        }, void 0, false, {
                            fileName: "[project]/components/slot/SlotMachine.tsx",
                            lineNumber: 98,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/slot/SlotMachine.tsx",
                        lineNumber: 97,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$slot$2f$HUDOverlay$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HUDOverlay"], {
                        onSpin: handleSpin,
                        canSpin: spinState === 'idle'
                    }, void 0, false, {
                        fileName: "[project]/components/slot/SlotMachine.tsx",
                        lineNumber: 107,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$slot$2f$DailyBonusModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DailyBonusModal"], {}, void 0, false, {
                fileName: "[project]/components/slot/SlotMachine.tsx",
                lineNumber: 114,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/slot/SlotMachine.tsx",
        lineNumber: 79,
        columnNumber: 5
    }, this);
}
_s(SlotMachine, "44vYGBUNurM17dTKWI9FrNA/ff4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$gameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$gameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$gameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$gameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$gameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$gameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$gameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$gameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$gameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$gameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$gameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$gameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"]
    ];
});
_c = SlotMachine;
var _c;
__turbopack_context__.k.register(_c, "SlotMachine");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$slot$2f$SlotMachine$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/slot/SlotMachine.tsx [app-client] (ecmascript)");
'use client';
;
;
function Home() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "flex min-h-screen flex-col items-center justify-center bg-black",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$slot$2f$SlotMachine$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SlotMachine"], {}, void 0, false, {
            fileName: "[project]/app/page.tsx",
            lineNumber: 8,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
_c = Home;
var _c;
__turbopack_context__.k.register(_c, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_e5786a33._.js.map