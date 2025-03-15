import { BOARD_WIDTH, BOARD_HEIGHT, TETROMINOES } from './constants';
import type { GameState, Tetromino } from './types';

export function createEmptyBoard(): string[][] {
  return Array(BOARD_HEIGHT).fill(null).map(() => 
    Array(BOARD_WIDTH).fill('')
  );
}

export function createNewPiece(): Tetromino {
  const pieces = Object.keys(TETROMINOES);
  const randomPiece = pieces[Math.floor(Math.random() * pieces.length)];
  const piece = TETROMINOES[randomPiece as keyof typeof TETROMINOES];
  
  return {
    shape: piece.shape,
    color: piece.color,
    position: {
      x: Math.floor(BOARD_WIDTH / 2) - Math.floor(piece.shape[0].length / 2),
      y: 0
    }
  };
}

export function isValidMove(board: string[][], piece: Tetromino): boolean {
  return piece.shape.every((row, dy) =>
    row.every((cell, dx) => {
      if (cell === 0) return true;
      const newX = piece.position.x + dx;
      const newY = piece.position.y + dy;
      return (
        newX >= 0 &&
        newX < BOARD_WIDTH &&
        newY >= 0 &&
        newY < BOARD_HEIGHT &&
        board[newY][newX] === ''
      );
    })
  );
}

export function mergePieceToBoard(board: string[][], piece: Tetromino): string[][] {
  const newBoard = board.map(row => [...row]);
  
  piece.shape.forEach((row, dy) => {
    row.forEach((cell, dx) => {
      if (cell === 1) {
        const newY = piece.position.y + dy;
        const newX = piece.position.x + dx;
        if (newY >= 0 && newY < BOARD_HEIGHT && newX >= 0 && newX < BOARD_WIDTH) {
          newBoard[newY][newX] = piece.color;
        }
      }
    });
  });
  
  return newBoard;
}

export function clearLines(board: string[][]): { newBoard: string[][], linesCleared: number } {
  let linesCleared = 0;
  const newBoard = board.filter(row => {
    const isComplete = row.every(cell => cell !== '');
    if (isComplete) linesCleared++;
    return !isComplete;
  });

  while (newBoard.length < BOARD_HEIGHT) {
    newBoard.unshift(Array(BOARD_WIDTH).fill(''));
  }

  return { newBoard, linesCleared };
}

export function rotatePiece(piece: Tetromino): Tetromino {
  const newShape = piece.shape[0].map((_, index) =>
    piece.shape.map(row => row[index]).reverse()
  );

  return {
    ...piece,
    shape: newShape
  };
}