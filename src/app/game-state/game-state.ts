export enum BoardSpace {
  EMPTY = 0,
  PLAYER_1 = 1,
  PLAYER_2 = 2
}

export enum GameOverState {
  NOT_OVER = 0,
  PLAYER_1_WIN = 1,
  PLAYER_2_WIN = 2,
  STALEMATE = 3
}

const ROWS = 6;
const COLS = 7;

/*
Top row is 0, first column is 0
(0,0) (0,1) (0,2) (0,3) (0,4) (0,5) (0,6)
...
(5,0) (5,1) (5,2) (5,3) (5,4) (5,5) (5,6)
*/

export class GameState {
  board: BoardSpace[][] = [];
  gameOverState: GameOverState = GameOverState.NOT_OVER;

  constructor() {
    for (let i = 0; i < ROWS; i++) {
      this.board[i] = [];
      for (let j = 0; j < COLS; j++) {
        this.board[i][j] = BoardSpace.EMPTY;
      }
    }
  }

  private _boardSpaceToGameOverState(boardSpace: BoardSpace): GameOverState {
    return boardSpace === BoardSpace.PLAYER_1 ? GameOverState.PLAYER_1_WIN : GameOverState.PLAYER_2_WIN;
  }

  private _checkLine(a, b, c, d) {
    // Check first cell non-zero and all cells match
    return ((a !== BoardSpace.EMPTY) && (a === b) && (a === c) && (a === d));
  }

  private _checkGameOver(board: BoardSpace[][]): GameOverState {
    // Check down
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 7; c++) {
        if (this._checkLine(board[r][c], board[r + 1][c], board[r + 2][c], board[r + 3][c])) {
          return this._boardSpaceToGameOverState(board[r][c]);
        }
      }
    }

    // Check right
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 4; c++) {
        if (this._checkLine(board[r][c], board[r][c + 1], board[r][c + 2], board[r][c + 3])) {
          return this._boardSpaceToGameOverState(board[r][c]);
        }
      }
    }


    // Check down-right
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 4; c++) {
        if (this._checkLine(board[r][c], board[r + 1][c + 1], board[r + 2][c + 2], board[r + 3][c + 3])) {
          return this._boardSpaceToGameOverState(board[r][c]);
        }
      }
    }

    // Check down-left
    for (let r = 3; r < 6; r++) {
      for (let c = 0; c < 4; c++) {
        if (this._checkLine(board[r][c], board[r - 1][c + 1], board[r - 2][c + 2], board[r - 3][c + 3])) {
          return this._boardSpaceToGameOverState(board[r][c]);
        }
      }
    }

    // Check if board is full (stalemate), otherwise game not over
    const full = board[0].filter((x) => x === BoardSpace.EMPTY).length === 0;
    return full ? GameOverState.STALEMATE : GameOverState.NOT_OVER;
  }

  private _isValidMove(col: number): boolean {
    return col < COLS && this.board[0][col] === BoardSpace.EMPTY;
  }

  playMove(col: number, player: number): number {
    let playedRow = -1;

    if (this._isValidMove(col)) {
      for (let i = ROWS - 1; i >= 0; i--) {
        if (this.board[i][col] === BoardSpace.EMPTY) {
          playedRow = i;
          this.board[i][col] = player;
          break;
        }
      }
      this.gameOverState = this._checkGameOver(this.board);
    } else {
      this.gameOverState = player === 1 ? GameOverState.PLAYER_2_WIN : GameOverState.PLAYER_1_WIN;
    }
    return playedRow;
  }
}
