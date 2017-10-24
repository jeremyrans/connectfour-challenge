function getMove(state) {
  var self = this;
  var toDepth = 3;

  // var moveScores = [];
  // for (var i = 0; i < state[0].length; i++) {
  //   if (!self.isValidMove(state, i)) {
  //     moveScores.push(-100);
  // moveScores.push(minMax(self.applyMove(state, i, 1), toDepth, 1));
  //     continue;
  //   }
  // }
  return minMax(state, toDepth, 1)[1];

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
    var bestMove;
    for (var j = 0; j < s[0].length; j++) {
      if (!self.isValidMove(s, j)) {
        continue;
      }
      var candidate = -minMax(self.applyMove(s, j, 2), depth - 1, player === 1 ? 2 : 1)[0];
      if (candidate > bestValue) {
        bestValue = candidate;
        bestMove = j;
      }
    }

    return [bestValue, bestMove];
  }
}



/*
function getMove(state) {
    debugger;
  var self = this;
  var toDepth = 4;

  var moveScores = [];
  for (var i = 0; i < state[0].length; i++) {
    moveScores.push(minMax(state, i, toDepth, 1));
  }
  return moveScores.indexOf(Math.max(...moveScores));

  testState = [
    [2,2,1,0,0,0,0],
    [1,1,2,0,0,0,0],
    [2,2,1,0,0,0,0],
    [1,1,2,0,0,0,0],
    [2,2,1,2,0,0,0],
    [1,1,1,2,0,0,0]
    ];

  function minMax(s, move, depth, player) {
    if (!self.isValidMove(s, move)) {
      return null;  // this should effectively prune this branch
    }
    var newState = self.applyMove(s, move, player);
    var result = self.checkWin(newState);
    switch (result) {
      case 1: {
        return 10;
      }
      case 2: {
        return -10;
      }
    }
    if (depth === 0) {
      return 0;
    }

    var childScores = [];
    for (var i = 0; i < s[0].length; i++) {
      childScores.push(minMax(newState, i, depth - 1, player === 1 ? 2 : 1));
      console.log("D:" + depth + " S:" + childScores[i] + " P:" + player);
    }

    if (player === 1) {
      return Math.max(...childScores);
    } else {
      return Math.min(...childScores);
    }
  }
}*/
