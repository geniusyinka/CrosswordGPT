'use client';

import { useEffect, useState } from 'react';

interface WordFeedbackProps {
  word: string;
  isCorrect: boolean;
}

export default function WordFeedback({ word, isCorrect }: WordFeedbackProps) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className={`fixed bottom-6 right-6 left-6 md:left-auto md:w-64 p-4 rounded-lg shadow-lg animate-slide-up
      ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}
    >
      <div className="flex items-center space-x-2">
        <span className="text-2xl">{isCorrect ? '✅' : '❌'}</span>
        <div>
          <p className={`font-semibold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
            {isCorrect ? 'Correct!' : 'Try Again'}
          </p>
          {isCorrect && (
            <p className="text-sm text-green-600">
              {word} is correct!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}