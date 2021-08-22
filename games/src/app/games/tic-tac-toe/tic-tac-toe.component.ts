import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
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
    const i = validateCoords(markSquare);
    console.log(i);
    const oldState = this.currentGameState;
    const newState = new GameState(oldState);
    const successfulMove = newState.mark(i);

    if (successfulMove) {
      this.history.splice(this.currentStepPointer + 1, 10, newState);
      this.currentStepPointer++;
      if (oldState.currentPlayer === this.playerSymbol) {
        this.startBotCountdown();
      }
    }
    this.updateMessage();
  }

  updateMessage() {
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
      this.setMessage(this.bot.getMessage(this.currentGameState));
    }
  }

  startBotCountdown() {
    console.log('Bot Countdown Started');
  }

  restart() {
    this.currentStepPointer = 0;
    this.history = [new GameState()];
    this.updateMessage();
  }
  undo() {
    if (this.currentStepPointer < 1) {
      return;
    }
    this.currentStepPointer--;
    this.updateMessage();
  }
  redo() {
    if (this.currentStepPointer + 2 > this.history.length) {
      return;
    }
    this.currentStepPointer++;
    this.updateMessage();
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

  parseMoveStep(move: GameState) {
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
