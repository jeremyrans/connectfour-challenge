import { GameState, BoardSpace, GameOverState } from './../game-state/game-state';
import { ConnectFourService } from './../connect-four/connect-four.service';
import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';

@Component({
  selector: 'app-connect-four-board',
  templateUrl: './connect-four-board.component.html',
  styleUrls: ['./connect-four-board.component.css']
})
export class ConnectFourBoardComponent implements OnInit {
  @Input() numRows = 6;
  @Input() numCols = 7;
  private _canvasHeight = 300;
  private _canvasWidth = 350;

  @ViewChild('gameCanvas') canvasRef: ElementRef;
  private _context: CanvasRenderingContext2D;

  private get _gridSquareSize(): number {
    return this._canvasWidth / this.numCols;
  }

  constructor(private _connectFourService: ConnectFourService) {

  }

  ngOnInit() {
    this._context = this.canvasRef.nativeElement.getContext('2d');
    this._connectFourService.gameState.subscribe((state) => {
      this._drawBoard(state);
      if (state.gameOverState !== GameOverState.NOT_OVER) {
        this._drawMessage(state.gameOverState);
      }
    });
  }

  private _drawGrid(): void {
    // vertical lines
    for (let i = 1; i < this.numCols; i++) {
      this._drawLine(i * this._gridSquareSize, 0, i * this._gridSquareSize, this._canvasHeight, 1, '#000');
    }
    // horizontal lines
    for (let i = 1; i < this.numRows; i++) {
      this._drawLine(0, i * this._gridSquareSize, this._canvasWidth, i * this._gridSquareSize, 1, '#000');
    }
  }

  private _drawPiece(row: number, col: number, space: BoardSpace): void {
    let color: string;

    switch (space) {
      case BoardSpace.EMPTY:
        color = 'white';
        break;
      case BoardSpace.PLAYER_1:
        color = 'red';
        break;
      case BoardSpace.PLAYER_2:
        color = 'yellow';
        break;
    }

    const gridX = col + 1;
    const gridY = row + 1;
    const centerX = (gridX * this._gridSquareSize) - (this._gridSquareSize / 2);
    const centerY = (gridY * this._gridSquareSize) - (this._gridSquareSize / 2);
    const radius = this._gridSquareSize / 3;

    this._drawCircle(centerX, centerY, radius, color, color);
  }

  private _drawBoard(state: GameState): void {
    this._clear();
    // this._drawGrid();

    for (let i = 0; i < state.board.length; i++) {
      for (let j = 0; j < state.board[i].length; j++) {
        this._drawPiece(i, j, state.board[i][j]);
      }
    }
  }

  private _drawLine(x1, y1, x2, y2, lineWidth, color): void {
    this._context.beginPath();
    this._context.moveTo(x1, y1);
    this._context.lineTo(x2, y2);
    this._context.lineWidth = lineWidth;
    this._context.strokeStyle = color;
    this._context.stroke();
  }

  private _drawCircle(centerX, centerY, radius, fillColor, borderColor): void {
    this._context.beginPath();
    this._context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    this._context.fillStyle = fillColor;
    this._context.fill();
    this._context.lineWidth = 1;
    this._context.strokeStyle = borderColor;
    this._context.stroke();
  }

  private _drawMessage(message): void {
    if (message !== undefined) {
      this._context.fillStyle = '#000';
      this._context.strokeStyle = '#888';
      this._context.font = (this._canvasHeight / 10) + 'px Impact';
      this._context.textAlign = 'center';
      this._context.fillText(message, this._canvasWidth / 2, this._canvasHeight / 2);
      this._context.strokeText(message, this._canvasWidth / 2, this._canvasHeight / 2);
    }
  }

  private _clear(): void {
    this._context.clearRect(0, 0, this._canvasWidth, this._canvasHeight);
  }
}
