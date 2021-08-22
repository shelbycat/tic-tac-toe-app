import { getRandomItem } from 'src/app/utilities';
import { blankSquare, getAllCoords } from '../game-state';

export class RagamuffinBot implements Bot {
  initialize() {}
  getNextMove(gameState: GameState) {
    const openSquares = getAllCoords().filter((i) => {
      gameState.squares[i] = blankSquare;
    });
    return getRandomItem(openSquares);
  }
}
