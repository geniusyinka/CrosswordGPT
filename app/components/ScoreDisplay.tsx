// app/components/ScoreDisplay.tsx
'use client';

import { useState, useEffect } from 'react';

interface ScoreDisplayProps {
  score: {
    percentage: number;
    correctCount: number;
    total: number;
    correctWords: string[];
  } | null;
}

export default function ScoreDisplay({ score }: ScoreDisplayProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (score) {
      setShow(true);
      if (score.percentage !== 100) {
        const timer = setTimeout(() => setShow(false), 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [score]);

  if (!score || !show) return null;

  return (
    <div className="fixed bottom-6 right-6 left-6 md:left-auto md:w-96 bg-white border border-gray-200 rounded-lg shadow-lg p-4 animate-slide-up">
      <div className="relative">
        {/* Close button */}
        <button 
          onClick={() => setShow(false)}
          className="absolute -top-2 -right-2 text-gray-400 hover:text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Score content */}
        <div className="space-y-3">
          {score.percentage === 100 ? (
            <>
              <div className="flex items-center justify-center text-3xl mb-2">
                🎉
              </div>
              <h3 className="text-xl font-bold text-center text-green-600">
                Congratulations!
              </h3>
              <p className="text-center text-gray-700">
                You&apos;ve solved the entire crossword correctly!
              </p>
            </>
          ) : (
            <>
              <div className="flex justify-center mb-2">
                <div className="relative w-20 h-20">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle
                      className="text-gray-200"
                      strokeWidth="8"
                      stroke="currentColor"
                      fill="transparent"
                      r="32"
                      cx="40"
                      cy="40"
                    />
                    <circle
                      className="text-blue-600"
                      strokeWidth="8"
                      strokeDasharray={200}
                      strokeDashoffset={200 - (score.percentage * 2)}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="32"
                      cx="40"
                      cy="40"
                    />
                  </svg>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="text-xl font-bold text-gray-700">
                      {score.percentage}%
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <p className="text-gray-600">
                  You&apos;ve got <span className="font-bold text-blue-600">{score.correctCount}</span> out of <span className="font-bold">{score.total}</span> letters correct
                </p>
                {score.correctWords.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Completed words:</p>
                    <div className="flex flex-wrap gap-2 justify-center mt-1">
                      {score.correctWords.map((word, index) => (
                        <span 
                          key={index}
                          className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded"
                        >
                          {word}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}