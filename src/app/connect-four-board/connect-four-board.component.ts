import { GameState, BoardSpace, GameOverState } from './../game-state/game-state';
import { ConnectFourService } from './../connect-four/connect-four.service';
import { Component, OnInit, ViewChild, ElementRef, Input, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-connect-four-board',
  templateUrl: './connect-four-board.component.html',
  styleUrls: ['./connect-four-board.component.css']
})
export class ConnectFourBoardComponent implements OnInit, AfterViewInit {
  @Input() numRows = 6;
  @Input() numCols = 7;
  @Input() speed = 500;
  @Input() width = 350;
  @Input() height = 300;

  classicTheme = false;

  @ViewChild('boardCanvas') boardCanvasRef: ElementRef;
  @ViewChild('pieceCanvas') pieceCanvasRef: ElementRef;

  private _boardContext: CanvasRenderingContext2D;
  private _pieceContext: CanvasRenderingContext2D;
  private _lastGameOverState = GameOverState.NOT_OVER;

  private get _gridSquareSize(): number {
    return this.width / this.numCols;
  }

  constructor(public connectFourService: ConnectFourService, private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.route.queryParams.subscribe(
      (params: any) => {
        if (params.hasOwnProperty('classic')) {
          this.classicTheme = true;
        }
      }
    );

    this.boardCanvasRef.nativeElement.width = this.width;
    this.boardCanvasRef.nativeElement.height = this.height;
    this.pieceCanvasRef.nativeElement.height = this.height;
    this.pieceCanvasRef.nativeElement.height = this.height;
    this._boardContext = this.boardCanvasRef.nativeElement.getContext('2d');
    this._pieceContext = this.pieceCanvasRef.nativeElement.getContext('2d');

    this.connectFourService.piecePlayed.subscribe(
      move => {
        if (move !== null) {
          this._drawPiece(this._pieceContext, move[0], move[1], move[2], true);
        }
      }
    );
    this.connectFourService.gameState.subscribe(
      state => {
        if (state.gameOverState !== GameOverState.NOT_OVER) {
          this._drawPieces(state.board);
          if (state.gameOverState === GameOverState.STALEMATE) {
            this._drawMessage(this._boardContext, 'Stalemate!');
          } else if (state.gameOverState === GameOverState.PLAYER_1_WIN || state.gameOverState === GameOverState.PLAYER_2_WIN) {
            // regular win
            this._drawMessage(this._boardContext,
              (state.gameOverState === GameOverState.PLAYER_1_WIN ? 'Red' : this.classicTheme ? 'Black' : 'Yellow') + ' Player Wins!');
          } else {
            // win by timeout
            this._drawMessage(this._boardContext,
              (state.gameOverState === GameOverState.PLAYER_1_TIMEOUT ? 'Red' : this.classicTheme ? 'Black' : 'Yellow') + ' Timed Out!');
          }
        } else if (this._lastGameOverState !== GameOverState.NOT_OVER) {
          this._reset();
          this._drawBoard();
        }
        this._lastGameOverState = state.gameOverState;
      }
    );
  }

  ngAfterViewInit(): void {
    this._drawBoard();
  }

  private _getSpaceColor(space: BoardSpace): string {
    switch (space) {
      case BoardSpace.EMPTY:
        return 'white';
      case BoardSpace.PLAYER_1:
        return 'red';
      case BoardSpace.PLAYER_2:
        return this.classicTheme ? 'black' : 'yellow';
    }
  }

  private _drawPieces(board: BoardSpace[][]): void {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        this._drawPiece(this._pieceContext, i, j, board[i][j], false);
      }
    }
  }

  private _drawPiece(context, row: number, col: number, space: BoardSpace, animate: boolean): void {
    const color = this._getSpaceColor(space);

    const gridX = col + 1;
    const gridY = row + 1;
    const centerX = (gridX * this._gridSquareSize) - (this._gridSquareSize / 2);
    const centerY = (gridY * this._gridSquareSize) - (this._gridSquareSize / 2);
    const radius = this._gridSquareSize / 3;

    if (animate) {
      const t = performance.now();
      this._animatePiece(context, col, 0, centerY, space, t, t);
    } else {
      this._drawCircle(context, centerX, centerY, radius, color, color);
    }
  }

  private _reset(): void {
    this._clear(this._boardContext);
    this._clear(this._pieceContext);
  }

  private _drawBoard(): void {
    this._drawRect(this._boardContext, 0, 0, this.width, this.height, this.classicTheme ? '#FDDD41' : 'blue');

    this._boardContext.globalCompositeOperation = 'destination-out';
    for (let i = 0; i < this.numRows; i++) {
      for (let j = 0; j < this.numCols; j++) {
        this._drawPiece(this._boardContext, i, j, 1, false);
      }
    }
    this._boardContext.globalCompositeOperation = 'source-over';
  }

  private _animatePiece(context, col, startY, destY, space, startTime, time) {
    const x = ((col + 1) * this._gridSquareSize) - (this._gridSquareSize / 2);
    const radius = this._gridSquareSize / 3;
    const color = this._getSpaceColor(space);
    let delta = ((this.speed / 1000) * 7) ** 2;
    delta = delta < 5 ? 5 : delta;
    let newY = startY + delta;

    if (newY >= destY) {
      // last frame
      newY = destY;
    }

    context.clearRect(x - radius - 1, 0, (radius + 1) * 2, destY + radius);
    this._drawCircle(context, x, newY, radius, color, color);

    // request new frame
    if (newY < destY) {
      requestAnimationFrame(function (t) {
        this._animatePiece(context, col, newY, destY, space, startTime, t);
      }.bind(this));
    }
  }

  private _drawLine(context, x1, y1, x2, y2, lineWidth, color): void {
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.lineWidth = lineWidth;
    context.strokeStyle = color;
    context.stroke();
  }

  private _drawCircle(context, centerX, centerY, radius, fillColor, borderColor): void {
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    context.fillStyle = fillColor;
    context.fill();
    context.lineWidth = 1;
    context.strokeStyle = borderColor;
    context.stroke();
  }

  private _drawMessage(context, message): void {
    if (message !== undefined) {
      context.fillStyle = '#FFF';
      context.strokeStyle = '#888';
      context.font = (this.height / 10) + 'px Impact';
      context.textAlign = 'center';
      context.fillText(message, this.width / 2, this.height / 2);
      context.strokeText(message, this.width / 2, this.height / 2);
    }
  }

  private _drawRect(context, x, y, width, height, fillColor) {
    context.beginPath();
    context.fillStyle = fillColor;
    context.fillRect(x, y, width, height);
    context.stroke();
  }

  private _clear(context): void {
    context.clearRect(0, 0, this.width, this.height);
  }
}
