function getMove(state) {
  var self = this;
  var toDepth = 3;

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

  return minMax(myState, toDepth, 1)[1];

  function minMax(s, depth, player) {
    var result = self.checkWin(s);
    switch (result) {
      case 1: {
        return [10, null];
      }
      case 2: {
        return [-10, null];
      }
    }
    if (depth === 0) {
      return [0, null];
    }

    var bestValue = -Number.MAX_VALUE;
    var bestMove = null;
    for (var j = 0; j < s[0].length; j++) {
      if (!self.isValidMove(s, j)) {
        continue;
      }
      bestMove = bestMove === null ? j : bestMove;
      var candidate = -minMax(self.applyMove(s, j, 2), depth - 1, player === 1 ? 2 : 1)[0];
      if (candidate > bestValue) {
        bestValue = candidate;
        bestMove = j;
      }
    }

    return [bestValue, bestMove];
  }
}
