declare type SquareValue = 'X' | 'O' | ' ';
declare type Coords = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
declare type CoordsOrNull = null | Coords;
declare type WinningSquaresArray = [Coords, Coords, Coords];

declare type GameState = {
  squares: SquareValue[];
  lastSquare?: Coords;
  lastPlayer: SquareValue;
  currentPlayer: SquareValue;
  turnCount: number;
  winner: SquareValue | 'Tie';
  winningSquares?: WinningSquaresArray;
};

declare type GameStatePartial = {
  squares?: SquareValue[];
  lastSquare?: Coords;
  lastPlayer?: SquareValue;
  currentPlayer?: SquareValue;
  turnCount?: number;
  winner?: SquareValue | 'Tie';
  winningSquares?: [Coords, Coords, Coords];
};
