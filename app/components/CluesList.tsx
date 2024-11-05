'use client';

import { CrosswordClue } from '../types/types';

interface CluesListProps {
  clues: CrosswordClue[];
  direction: 'across' | 'down';
}

export default function CluesList({ clues, direction }: CluesListProps) {
  const filteredClues = clues.filter((clue) => clue.direction === direction);

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h3 className="font-bold text-xl mb-4 text-gray-800 capitalize">{direction}</h3>
      <ul className="space-y-3">
        {filteredClues.map((clue) => (
          <li key={`${direction}-${clue.number}-${clue.answer}`} className="text-base text-gray-700">
            <span className="font-bold mr-2 text-black">{clue.number}.</span>
            {clue.clue}
          </li>
        ))}
      </ul>
    </div>
  );
}