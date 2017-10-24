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
}
