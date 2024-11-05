// src/utils/crosswordUtils.ts
import { CrosswordCell, CrosswordClue } from '../app/types/types';

function canPlaceWord(
  grid: CrosswordCell[][],
  word: string,
  startX: number,
  startY: number,
  direction: 'across' | 'down'
): boolean {
  // Check if word fits within grid bounds
  if (direction === 'across' && startX + word.length > 12) return false;
  if (direction === 'down' && startY + word.length > 12) return false;

  // Check the cell before the word (if it exists)
  if (direction === 'across' && startX > 0) {
    if (!grid[startY][startX - 1].isBlank) return false;
  }
  if (direction === 'down' && startY > 0) {
    if (!grid[startY - 1][startX].isBlank) return false;
  }

  // Check the cell after the word (if it exists)
  if (direction === 'across' && startX + word.length < 12) {
    if (!grid[startY][startX + word.length].isBlank) return false;
  }
  if (direction === 'down' && startY + word.length < 12) {
    if (!grid[startY + word.length][startX].isBlank) return false;
  }

  let hasValidIntersection = false;
  let intersectionCount = 0;

  // Check each position of the word
  for (let i = 0; i < word.length; i++) {
    const x = direction === 'across' ? startX + i : startX;
    const y = direction === 'down' ? startY + i : startY;

    // If cell is occupied, check if letters match
    if (!grid[y][x].isBlank) {
      if (grid[y][x].letter !== word[i].toUpperCase()) {
        return false;
      }
      intersectionCount++;
      hasValidIntersection = true;
    } else {
      // Check adjacent cells (perpendicular to direction)
      if (direction === 'across') {
        // Check cells above and below
        if (y > 0 && !grid[y-1][x].isBlank) intersectionCount++;
        if (y < 11 && !grid[y+1][x].isBlank) intersectionCount++;
      } else {
        // Check cells to left and right
        if (x > 0 && !grid[y][x-1].isBlank) intersectionCount++;
        if (x < 11 && !grid[y][x+1].isBlank) intersectionCount++;
      }
    }

    // Prevent too many intersections (which could create invalid words)
    if (intersectionCount > 2) return false;
  }

  return true;
}

function placeWord(
  grid: CrosswordCell[][],
  word: string,
  startX: number,
  startY: number,
  number: number,
  direction: 'across' | 'down'
): void {
  const letters = word.split('');
  letters.forEach((letter, i) => {
    const x = direction === 'across' ? startX + i : startX;
    const y = direction === 'down' ? startY + i : startY;
    
    grid[y][x] = {
      letter: letter.toUpperCase(),
      isBlank: false,
      number: i === 0 ? number : grid[y][x]?.number,
    };
  });
}

function findBestPlacement(
  grid: CrosswordCell[][],
  word: string,
  existingWords: number
): { x: number; y: number; direction: 'across' | 'down' } | null {
  let bestPlacement = null;
  let bestScore = -1;

  // Try both directions
  ['across', 'down'].forEach((direction) => {
    // Try each starting position
    for (let y = 0; y < 12; y++) {
      for (let x = 0; x < 12; x++) {
        if (canPlaceWord(grid, word, x, y, direction as 'across' | 'down')) {
          // Calculate placement score based on position and intersections
          let score = 0;
          
          // Prefer central positions for first few words
          if (existingWords < 3) {
            const centerX = 6;
            const centerY = 6;
            score += (12 - Math.abs(x - centerX) - Math.abs(y - centerY));
          }

          // Check for intersections
          for (let i = 0; i < word.length; i++) {
            const checkX = direction === 'across' ? x + i : x;
            const checkY = direction === 'down' ? y + i : y;
            
            if (!grid[checkY][checkX].isBlank) {
              score += 5; // Bonus for intersections
            }
          }

          if (score > bestScore) {
            bestScore = score;
            bestPlacement = { x, y, direction: direction as 'across' | 'down' };
          }
        }
      }
    }
  });

  return bestPlacement;
}

export function generateGrid(clues: CrosswordClue[]): CrosswordCell[][] {
  // Initialize empty 12x12 grid
  const grid: CrosswordCell[][] = Array(12).fill(null).map(() =>
    Array(12).fill(null).map(() => ({ letter: '', isBlank: true }))
  );

  // Sort clues by answer length (longer words first)
  const sortedClues = [...clues].sort((a, b) => b.answer.length - a.answer.length);

  let placedWords = 0;
  let currentNumber = 1;

  // Place each word
  sortedClues.forEach((clue) => {
    // Find the best placement for the current word
    const placement = findBestPlacement(grid, clue.answer, placedWords);

    if (placement) {
      const { x, y, direction } = placement;
      placeWord(grid, clue.answer, x, y, currentNumber, direction);
      
      // Update clue with placement information
      clue.startx = x;
      clue.starty = y;
      clue.direction = direction;
      clue.number = currentNumber;

      placedWords++;
      currentNumber++;
    }
  });

  // Fill remaining empty cells with black
  for (let y = 0; y < 12; y++) {
    for (let x = 0; x < 12; x++) {
      if (grid[y][x].isBlank) {
        grid[y][x] = { letter: '', isBlank: true };
      }
    }
  }

  return grid;
}

// Helper function to validate the grid
export function validateGrid(grid: CrosswordCell[][]): boolean {
  // Check each cell
  for (let y = 0; y < 12; y++) {
    for (let x = 0; x < 12; x++) {
      if (!grid[y][x].isBlank) {
        // Check if it's part of a valid word (at least 3 letters)
        let isValidAcross = false;
        let isValidDown = false;

        // Check horizontal word
        if (x === 0 || grid[y][x-1].isBlank) {
          let length = 0;
          let tx = x;
          while (tx < 12 && !grid[y][tx].isBlank) {
            length++;
            tx++;
          }
          isValidAcross = length >= 3;
        }

        // Check vertical word
        if (y === 0 || grid[y-1][x].isBlank) {
          let length = 0;
          let ty = y;
          while (ty < 12 && !grid[ty][x].isBlank) {
            length++;
            ty++;
          }
          isValidDown = length >= 3;
        }

        if (!isValidAcross && !isValidDown) {
          return false;
        }
      }
    }
  }
  return true;
}