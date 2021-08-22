import { Component, OnInit } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { takeWhile, tap } from 'rxjs/operators';
import { RagamuffinBot } from './bots/ragamuffin-bot';
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
  playerSymbol: 'X' | 'O' = 'X';
  bot: Bot = new RagamuffinBot();
  message$: Observable<string> = of('Welcome to Tic Tac Toe.  X goes first.');
  botAnswerSub: Subscription;
  couchCoOp = true;

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
    } else if (this.couchCoOp) {
      this.setMessage(`Player ${this.currentGameState.currentPlayer}'s turn`);
    } else if (this.playerSymbol === this.currentGameState.currentPlayer) {
      this.setMessage('Your turn');
    } else {
      this.startBotCountdown();
    }
  }

  startBotCountdown() {
    const botMessage$ = this.bot.getMessage(this.currentGameState);
    const botNextMove$ = this.bot.getNextMove(this.currentGameState).pipe(
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
  playAs(s: 'X' | 'O' | 'both') {
    if (s === 'both') {
      this.couchCoOp = true;
    } else {
      this.couchCoOp = false;
      this.playerSymbol = s;
    }
    this.restart();
  }

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
}
