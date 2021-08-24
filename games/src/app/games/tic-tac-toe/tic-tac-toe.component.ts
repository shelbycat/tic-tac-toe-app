import { Component, OnInit } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { takeWhile, tap } from 'rxjs/operators';
import { getRandomItem } from 'src/app/utilities';
import { RagamuffinBot } from './bots/ragamuffin-bot';
import { RagdollBot } from './bots/ragdoll-bot';
import {
  GameState,
  blankSquare,
  validateCoords,
  getPlayerString,
  getCoordsString,
} from './game-state';

@Component({
  selector: 'app-tic-tac-toe',
  templateUrl: './tic-tac-toe.component.html',
  styleUrls: ['./tic-tac-toe.component.scss'],
})
export class TicTacToeComponent implements OnInit {
  readonly blankSquare = blankSquare;
  history = [new GameState()];
  currentStepPointer = 0;
  playerX: 'Human' | Bot = 'Human';
  playerO: 'Human' | Bot = 'Human';
  get playerSymbol() {
    if (this.playerX === 'Human' && this.playerO === 'Human') {
      return 'both';
    } else if (this.playerX === 'Human') {
      return 'X';
    } else if (this.playerO === 'Human') {
      return 'O';
    } else {
      return null;
    }
  }
  possibleBots = [new RagamuffinBot(), new RagdollBot()];
  message$: Observable<string> = of('Welcome to Tic Tac Toe.  X goes first.');
  botAnswerSub: Subscription;
  get couchCoOp() {
    return this.playerX === 'Human' && this.playerO === 'Human';
  }

  get currentGameState() {
    return this.history[this.currentStepPointer];
  }

  constructor() {}

  ngOnInit() {}

  setMessage(value: string | Observable<string>) {
    this.message$ = value instanceof Observable ? value : of(value);
  }

  markSquare(markSquare: number) {
    this.botAnswerSub?.unsubscribe();
    const i = validateCoords(markSquare);
    const oldState = this.currentGameState;
    const newState = new GameState(oldState);
    const successfulMove = newState.mark(i);

    if (successfulMove) {
      this.history.splice(this.currentStepPointer + 1, 10, newState);
      this.currentStepPointer++;
    }
    this.updateGameState();
  }

  updateGameState() {
    if (this.currentGameState.winner) {
      if (this.currentGameState.winner === 'Tie') {
        this.setMessage(`Cat's Game`);
      } else {
        this.setMessage(`Player ${this.currentGameState.winner} won!`);
      }
    } else {
      const currentSymbol = this.currentGameState.currentPlayer;
      const currentPlayer = currentSymbol === 'X' ? this.playerX : this.playerO;
      if (this.couchCoOp) {
        this.setMessage(`Player ${currentSymbol}'s turn`);
      } else if (currentPlayer === 'Human') {
        this.setMessage(`Your Turn, Player ${currentSymbol}`);
      } else {
        this.startBotCountdown(currentPlayer);
      }
    }
  }

  startBotCountdown(bot: Bot) {
    const botMessage$ = bot.getMessage(this.currentGameState);
    const botNextMove$ = bot.getNextMove(this.currentGameState).pipe(
      takeWhile(
        () =>
          !this.couchCoOp &&
          this.playerSymbol !== this.currentGameState.currentPlayer
      ),
      tap((value) => this.markSquare(value))
    );
    this.botAnswerSub = botNextMove$.subscribe();
    this.setMessage(botMessage$);
  }

  restart() {
    this.currentStepPointer = 0;
    this.history = [new GameState()];
    this.updateGameState();
  }
  undo() {
    if (this.currentStepPointer < 1) {
      return;
    }
    this.currentStepPointer--;
    if (
      this.currentGameState.lastPlayer === this.playerSymbol &&
      !this.couchCoOp
    ) {
      this.currentStepPointer--;
    }
    this.updateGameState();
  }
  redo() {
    if (this.currentStepPointer + 2 > this.history.length) {
      return;
    }
    this.currentStepPointer++;
    if (
      this.currentGameState.lastPlayer === this.playerSymbol &&
      !this.couchCoOp
    ) {
      this.currentStepPointer++;
    }
    this.updateGameState();
  }
  // playAs(s: 'X' | 'O' | 'both') {
  //   if (s === 'both') {
  //     this.couchCoOp = true;
  //   } else {
  //     this.couchCoOp = false;
  //     this.playerSymbol = s;
  //   }
  //   this.restart();
  // }

  /***** Presentation Logic *****/

  displayMoveStep(move: GameState) {
    const player = getPlayerString(move.lastPlayer);
    const position = getCoordsString(move.lastSquare);
    return `${player} chose ${position}`;
  }

  squareDisabled(square: SquareValue) {
    const squareMarked = square !== blankSquare;
    const gameWon = this.currentGameState.winner;
    const notYourTurn =
      !this.couchCoOp &&
      this.playerSymbol !== this.currentGameState.currentPlayer;
    return squareMarked || gameWon || notYourTurn;
  }

  getWinningLineStyle() {
    if (!this.currentGameState.winner) {
      return { x1: -10, y1: -10, x2: -10, y2: -10 };
    }
    if (this.currentGameState.winner === 'Tie') {
      return {
        path: 'M 6,50 C 86,-65 56,130 6,10',

        strokecolor1: '#333',
        strokecolor2: 'green',
      };
    }
    console.log(this.currentGameState.winningLine);
    const coordA = this.currentGameState.winningLine.start - 1;
    const coordB = this.currentGameState.winningLine.end - 1;
    console.log(coordA, coordB);
    const results = {
      x1: (coordA % 3) * 20 + 10,
      y1: ((coordA - (coordA % 3)) / 3) * 20 + 10,
      x2: (coordB % 3) * 20 + 10,
      y2: ((coordB - (coordB % 3)) / 3) * 20 + 10,
      strokecolor1: '#333',
      strokecolor2: 'green',
    };
    console.log(results);
    return results;
  }
}
