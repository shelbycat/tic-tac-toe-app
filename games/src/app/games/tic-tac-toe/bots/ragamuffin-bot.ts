import { interval, from, zip, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { getRandomItem } from 'src/app/utilities';
import { blankSquare, getAllCoords } from '../game-state';

export class RagamuffinBot implements Bot {
  name = 'Ragamuffin';
  initialize() {}
  getNextMove(gameState: GameState) {
    const openSquares = getAllCoords().filter(
      (i) => gameState.squares[i] === blankSquare
    );
    const mySquare = getRandomItem(openSquares);
    return of(mySquare).pipe(delay(1400));
  }
  getMessage(gameState: GameState) {
    const message$ = from([
      'Hold on.',
      'Hold on..',
      'Hold on...',
      'The ragamuffin is thinking.',
      'The ragamuffin is thinking..',
      'The ragamuffin is thinking...',
    ]);
    return zip(interval(200), message$).pipe(map(([time, message]) => message));
  }
}
