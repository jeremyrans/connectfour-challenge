import { GameState, BoardSpace, GameOverState } from './../game-state/game-state';
import { ConnectFourService } from './../connect-four/connect-four.service';
import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-connect-four-board',
  templateUrl: './connect-four-board.component.html',
  styleUrls: ['./connect-four-board.component.css']
})
export class ConnectFourBoardComponent implements OnInit {
  @Input() numRows = 6;
  @Input() numCols = 7;
  @Input() speed = 0.5;

  private _canvasHeight = 300;
  private _canvasWidth = 350;
  classicTheme = false;

  @ViewChild('boardCanvas') boardCanvasRef: ElementRef;
  @ViewChild('pieceCanvas') pieceCanvasRef: ElementRef;

  private _boardContext: CanvasRenderingContext2D;
  private _pieceContext: CanvasRenderingContext2D;
  private _lastGameOverState = GameOverState.NOT_OVER;

  private get _gridSquareSize(): number {
    return this._canvasWidth / this.numCols;
  }

  constructor(private _connectFourService: ConnectFourService, private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.route.queryParams.subscribe(
      (params: any) => {
        if (params.hasOwnProperty('classic')) {
          this.classicTheme = true;
        }
      }
    );
    this._boardContext = this.boardCanvasRef.nativeElement.getContext('2d');
    this._pieceContext = this.pieceCanvasRef.nativeElement.getContext('2d');

    this._drawBoard();
    this._connectFourService.piecePlayed.subscribe(
      move => {
        if (move !== null) {
          this._drawPiece(this._pieceContext, move[0], move[1], move[2], true);
        }
      }
    );
    this._connectFourService.gameState.subscribe(
      state => {
        if (state.gameOverState !== GameOverState.NOT_OVER) {
          if (state.gameOverState === GameOverState.STALEMATE) {
            this._drawMessage(this._boardContext, 'Stalemate!');
          } else {
            this._drawMessage(this._boardContext, 'Player ' + state.gameOverState + ' Wins!');
          }
        } else if (this._lastGameOverState !== GameOverState.NOT_OVER) {
          this._reset();
          this._drawBoard();
        }
        this._lastGameOverState = state.gameOverState;
      }
    );
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
    this._drawRect(this._boardContext, 0, 0, this._canvasWidth, this._canvasHeight, this.classicTheme ? '#FDDD41' : 'blue');

    this._boardContext.globalCompositeOperation = 'destination-out';
    for (let i = 0; i < this.numRows; i++) {
      for (let j = 0; j < this.numCols; j++) {
        this._drawPiece(this._boardContext, i, j, 1, false);
      }
    }
    this._boardContext.globalCompositeOperation = 'source-over';
  }

  private _animatePiece(context, col, startY, destY, space, startTime, time) {
    const deltaTime = (time - startTime) / ((1.1 - this.speed) * 1000);
    const x = ((col + 1) * this._gridSquareSize) - (this._gridSquareSize / 2);
    const radius = this._gridSquareSize / 3;
    const color = this._getSpaceColor(space);
    let newY = startY + ((destY - startY) * deltaTime);

    if (deltaTime >= 1) {
      // last frame
      newY = destY;
    }

    context.clearRect(x - radius - 1, startY - radius - 1, (radius + 1) * 2, destY + radius);
    this._drawCircle(context, x, newY, radius, color, color);

    // request new frame
    if (deltaTime < 1) {
      requestAnimationFrame(function (t) {
        this._animatePiece(context, col, startY, destY, space, startTime, t);
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
      context.font = (this._canvasHeight / 10) + 'px Impact';
      context.textAlign = 'center';
      context.fillText(message, this._canvasWidth / 2, this._canvasHeight / 2);
      context.strokeText(message, this._canvasWidth / 2, this._canvasHeight / 2);
    }
  }

  private _drawRect(context, x, y, width, height, fillColor) {
    context.beginPath();
    context.fillStyle = fillColor;
    context.fillRect(x, y, width, height);
    context.stroke();
  }

  private _clear(context): void {
    context.clearRect(0, 0, this._canvasWidth, this._canvasHeight);
  }
}
