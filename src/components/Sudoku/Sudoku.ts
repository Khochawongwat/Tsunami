class SudokuGenerator {
  private board: number[][];

  constructor() {
    this.board = [];
  }

  generate(): number[][] {
    this.board = this.createEmptyBoard();
    this.fillBoard();
    this.removeCells();

    return this.board;
  }

  private createEmptyBoard(): number[][] {
    const board: number[][] = [];

    for (let row = 0; row < 9; row++) {
      board.push([]);
      for (let col = 0; col < 9; col++) {
        board[row].push(0);
      }
    }

    return board;
  }

  private fillBoard(): boolean {
    return this.fillBoardRecursive(0, 0);
  }

  private fillBoardRecursive(row: number, col: number): boolean {
    if (row === 9) {
      return true;
    }

    if (col === 9) {
      return this.fillBoardRecursive(row + 1, 0);
    }

    if (this.board[row][col] !== 0) {
      return this.fillBoardRecursive(row, col + 1);
    }

    const numbers = this.shuffleNumbers();

    for (let num of numbers) {
      if (this.isValidPlacement(row, col, num)) {
        this.board[row][col] = num;
        if (this.fillBoardRecursive(row, col + 1)) {
          return true;
        } else {
          this.board[row][col] = 0;
        }
      }
    }

    return false;
  }

  private isValidPlacement(row: number, col: number, num: number): boolean {
    return (
      this.isRowValid(row, num) &&
      this.isColumnValid(col, num) &&
      this.isBoxValid(row, col, num)
    );
  }

  private isRowValid(row: number, num: number): boolean {
    for (let col = 0; col < 9; col++) {
      if (this.board[row][col] === num) {
        return false;
      }
    }
    return true;
  }

  private isColumnValid(col: number, num: number): boolean {
    for (let row = 0; row < 9; row++) {
      if (this.board[row][col] === num) {
        return false;
      }
    }
    return true;
  }

  private isBoxValid(row: number, col: number, num: number): boolean {
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;

    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (this.board[boxRow + r][boxCol + c] === num) {
          return false;
        }
      }
    }

    return true;
  }

  private removeCells(): void {
    const numCellsToRemove = 3;

    for (let i = 0; i < numCellsToRemove; i++) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);

      if (this.board[row][col] !== 0) {
        this.board[row][col] = 0;
      } else {
        i--;
      }
    }
  }

  private shuffleNumbers(): number[] {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }

    return numbers;
  }
}

export default SudokuGenerator;
