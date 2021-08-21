export const blankSquare = ' ';

export class GameState {
  public squares: SquareValue[];
  public lastSquare?: Coords;
  public lastPlayer: SquareValue = blankSquare;
  public currentPlayer: SquareValue;
  public turnCount: number;
  public winner: SquareValue | 'Tie' = null;
  public winningSquares?: WinningSquaresArray = undefined;
  constructor(oldGameState?: GameState) {
    this.squares =
      oldGameState?.squares?.slice() || Array(10).fill(blankSquare, 1);
    delete this.squares[0];
    this.lastSquare = oldGameState?.lastSquare || undefined;
    this.lastPlayer = oldGameState?.lastPlayer || null;
    this.currentPlayer = oldGameState?.currentPlayer || 'X';
    this.turnCount = oldGameState?.turnCount || 0;
    this.calculateWinner();
  }
  calculateWinner() {
    const win = calculateWinner(this.squares);
    if (win) {
      this.winner = win.winner;
      this.winningSquares = win.winnningSquares;
    } else if (this.turnCount === 9) {
      this.winner = 'Tie';
    }
  }
  switchPlayer() {
    this.lastPlayer = this.currentPlayer;
    this.currentPlayer = getOppositePlayer(this.currentPlayer);
  }
  mark(i: Coords) {
    if (!i || this.squares[i] !== blankSquare || this.winner) {
      console.log(!i, this.squares[i] !== blankSquare, this.winner);
      return false;
    }
    console.log('Hello', this.currentPlayer);
    console.log(`Marking ${i}`);
    this.lastSquare = i;
    this.squares[i] = this.currentPlayer;
    this.turnCount++;
    this.calculateWinner();
    this.switchPlayer();
    return true;
  }
}

export const calculateWinner = (squares: Array<SquareValue>) => {
  const lines: WinningSquaresArray[] = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7],
  ];
  const line = lines.find(
    ([a, b, c]) =>
      squares[a] !== blankSquare &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
  );
  if (line) {
    return { winnningSquares: line, winner: squares[line[0]] };
  }
  return null;
};

export const getOppositePlayer = (player: SquareValue) =>
  player === 'X' ? 'O' : 'X';

export const getPlayerString = (
  player: SquareValue,
  opposite: boolean = false
) => {
  if (opposite) {
    player = getOppositePlayer(player);
  }
  if (player === 'X') {
    return 'X';
  } else {
    return 'O';
  }
};

const coordsByNumber = {
  0: 'None',
  1: 'A1',
  2: 'A2',
  3: 'A3',
  4: 'B1',
  5: 'B2',
  6: 'B3',
  7: 'C1',
  8: 'C2',
  9: 'C3',
} as const;

export const getCoordsString = (i?: Coords) => (i ? coordsByNumber[i] : 'None');
export const validateCoords = (i: number): Coords => {
  if (i > 0 && i < 10) {
    return i as Coords;
  } else {
    throw new Error(`Got unexpected coordinate value ${i}`);
  }
};
