export type Direction = 'across' | 'down';

export interface CrosswordCell {
  letter: string;
  number?: number;
  isBlank: boolean;
}

export interface CrosswordClue {
  number: number;
  direction: Direction;
  clue: string;
  answer: string;
  startx: number;
  starty: number;
}