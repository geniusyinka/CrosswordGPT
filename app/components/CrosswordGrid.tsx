// src/components/CrosswordGrid.tsx
'use client';

import { useRef, KeyboardEvent, useState } from 'react';
import { CrosswordCell, CrosswordClue } from '../types/types';

interface CrosswordGridProps {
  grid: CrosswordCell[][];
  onCellChange: (x: number, y: number, value: string) => void;
  showAnswers: boolean;
  userAnswers: string[][];
  clues: CrosswordClue[];
}

export default function CrosswordGrid({ 
  grid, 
  onCellChange, 
  showAnswers,
  userAnswers
}: CrosswordGridProps) {
  const inputRefs = useRef<Array<Array<HTMLInputElement | null>>>(
    Array(12).fill(null).map(() => Array(12).fill(null))
  );
  const [currentDirection, setCurrentDirection] = useState<'across' | 'down'>('across');
  const [lastCellPosition, setLastCellPosition] = useState<{ x: number; y: number } | null>(null);

  const setInputRef = (element: HTMLInputElement | null, y: number, x: number) => {
    if (inputRefs.current) {
      inputRefs.current[y][x] = element;
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>, x: number, y: number) => {
    const { key } = event;

    if (showAnswers) return;

    if (key === 'Tab') {
      event.preventDefault();
      setCurrentDirection(prev => prev === 'across' ? 'down' : 'across');
      return;
    }

    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
      event.preventDefault();
      let newX = x;
      let newY = y;

      if (currentDirection === 'across') {
        switch (key) {
          case 'ArrowLeft':
            newX = Math.max(0, x - 1);
            break;
          case 'ArrowRight':
            newX = Math.min(11, x + 1);
            break;
          case 'ArrowUp':
            setCurrentDirection('down');
            newY = Math.max(0, y - 1);
            break;
          case 'ArrowDown':
            setCurrentDirection('down');
            newY = Math.min(11, y + 1);
            break;
        }
      } else {
        switch (key) {
          case 'ArrowUp':
            newY = Math.max(0, y - 1);
            break;
          case 'ArrowDown':
            newY = Math.min(11, y + 1);
            break;
          case 'ArrowLeft':
            setCurrentDirection('across');
            newX = Math.max(0, x - 1);
            break;
          case 'ArrowRight':
            setCurrentDirection('across');
            newX = Math.min(11, x + 1);
            break;
        }
      }

      while (newX >= 0 && newX < 12 && newY >= 0 && newY < 12 && grid[newY][newX].isBlank) {
        if (currentDirection === 'across') {
          if (key === 'ArrowLeft') newX--;
          else if (key === 'ArrowRight') newX++;
          if (newX < 0 || newX > 11) break;
        } else {
          if (key === 'ArrowUp') newY--;
          else if (key === 'ArrowDown') newY++;
          if (newY < 0 || newY > 11) break;
        }
      }

      if (newX >= 0 && newX < 12 && newY >= 0 && newY < 12 && !grid[newY][newX].isBlank) {
        inputRefs.current[newY][newX]?.focus();
        setLastCellPosition({ x: newX, y: newY });
      }
    }
  };

  const handleInput = (x: number, y: number, value: string) => {
    if (showAnswers) return;

    onCellChange(x, y, value);
    setLastCellPosition({ x, y });

    if (value) {
      let newX = x;
      let newY = y;

      if (currentDirection === 'across') {
        newX = Math.min(11, x + 1);
        while (newX < 12 && grid[y][newX].isBlank) newX++;
      } else {
        newY = Math.min(11, y + 1);
        while (newY < 12 && grid[newY][x].isBlank) newY++;
      }

      if (newX < 12 && newY < 12 && !grid[newY][newX].isBlank) {
        inputRefs.current[newY][newX]?.focus();
      }
    }
  };

  return (
    <div className="border-2 border-black rounded-lg overflow-hidden">
      <div className="grid grid-cols-12 gap-0">
        {grid.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${x}-${y}`}
              className={`relative ${
                cell.isBlank ? 'bg-black' : 'bg-white'
              }`}
              style={{ width: '48px', height: '48px' }}
            >
              {!cell.isBlank && (
                <div className="w-full h-full border border-gray-300">
                  {cell.number && (
                    <span className="absolute top-0.5 left-1 text-xs font-black text-black z-10">
                      {cell.number}
                    </span>
                  )}
                  <input
                    ref={(el) => setInputRef(el, y, x)}
                    type="text"
                    maxLength={1}
                    readOnly={showAnswers}
                    value={showAnswers ? cell.letter : userAnswers[y][x] || ''}
                    className={`w-full h-full text-center uppercase bg-transparent focus:outline-none focus:bg-blue-50 
                      text-xl font-bold text-black transition-colors
                      ${showAnswers ? 'cursor-not-allowed bg-gray-50' : ''}
                      ${lastCellPosition?.x === x && lastCellPosition?.y === y ? 'bg-blue-100' : ''}
                      ${userAnswers[y][x] === cell.letter && userAnswers[y][x] ? 'text-green-600' : ''}`}
                    onChange={(e) => handleInput(x, y, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, x, y)}
                  />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}