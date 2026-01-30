'use client';

import { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';
import gsap from 'gsap';
import type { SlotSymbol, WinLine } from '@/store/gameStore';
import { audioManager } from '@/lib/audioManager';

interface PixiStageProps {
  symbols: SlotSymbol[]; // 9 symbols for 3x3 grid
  onSpinComplete: () => void;
  isSpinning: boolean;
  isNearMiss: boolean;
  winLines: WinLine[];
}

const SYMBOL_SIZE = 80;
const SLOT_SIZE = 100;
const GRID_SPACING = 10;
const GRID_SIZE = 3;

export function PixiStage({ symbols, onSpinComplete, isSpinning, isNearMiss, winLines }: PixiStageProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const slotsRef = useRef<PIXI.Container[]>([]);
  const winLineGraphicsRef = useRef<PIXI.Graphics | null>(null);
  const symbolsRef = useRef<SlotSymbol[]>(Array(9).fill('🍒') as SlotSymbol[]);

  useEffect(() => {
    if (!containerRef.current || appRef.current) return;

    const app = new PIXI.Application();
    
    const gridWidth = GRID_SIZE * SLOT_SIZE + (GRID_SIZE - 1) * GRID_SPACING;
    const gridHeight = GRID_SIZE * SLOT_SIZE + (GRID_SIZE - 1) * GRID_SPACING;
    const canvasWidth = gridWidth + 40;
    const canvasHeight = gridHeight + 40;
    
    app.init({
      width: canvasWidth,
      height: canvasHeight,
      backgroundColor: 0x050505,
      antialias: true,
    }).then(() => {
      if (containerRef.current) {
        containerRef.current.appendChild(app.canvas);
        appRef.current = app;
        initGrid(app);
      }
    }).catch((error: Error) => {
      console.error('Failed to initialize Pixi:', error);
    });

    return () => {
      if (appRef.current) {
        appRef.current.destroy(true, { children: true, texture: true });
        appRef.current = null;
      }
    };
  }, []);

  const initGrid = (app: PIXI.Application): void => {
    const slots: PIXI.Container[] = [];
    const offsetX = 20;
    const offsetY = 20;

    // Create 3x3 grid
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const index = row * GRID_SIZE + col;
        const slot = new PIXI.Container();
        
        slot.x = offsetX + col * (SLOT_SIZE + GRID_SPACING);
        slot.y = offsetY + row * (SLOT_SIZE + GRID_SPACING);

        // Background
        const bg = new PIXI.Graphics();
        bg.rect(0, 0, SLOT_SIZE, SLOT_SIZE);
        bg.fill({ color: 0x1a1a2e, alpha: 0.8 });
        bg.stroke({ width: 2, color: 0x00f0ff, alpha: 0.5 });
        slot.addChild(bg);

        // Symbol text
        const symbolText = new PIXI.Text({
          text: '🍒',
          style: {
            fontSize: SYMBOL_SIZE,
            align: 'center',
          },
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
    const winLineGraphics = new PIXI.Graphics();
    app.stage.addChild(winLineGraphics);
    winLineGraphicsRef.current = winLineGraphics;

    slotsRef.current = slots;
  };

  useEffect(() => {
    if (isSpinning && slotsRef.current.length > 0) {
      spinSlots();
    }
  }, [isSpinning]);

  useEffect(() => {
    if (winLines.length > 0 && !isSpinning) {
      drawWinLines();
    } else {
      clearWinLines();
    }
  }, [winLines, isSpinning]);

  const spinSlots = (): void => {
    audioManager.play('spin');
    clearWinLines();

    const slots = slotsRef.current;
    const timeline = gsap.timeline();

    // Spin all slots with staggered start
    slots.forEach((slot: PIXI.Container, index: number) => {
      const symbolText = slot.children[1] as PIXI.Text;
      const row = Math.floor(index / GRID_SIZE);
      const col = index % GRID_SIZE;
      const delay = (row * 0.05) + (col * 0.05);
      
      timeline.to(symbolText, {
        rotation: Math.PI * 6,
        duration: 0.5,
        ease: 'power2.in',
        onUpdate: () => {
          symbolText.text = ['🍒', '🍋', '🍊', '🍉', '💎', '7️⃣', '⭐'][Math.floor(Math.random() * 7)];
        },
      }, delay);
    });

    timeline.call(() => {
      stopSlots();
    });
  };

  const stopSlots = (): void => {
    audioManager.stop('spin');

    const slots = slotsRef.current;
    const stopTimeline = gsap.timeline();

    // Stop slots row by row
    slots.forEach((slot: PIXI.Container, index: number) => {
      const symbolText = slot.children[1] as PIXI.Text;
      const row = Math.floor(index / GRID_SIZE);
      const delay = row * 0.3;

      stopTimeline.to(symbolText, {
        rotation: 0,
        duration: 0.3,
        ease: 'back.out',
        onStart: () => {
          symbolText.text = symbols[index];
          if (row === 0 && index % GRID_SIZE === 0) {
            audioManager.play('stop');
          }
        },
      }, delay);
    });

    stopTimeline.call(() => {
      onSpinComplete();
    });
  };

  const drawWinLines = (): void => {
    const graphics = winLineGraphicsRef.current;
    if (!graphics) return;

    graphics.clear();

    const offsetX = 20;
    const offsetY = 20;

    winLines.forEach((winLine: WinLine) => {
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
      gsap.fromTo(graphics, 
        { alpha: 0.5 },
        { 
          alpha: 1, 
          duration: 0.5, 
          repeat: 5, 
          yoyo: true 
        }
      );
    });

    // Highlight winning slots
    winLines.forEach((winLine: WinLine) => {
      winLine.positions.forEach((pos: number) => {
        const slot = slotsRef.current[pos];
        const bg = slot.children[0] as PIXI.Graphics;
        
        gsap.to(bg, {
          alpha: 1,
          duration: 0.3,
          repeat: 5,
          yoyo: true,
        });
      });
    });
  };

  const clearWinLines = (): void => {
    const graphics = winLineGraphicsRef.current;
    if (graphics) {
      graphics.clear();
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="flex items-center justify-center"
      style={{ filter: 'drop-shadow(0 0 20px rgba(0, 240, 255, 0.5))' }}
    />
  );
}
