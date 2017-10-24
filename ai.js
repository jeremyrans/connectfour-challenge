function getMove(state) {
  var self = this;

  function scoreMove(s, move, depth, player) {
    if (depth === 0) {
      return 0;
    }

    if (!self.isValidMove(s, move)) {
      return -Number.MAX_VALUE;
    }

    var newState = self.applyMove(s, move, player);
    var result = self.checkWin(newState);
    switch (result) {
      case 0:
        return scoreMove(newState, move, depth - 1, player === 0 ? 1 : 2);
      case 1:
        return 1000;
      case 2:
        return -1000;
    }
  }

  var moveScores = [];
  for (var i = 0; i < state[0].length; i++) {
    moveScores.push(scoreMove(state, i, 1, 1));
  }

  return moveScores.indexOf(Math.max(...moveScores));
}
