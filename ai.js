function getMove(state) {
  var self = this;
  var toDepth = 3;

  var moveScores = [];
  for (var i = 0; i < state[0].length; i++) {
    moveScores.push(scoreMove(state, i, toDepth, 1));
  }
  return moveScores.indexOf(Math.max(...moveScores));

  function scoreMove(s, move, depth, player) {
    if (depth === 0) {
      return 0;
    }

    if (!self.isValidMove(s, move)) {
      return null;  // this should effectively prune this branch
    }

    var newState = self.applyMove(s, move, player);
    var result = self.checkWin(newState);
    switch (result) {
      case 0:
        var childScores = [];
        for (var i = 0; i < s[0].length; i++) {
          childScores.push(scoreMove(newState, i, depth - 1, player === 1 ? 2 : 1));
        }
        if (player === 1) {
          return Math.max(...childScores);
        } else {
          return Math.min(...childScores);
        }
      case 1:
        return 10;
      case 2:
        return -10;
    }
  }
}
