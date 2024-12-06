'use client';

import { useState } from 'react';
import { CrosswordCell, CrosswordClue } from '../types/types';
import CrosswordGrid from './CrosswordGrid';
import CluesList from './CluesList';
import ScoreDisplay from './ScoreDisplay';
import WordFeedback from './WordFeedback';
import { generateGrid } from '@/utils/crosswordUtils';

const gridPattern = {
  backgroundImage: 'linear-gradient(90deg,rgba(0,0,0,.03) 1px,transparent 0),linear-gradient(180deg,rgba(0,0,0,.03) 1px,transparent 0)',
  backgroundSize: '40px 40px'
};

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
    <div className="min-h-screen bg-white" style={gridPattern}>
      <div className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white opacity-50" />
        <div className="container mx-auto px-4 relative">
          <h1 className="text-5xl font-bold text-center mb-6">
            <span className="bg-gradient-to-r from-black via-gray-700 to-black text-transparent bg-clip-text">
              Crossword Generator
            </span>
          </h1>
          {showGenerationUI && (
            <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-8">
              Create a unique crossword puzzle tailored to your interests and skill level.
            </p>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16">
        {showGenerationUI && (
          <div className="max-w-2xl mx-auto backdrop-blur-sm bg-white/90 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="block text-base font-bold text-black">
                  Select Field
                </label>
                <select 
                  value={field}
                  onChange={(e) => setField(e.target.value)}
                  className="w-full p-3 border-2 border-black/10 rounded-xl text-base focus:border-black focus:ring-1 focus:ring-black transition-all duration-300
                    hover:border-black/30 bg-white/50 backdrop-blur-sm"
                >
                  <option value="">Choose a field...</option>
                  {fields.map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-base font-bold text-black">
                  Select Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full p-3 border-2 border-black/10 rounded-xl text-base focus:border-black focus:ring-1 focus:ring-black transition-all duration-300
                    hover:border-black/30 bg-white/50 backdrop-blur-sm"
                >
                  <option value="">Choose difficulty...</option>
                  {difficulties.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <button
              onClick={handleGenerate}
              disabled={!field || !difficulty || loading}
              className="w-full bg-black text-white py-3 px-6 rounded-xl text-base font-semibold
                hover:bg-gray-800 disabled:bg-gray-400 transition-all duration-300
                transform hover:-translate-y-1 disabled:hover:transform-none
                shadow-lg hover:shadow-xl disabled:shadow-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  Generating...
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <div className="space-y-6">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                <div className="flex justify-center">
                  <CrosswordGrid 
                    grid={grid} 
                    onCellChange={handleCellChange}
                    showAnswers={showAnswers}
                    userAnswers={userAnswers}
                    clues={clues}
                  />
                </div>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={() => setShowAnswers(!showAnswers)}
                  className="w-1/2 bg-black/80 text-white py-3 px-6 rounded-xl text-base font-semibold
                    hover:bg-black transition-all duration-300 shadow-lg hover:shadow-xl
                    transform hover:-translate-y-1"
                >
                  {showAnswers ? 'Hide Answers' : 'Show Answers'}
                </button>
                <button
                  onClick={checkAnswers}
                  className="w-1/2 bg-black text-white py-3 px-6 rounded-xl text-base font-semibold
                    hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl
                    transform hover:-translate-y-1"
                >
                  Check Answers
                </button>
              </div>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] max-h-[600px] overflow-y-auto">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-black via-gray-700 to-black text-transparent bg-clip-text">
                    Across
                  </h3>
                  <CluesList clues={clues} direction="across" />
                </div>
                <div className="border-t border-black/10 pt-6 space-y-4">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-black via-gray-700 to-black text-transparent bg-clip-text">
                    Down
                  </h3>
                  <CluesList clues={clues} direction="down" />
                </div>
              </div>
            </div>
          </div>
        )}

        {feedback && (
          <div className="mt-6">
            <WordFeedback word={feedback.word} isCorrect={feedback.isCorrect} />
          </div>
        )}
        
        {currentScore && (
          <div className="mt-6">
            <ScoreDisplay score={currentScore} />
          </div>
        )}
      </div>
    </div>
  );
}