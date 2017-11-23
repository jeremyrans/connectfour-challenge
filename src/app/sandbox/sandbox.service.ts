import { Injectable } from '@angular/core';
import { BoardSpace, GameOverState } from '../game-state/game-state';

@Injectable()
export class SandboxService {

  public api = {
    checkLine: this.checkLine,
    checkWin: this.checkWin,
    isValidMove: this.isValidMove,
    applyMove: this.applyMove,
    getValidMoves: this.getValidMoves,
    _boardSpaceToGameOverState: this._boardSpaceToGameOverState
  };

  constructor() { }

  private _boardSpaceToGameOverState(boardSpace: BoardSpace): GameOverState {
    return boardSpace === BoardSpace.PLAYER_1 ? GameOverState.PLAYER_1_WIN : GameOverState.PLAYER_2_WIN;
  }

  checkLine(a, b, c, d) {
    // Check first cell non-zero and all cells match
    return ((a !== BoardSpace.EMPTY) && (a === b) && (a === c) && (a === d));
  }

  checkWin(board: BoardSpace[][]): GameOverState {
    if (board === null) {
      return GameOverState.NOT_OVER;
    }

    // Check down
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 7; c++) {
        if (this.checkLine(board[r][c], board[r + 1][c], board[r + 2][c], board[r + 3][c])) {
          return this._boardSpaceToGameOverState(board[r][c]);
        }
      }
    }

    // Check right
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.checkLine(board[r][c], board[r][c + 1], board[r][c + 2], board[r][c + 3])) {
          return this._boardSpaceToGameOverState(board[r][c]);
        }
      }
    }

    // Check down-right
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.checkLine(board[r][c], board[r + 1][c + 1], board[r + 2][c + 2], board[r + 3][c + 3])) {
          return this._boardSpaceToGameOverState(board[r][c]);
        }
      }
    }

    // Check down-left
    for (let r = 3; r < 6; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.checkLine(board[r][c], board[r - 1][c + 1], board[r - 2][c + 2], board[r - 3][c + 3])) {
          return this._boardSpaceToGameOverState(board[r][c]);
        }
      }
    }

    // Check if board is full (stalemate), otherwise game not over
    const full = board[0].filter((x) => x === BoardSpace.EMPTY).length === 0;
    return full ? GameOverState.STALEMATE : GameOverState.NOT_OVER;
  }

  isValidMove(board: BoardSpace[][], col: number): boolean {
    return col < board[0].length && board[0][col] === BoardSpace.EMPTY;
  }

  applyMove(board: BoardSpace[][], col: number, player: BoardSpace): BoardSpace[][] {
    const newBoard = JSON.parse(JSON.stringify(board));
    if (!this.isValidMove(newBoard, col)) {
      return null;
    }

    for (let i = newBoard.length - 1; i >= 0; i--) {
      if (newBoard[i][col] === BoardSpace.EMPTY) {
        newBoard[i][col] = player;
        break;
      }
    }

    return newBoard;
  }

  getValidMoves(board: BoardSpace[][]): number[] {
    const validMoves = [];
    for (let i = 0; i < board[0].length; i++) {
      if (board[0][i] === BoardSpace.EMPTY) {
        validMoves.push(i);
      }
    }
    return validMoves;
  }
}
