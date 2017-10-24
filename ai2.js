function getMove(state) {
  var self = this;
  var toDepth = 4;

  var myState = [];
  for (var i = 0; i < state.length; i++) {
    myState.push([]);
    for (var j = 0; j < state[0].length; j++) {
      if (state[i][j] === 0) {
        myState[i].push(0);
      }
      else {
        myState[i].push(state[i][j] === 1 ? 2 : 1)
      }
    }
  }

  var moveScores = [];
  for (var i = 0; i < myState[0].length; i++) {
    if (!self.isValidMove(myState, i)) {
      moveScores.push(-100);
      continue;
    }
    moveScores.push(minMax(self.applyMove(myState, i, 1), toDepth, 1));
  }
  return moveScores.indexOf(Math.max(...moveScores));

  function minMax(s, depth, player) {
    var result = self.checkWin(s);
    switch (result) {
      case 1: {
        return depth;
      }
      case 2: {
        return -depth;
      }
    }
    if (depth === 0) {
      return 0;
    }

    var bestValue;
    var bestMove;

    if (player === 1) {
      bestValue = Number.MAX_VALUE;
      for (var j = 0; j < s[0].length; j++) {
        if (!self.isValidMove(s, j)) {
          continue;
        }
        var candidate = minMax(self.applyMove(s, j, 2), depth - 1, 2);
        if (candidate < bestValue) {
          bestValue = candidate;
          bestMove = j;
        }
      }
    } else {
      bestValue = -Number.MAX_VALUE;
      for (var j = 0; j < s[0].length; j++) {
        if (!self.isValidMove(s, j)) {
          continue;
        }
        var candidate = minMax(self.applyMove(s, j, 1), depth - 1, 1);
        if (candidate > bestValue) {
          bestValue = candidate;
          bestMove = j;
        }
      }
    }

    return bestValue;
  }
}
