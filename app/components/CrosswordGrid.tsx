// src/components/CrosswordGrid.tsx
'use client';

import { useRef, KeyboardEvent, useState, useEffect } from 'react';
import { CrosswordCell } from '../types/types';
import WordFeedback from './WordFeedback';
import ScoreDisplay from './ScoreDisplay';

interface CrosswordGridProps {
  grid: CrosswordCell[][];
  onCellChange: (x: number, y: number, value: string) => void;
  showAnswers: boolean;
  userAnswers: string[][];
  clues: any[];
}

export default function CrosswordGrid({ 
  grid, 
  onCellChange, 
  showAnswers,
  userAnswers,
  clues 
}: CrosswordGridProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[][]>(
    Array(12).fill(null).map(() => Array(12).fill(null))
  );
  const [currentDirection, setCurrentDirection] = useState<'across' | 'down'>('across');
  const [feedback, setFeedback] = useState<{ word: string; isCorrect: boolean } | null>(null);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [lastCellPosition, setLastCellPosition] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    calculateCompletionPercentage();
  }, [userAnswers]);

  const calculateCorrectLetters = () => {
    let correct = 0;
    grid.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (!cell.isBlank && userAnswers[y][x] === cell.letter) {
          correct++;
        }
      });
    });
    return correct;
  };

  const calculateTotalLetters = () => {
    let total = 0;
    grid.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (!cell.isBlank) {
          total++;
        }
      });
    });
    return total;
  };

  const getCorrectWords = () => {
    const correctWords: string[] = [];
    clues.forEach(clue => {
      let isCorrect = true;
      for (let i = 0; i < clue.answer.length; i++) {
        const x = clue.direction === 'across' ? clue.startx + i : clue.startx;
        const y = clue.direction === 'down' ? clue.starty + i : clue.starty;
        if (userAnswers[y][x] !== grid[y][x].letter) {
          isCorrect = false;
          break;
        }
      }
      if (isCorrect) {
        correctWords.push(clue.answer);
      }
    });
    return correctWords;
  };

  const checkWord = (x: number, y: number) => {
    clues.forEach(clue => {
      let word = '';
      let correct = true;
      let allFilled = true;
      let cells: { x: number; y: number }[] = [];

      for (let i = 0; i < clue.answer.length; i++) {
        const checkX = clue.direction === 'across' ? clue.startx + i : clue.startx;
        const checkY = clue.direction === 'down' ? clue.starty + i : clue.starty;
        cells.push({ x: checkX, y: checkY });

        if (!userAnswers[checkY][checkX]) {
          allFilled = false;
        } else {
          word += userAnswers[checkY][checkX];
          if (userAnswers[checkY][checkX] !== grid[checkY][checkX].letter) {
            correct = false;
          }
        }
      }

      if (allFilled && cells.some(cell => cell.x === x && cell.y === y)) {
        setFeedback({
          word: clue.answer,
          isCorrect: correct
        });
      }
    });
  };

  const calculateCompletionPercentage = () => {
    const correct = calculateCorrectLetters();
    const total = calculateTotalLetters();
    setCompletionPercentage(Math.round((correct / total) * 100));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>, x: number, y: number) => {
    if (showAnswers) return;
    
    const { key } = event;

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

      setTimeout(() => checkWord(x, y), 100);
    }
  };

  return (
    <div className="relative">
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
                      ref={el => inputRefs.current[y][x] = el}
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
      {feedback && <WordFeedback word={feedback.word} isCorrect={feedback.isCorrect} />}
      <ScoreDisplay 
        score={completionPercentage > 0 ? {
          percentage: completionPercentage,
          correctCount: calculateCorrectLetters(),
          total: calculateTotalLetters(),
          correctWords: getCorrectWords()
        } : null}
      />
    </div>
  );
}