var sandbox = {
  getMove: function () { return 1; },

  checkLine: function (a, b, c, d) {
    // Check first cell non-zero and all cells match
    return ((a !== 0) && (a === b) && (a === c) && (a === d));
  },

  checkWin: function (board) {
    if (!board) {
      return 0;
    }

    // Check down
    for (var r = 0; r < 3; r++) {
      for (var c = 0; c < 7; c++) {
        if (this.checkLine(board[r][c], board[r + 1][c], board[r + 2][c], board[r + 3][c])) {
          return board[r][c];
        }
      }
    }

    // Check right
    for (var r = 0; r < 6; r++) {
      for (var c = 0; c < 4; c++) {
        if (this.checkLine(board[r][c], board[r][c + 1], board[r][c + 2], board[r][c + 3])) {
          return board[r][c];
        }
      }
    }

    // Check down-right
    for (var r = 0; r < 3; r++) {
      for (var c = 0; c < 4; c++) {
        if (this.checkLine(board[r][c], board[r + 1][c + 1], board[r + 2][c + 2], board[r + 3][c + 3])) {
          return board[r][c];
        }
      }
    }

    // Check down-left
    for (var r = 3; r < 6; r++) {
      for (var c = 0; c < 4; c++) {
        if (this.checkLine(board[r][c], board[r - 1][c + 1], board[r - 2][c + 2], board[r - 3][c + 3])) {
          return board[r][c];
        }
      }
    }

    // Check if board is full (stalemate), otherwise game not over
    const full = board[0].filter((x) => x === 0).length === 0;
    return full ? 3 : 0;
  },

  isValidMove: function (board, col) {
    return col < board[0].length && board[0][col] === 0;
  },

  applyMove: function (board, col, player) {
    const newBoard = JSON.parse(JSON.stringify(board));
    if (!this.isValidMove(newBoard, col)) {
      return null;
    }

    for (var i = newBoard.length - 1; i >= 0; i--) {
      if (newBoard[i][col] === 0) {
        newBoard[i][col] = player;
        break;
      }
    }

    return newBoard;
  },

  getValidMoves(board) {
    var validMoves = [];
    for (var i = 0; i < board[0].length; i++) {
      if (board[0][i] === 0) {
        validMoves.push(i);
      }
    }
    return validMoves;
  }
}

onmessage = function (e) {
  switch (e.data.command) {
    case 'code':
      eval('sandbox.getMove = ' + e.data.value + ';');
      break;
    case 'getMove':
      var move = sandbox.getMove(e.data.value);
      postMessage(move);
  }
}
