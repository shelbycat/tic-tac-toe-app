import { Component, OnInit } from '@angular/core';
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

  get currentGameState() {
    return this.history[this.currentStepPointer];
  }

  constructor() {}

  ngOnInit() {}

  clickSquare(markSquare: number) {
    const i = validateCoords(markSquare);
    console.log(i);
    const state = this.currentGameState;
    const newState = new GameState(state);
    const successfulMove = newState.mark(i);

    if (successfulMove) {
      this.history.splice(this.currentStepPointer + 1, 10, newState);
      this.currentStepPointer++;
    }
  }

  restart() {
    this.currentStepPointer = 0;
    this.history = [new GameState()];
  }
  undo() {
    if (this.currentStepPointer < 1) {
      return;
    }
    this.currentStepPointer--;
  }
  redo() {
    if (this.currentStepPointer + 2 > this.history.length) {
      return;
    }
    this.currentStepPointer++;
  }

  parseMoveStep(move: GameState) {
    const player = getPlayerString(move.lastPlayer);
    const position = getCoordsString(move.lastSquare);
    return `${player} chose ${position}`;
  }
}
