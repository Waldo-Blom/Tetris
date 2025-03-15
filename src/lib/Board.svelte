<script lang="ts">
  import { CELL_SIZE, BOARD_WIDTH, BOARD_HEIGHT } from './constants';
  export let board: string[][];
</script>

<div class="board" style="width: {BOARD_WIDTH * CELL_SIZE}px; height: {BOARD_HEIGHT * CELL_SIZE}px;">
  {#each board as row, y}
    {#each row as cell, x}
      <div
        class="cell"
        style="
          background-color: {cell || 'transparent'};
          top: {y * CELL_SIZE}px;
          left: {x * CELL_SIZE}px;
          width: {CELL_SIZE}px;
          height: {CELL_SIZE}px;
        "
      />
    {/each}
  {/each}
</div>

<style>
  .board {
    position: relative;
    border: 2px solid #333;
    background-color: #111;
  }

  .cell {
    position: absolute;
    border: 1px solid #333;
  }
</style>