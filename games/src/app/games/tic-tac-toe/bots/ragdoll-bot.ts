import { interval, from, zip, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { getRandomItem } from 'src/app/utilities';
import { blankSquare, getAllCoords } from '../game-state';

export class RagdollBot implements Bot {
  name = 'Ragdoll';
  initialize() {}
  getNextMove(gameState: GameState) {
    const openSquares = getAllCoords().filter(
      (i) => gameState.squares[i] === blankSquare
    );
    const mySquare = getRandomItem(openSquares);
    return of(mySquare).pipe(delay(400));
  }
  getMessage(gameState: GameState) {
    const message$ = from(["Hold on.  I'm thinking."]);
    return message$;
  }
}
