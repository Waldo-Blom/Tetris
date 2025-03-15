<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import Board from './lib/Board.svelte';
  import {
    createEmptyBoard,
    createNewPiece,
    isValidMove,
    mergePieceToBoard,
    clearLines,
    rotatePiece
  } from './lib/game';
  import { BOARD_WIDTH, BOARD_HEIGHT, CELL_SIZE } from './lib/constants';
  import type { GameState, Tetromino } from './lib/types';

  let gameState: GameState = {
    board: createEmptyBoard(),
    currentPiece: null,
    score: 0,
    gameOver: false
  };

  let gameLoop: number;
  let dropInterval = 1000;
  let lastDropTime = 0;

  function startGame() {
    gameState = {
      board: createEmptyBoard(),
      currentPiece: createNewPiece(),
      score: 0,
      gameOver: false
    };
    lastDropTime = Date.now();
    if (gameLoop) cancelAnimationFrame(gameLoop);
    update();
  }

  function update() {
    const currentTime = Date.now();
    if (currentTime - lastDropTime > dropInterval) {
      moveDown();
      lastDropTime = currentTime;
    }
    gameLoop = requestAnimationFrame(update);
  }

  function moveDown() {
    if (!gameState.currentPiece || gameState.gameOver) return;

    const newPiece = {
      ...gameState.currentPiece,
      position: {
        ...gameState.currentPiece.position,
        y: gameState.currentPiece.position.y + 1
      }
    };

    if (isValidMove(gameState.board, newPiece)) {
      gameState.currentPiece = newPiece;
    } else {
      // Piece has landed
      gameState.board = mergePieceToBoard(gameState.board, gameState.currentPiece);
      const { newBoard, linesCleared } = clearLines(gameState.board);
      gameState.board = newBoard;
      gameState.score += linesCleared * 100;

      // Create new piece
      gameState.currentPiece = createNewPiece();
      if (!isValidMove(gameState.board, gameState.currentPiece)) {
        gameState.gameOver = true;
      }
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (!gameState.currentPiece || gameState.gameOver) return;

    if (['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp'].includes(event.key)) {
      event.preventDefault();
    }

    let newPiece: Tetromino = { ...gameState.currentPiece };

    switch (event.key) {
      case 'ArrowLeft':
        newPiece.position.x--;
        break;
      case 'ArrowRight':
        newPiece.position.x++;
        break;
      case 'ArrowDown':
        newPiece.position.y++;
        break;
      case 'ArrowUp':
        newPiece = rotatePiece(newPiece);
        break;
    }

    if (isValidMove(gameState.board, newPiece)) {
      gameState.currentPiece = newPiece;
    }
  }

  onMount(() => {
    window.addEventListener('keydown', handleKeydown);
    startGame();
  });

  onDestroy(() => {
    window.removeEventListener('keydown', handleKeydown);
    if (gameLoop) cancelAnimationFrame(gameLoop);
  });

  $: displayBoard = gameState.currentPiece
    ? mergePieceToBoard(gameState.board, gameState.currentPiece)
    : gameState.board;
</script>

<main>
  <div class="game-wrapper">
    <div class="game-container">
      <div class="controls">
        <h2>Controls</h2>
        <div class="key-list">
          <div class="key-item">
            <kbd>↑</kbd>
            <span>Rotate</span>
          </div>
          <div class="key-item">
            <kbd>←</kbd>
            <span>Move Left</span>
          </div>
          <div class="key-item">
            <kbd>→</kbd>
            <span>Move Right</span>
          </div>
          <div class="key-item">
            <kbd>↓</kbd>
            <span>Move Down</span>
          </div>
        </div>
      </div>
      <div class="game-content">
        <div class="game-info">
          <h1>Tetris</h1>
          <p>Score: {gameState.score}</p>
          {#if gameState.gameOver}
            <div class="game-over">
              <h2>Game Over!</h2>
              <button on:click={startGame}>Play Again</button>
            </div>
          {/if}
        </div>
        <Board board={displayBoard} />
      </div>
    </div>
  </div>
</main>

<style>
  main {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #1a1a1a;
    color: white;
    overflow: hidden;
    padding: 20px;
  }

  .game-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
  }

  .game-container {
    display: flex;
    gap: 40px;
    align-items: center;
    justify-content: center;
  }

  .game-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  .game-info {
    text-align: center;
  }

  .controls {
    background: rgba(0, 0, 0, 0.2);
    padding: 20px;
    border-radius: 10px;
    min-width: 200px;
  }

  .controls h2 {
    margin: 0 0 20px 0;
    text-align: center;
  }

  .key-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .key-item {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  kbd {
    background-color: #333;
    border-radius: 4px;
    padding: 4px 8px;
    font-family: monospace;
    font-size: 14px;
    min-width: 30px;
    text-align: center;
  }

  .game-over {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(0, 0, 0, 0.8);
    padding: 20px;
    border-radius: 10px;
    text-align: center;
  }

  button {
    background-color: #4CAF50;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
  }

  button:hover {
    background-color: #45a049;
  }
</style>