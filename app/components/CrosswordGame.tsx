'use client';

import { useState } from 'react';
import { CrosswordCell, CrosswordClue } from '../types/types';
import CrosswordGrid from './CrosswordGrid';
import CluesList from './CluesList';
import ScoreDisplay from './ScoreDisplay';
import WordFeedback from './WordFeedback';
import { generateGrid } from '@/utils/crosswordUtils';

export default function CrosswordGame() {
  const [field, setField] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [loading, setLoading] = useState(false);
  const [grid, setGrid] = useState<CrosswordCell[][]>([]);
  const [clues, setClues] = useState<CrosswordClue[]>([]);
  const [userAnswers, setUserAnswers] = useState<string[][]>(
    Array(12).fill('').map(() => Array(12).fill(''))
  );
  const [showAnswers, setShowAnswers] = useState(false);
  const [feedback, setFeedback] = useState<{ word: string; isCorrect: boolean } | null>(null);
  const [currentScore, setCurrentScore] = useState<{ percentage: number; correctCount: number; total: number; correctWords: string[] } | null>(null);
  const [showGenerationUI, setShowGenerationUI] = useState(true);

  const fields = [
    'Science', 'History', 'Geography', 'Literature', 
    'Movies', 'Sports', 'Technology', 'Music'
  ];

  const difficulties = ['Easy', 'Medium', 'Hard'];

  const handleGenerate = async () => {
    setLoading(true);
    setShowAnswers(false);
    setCurrentScore(null);
    setFeedback(null);
    setUserAnswers(Array(12).fill('').map(() => Array(12).fill('')));
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ field, difficulty }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate crossword');
      }

      const data = await response.json();

      const numberedClues: CrosswordClue[] = data.clues.map((clue: { clue: string; answer: string; direction: 'across' | 'down' }, index: number) => ({
        ...clue,
        number: index + 1,
        startx: 0,
        starty: 0,
      }));

      setClues(numberedClues);
      const newGrid = generateGrid(numberedClues);
      setGrid(newGrid);
      setShowGenerationUI(false);
    } catch (error) {
      console.error('Error generating crossword:', error);
      alert('Error generating crossword. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCellChange = (x: number, y: number, value: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[y][x] = value.toUpperCase();
    setUserAnswers(newAnswers);
    checkWordAtPosition(x, y);
  };

  const checkWordAtPosition = (x: number, y: number) => {
    clues.forEach(clue => {
      let word = '';
      let isComplete = true;
      const positions: Array<{ x: number; y: number }> = [];

      for (let i = 0; i < clue.answer.length; i++) {
        const checkX = clue.direction === 'across' ? clue.startx + i : clue.startx;
        const checkY = clue.direction === 'down' ? clue.starty + i : clue.starty;
        positions.push({ x: checkX, y: checkY });

        if (!userAnswers[checkY][checkX]) {
          isComplete = false;
          break;
        }
        word += userAnswers[checkY][checkX];
      }

      if (isComplete && positions.some(pos => pos.x === x && pos.y === y)) {
        const isCorrect = word === clue.answer;
        setFeedback({
          word: clue.answer,
          isCorrect,
        });
      }
    });
  };

  const checkAnswers = () => {
    let total = 0;
    let correctCount = 0;
    const correctWords: string[] = [];

    // Utility function to validate coordinates
    const isValidPosition = (x: number, y: number) => {
      return x >= 0 && x < 12 && y >= 0 && y < 12 && !grid[y][x].isBlank;
    };

    clues.forEach(clue => {
      let wordCorrect = true;
      const word = clue.answer;
      const startX = clue.startx;
      const startY = clue.starty;

      let isValidWord = true;
      for (let i = 0; i < word.length; i++) {
        const x = clue.direction === 'across' ? startX + i : startX;
        const y = clue.direction === 'down' ? startY + i : startY;

        if (!isValidPosition(x, y)) {
          isValidWord = false;
          break;
        }

        total++;
        if (userAnswers[y][x] === grid[y][x].letter) {
          correctCount++;
        } else {
          wordCorrect = false;
        }
      }

      if (isValidWord && wordCorrect && word.length > 0) {
        correctWords.push(word);
      }
    });

    if (total > 0) {
      const percentage = Math.round((correctCount / total) * 100);
      setCurrentScore({
        percentage,
        correctCount,
        total,
        correctWords
      });
    }
  };

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10 text-black">
          Crossword Generator
        </h1>

        {showGenerationUI && (
          <div className="mb-10 max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="block text-base font-bold text-black mb-2">
                  Select Field
                </label>
                <select 
                  value={field}
                  onChange={(e) => setField(e.target.value)}
                  className="w-full p-3 border-2 border-gray-400 rounded-lg text-lg focus:border-black focus:ring-1 focus:ring-black font-medium text-black bg-white"
                >
                  <option value="" className="text-gray-600">Choose a field...</option>
                  {fields.map(f => (
                    <option key={f} value={f} className="text-black font-medium">
                      {f}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-base font-bold text-black mb-2">
                  Select Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full p-3 border-2 border-gray-400 rounded-lg text-lg focus:border-black focus:ring-1 focus:ring-black font-medium text-black bg-white"
                >
                  <option value="" className="text-gray-600">Choose difficulty...</option>
                  {difficulties.map(d => (
                    <option key={d} value={d} className="text-black font-medium">
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <button
              onClick={handleGenerate}
              disabled={!field || !difficulty || loading}
              className="w-full bg-black text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  Generating...
                  <svg className="animate-spin ml-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
              ) : (
                'Generate Crossword'
              )}
            </button>
          </div>
        )}

        {grid.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div className="flex justify-center">
                <CrosswordGrid 
                  grid={grid} 
                  onCellChange={handleCellChange}
                  showAnswers={showAnswers}
                  userAnswers={userAnswers}
                  clues={clues}
                />
              </div>
              <div className="flex gap-4 max-w-xl mx-auto">
                <button
                  onClick={() => setShowAnswers(!showAnswers)}
                  className="w-1/2 bg-gray-800 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-gray-700 transition-colors"
                >
                  {showAnswers ? 'Hide Answers' : 'Show Answers'}
                </button>
                <button
                  onClick={checkAnswers}
                  className="w-1/2 bg-black text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-gray-800 transition-colors"
                >
                  Check Answers
                </button>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <div className="space-y-8">
                <CluesList clues={clues} direction="across" />
                <div className="border-t border-gray-200 pt-8">
                  <CluesList clues={clues} direction="down" />
                </div>
              </div>
            </div>
          </div>
        )}

        {feedback && <WordFeedback word={feedback.word} isCorrect={feedback.isCorrect} />}
        {currentScore && <ScoreDisplay score={currentScore} />}
      </div>
    </div>
  );
}
