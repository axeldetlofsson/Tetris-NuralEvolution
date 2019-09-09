const edge = 20;
let players = [];
let savedPlayers = [];
let slider;
let slider2;
let value = 0;
let randnb = 0.1;
let playerCount = 50;
let colors = ['blue', 'pink', 'yellow', 'orange', 'red', 'green', 'purple'];

function keyPressed() {
  if (value === 0) {
    playerCount = 1;
    let randnb = 0;
    value = 1;
  } else {
    playerCount = 50;
    let randnb = Math.random();
    value = 0;
  }
}

function setup() {
  createCanvas(240, 400);
  slider = createSlider(0, 1000, 0);
  //slider2 = createSlider(0, 100, 50);
  for (var i = 0; i < playerCount; i++) {
    let player = new Player();
    player.reset();
    players.push(player);
  }
  //console.log(players.length);
}

function draw() {
  background(0);
  if (players.length == 0) {
    players = populate(savedPlayers);
    savedPlayers = [];
    //console.log(players);
  }
  for (var i = 0; i < players.length; i++) {
    let player = players[i];
    drawMatrix(player.arena, [0, 0]);
    drawMatrix(player.matrix, [player.x, player.y]);
    movePlayer(choise(cleanData(ReturnMergeMatrices(player.arena, player)), player.brain), player.arena, player);
    if ((millis() - player.time) > slider.value()) {
      player.drop(players, i);
      player.fitness++;
      //console.log(player.fitness);
    }
    // if (keyIsDown(DOWN_ARROW)) {
    //   player.drop();
    // }
  }
}

function movePlayer(movearr, arena, player) {
  //let move = movearr;
  let move = indexOfMax(movearr);
  if (move == 0) {
    player.x--;
    if (player.collide()) { // recovery
      player.x++;
    }
  } else if (move == 1) {} else if (move == 2) {
    player.x++;
    if (player.collide()) { // recovery
      player.x--;
    }
  } else if (move == 3) {
    player.rotate();
    if (player.collide()) { // recovery
      player.rotate();
      player.rotate();
      player.rotate();
    }
  }
  // if (move[0] < 0.25) {
  //   player.x--;
  //   if (player.collide()) { // recovery
  //     player.x++;
  //   }
  // } else if (move[0] < 0.5) {} else if (move[0] < 0.75) {
  //   player.x++;
  //   if (collide(arena, player)) { // recovery
  //     player.x--;
  //   }
  // } else {
  //   player.rotate();
  //   if (collide(arena, player)) { // recovery
  //     player.rotate();
  //     player.rotate();
  //     player.rotate();
  //   }
  // }
}

function indexOfMax(arr) {
  if (arr.length === 0) {
    return -1;
  }
  var max = arr[0];
  var maxIndex = 0;
  for (var i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      maxIndex = i;
      max = arr[i];
    }
  }
  return maxIndex;
}

function drawMatrix(matrix, offset) {
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      if (matrix[y][x] != 0) {
        noStroke();
        fill(colors[matrix[y][x] - 1]);
        rect((x + offset[0]) * edge, (y + offset[1]) * edge, edge, edge);
      }
    }
  }
}

function cleanData(matrix) {
  for (let y = 0; y < matrix.rows; y++) {
    for (let x = 0; x < matrix.cols; x++) {
      if (matrix.matrix[y][x] != 0) {
        matrix.matrix[y][x] = 1;
      }
    }
  }
  return matrix;
}

function mergeMatrices(arena, player) {
  for (let y = 0; y < player.matrix.length; y++) {
    for (let x = 0; x < player.matrix[y].length; x++) {
      if (player.matrix[y][x] != 0) {
        arena[y + player.y][x + player.x] = player.matrix[y][x];
      }
    }
  }
}

function ReturnMergeMatrices(arena, player) {
  let rArena = new Matrix(height / edge, width / edge);
  for (let y = 0; y < player.matrix.length; y++) {
    for (let x = 0; x < player.matrix[y].length; x++) {
      if (player.matrix[y][x] != 0) {
        rArena.matrix[y + player.y][x + player.x] = player.matrix[y][x];
      }
    }
  }
  return rArena;
}

function collide(arena, player) {
  for (let y = 0; y < player.matrix.length; y++) {
    for (let x = 0; x < player.matrix[0].length; x++) {
      if (player.matrix[y][x] != 0 && (arena[y + player.y] && arena[y + player.y][x + player.x]) != 0) {
        return true;
      }
    }
  }
  return false;
}

function arenaSweep(arena, player) {
  let rowCount = 1;
  player.lowestHeight = 20;
  player.height = 0;
  //  console.log(arena.length);
  for (let y = 0; y < arena.length; y++) {
    let full = 1;
    for (let x = 0; x < arena[y].length; x++) {
      //console.log("X length: " + arena[y].length);
      if (arena[y][x] == 0) {
        full = 0;
        break;
      } else {
        // player.height = y;
        // if (player.height < player.lowestHeight) {
        //   player.lowestHeight = player.height;
        // }
      }
    }
    //  player.fitness += player.pieces / (player.lowestHeight + 1);
    if (full == 1) {
      arena.splice(y, 1);
      arena.unshift(new Array(width / edge).fill(0));
      player.score += 10 * rowCount;
      console.log(Player.score);
      player.fitness += 100;
      rowCount *= 2;
    }
  }
  //console.log("Best row count: " + tempFitness);
}

function choise(gamePlan, brain) {
  //  console.table(gamePlan.matrix);
  let outputs = brain.feedforward(gamePlan);
  //console.log(outputs);
  return outputs;
}

function createPiece(type) {
  switch (type) {
    case 0:
      return [
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0],
      ];
    case 1:
      return [
        [2, 2],
        [2, 2],
      ];
    case 2:
      return [
        [0, 3, 0],
        [0, 3, 0],
        [0, 3, 3],
      ];
    case 3:
      return [
        [0, 4, 0],
        [0, 4, 0],
        [4, 4, 0],
      ];
    case 4:
      return [
        [0, 5, 0, 0],
        [0, 5, 0, 0],
        [0, 5, 0, 0],
        [0, 5, 0, 0],
      ];
    case 5:
      return [
        [0, 6, 6],
        [6, 6, 0],
        [0, 0, 0],
      ];
    case 6:
      return [
        [7, 7, 0],
        [0, 7, 7],
        [0, 0, 0],
      ];
  }
}

function Player() {
  this.x = 0;
  this.y = 0
  this.fitness = 1;
  this.rowCount = 1;
  this.lowestHeight = 20;
  this.pieces = 0;
  this.height = 0;
  this.time = millis();
  this.arena = [];
  this.arena = new Array(height / edge);
  this.brain = new NeuralNetwork(240, 480, 4)
  for (let i = 0; i < this.arena.length; i++) {
    this.arena[i] = new Array(width / edge).fill(0);
  }
  //  console.log(this.arena);
  this.matrix = null;
  this.score = 0;
  this.reset = function(players, index) {
    this.x = (width / edge) / 2 - 1;
    this.y = 0;
    this.matrix = createPiece(1);
    //  this.matrix = createPiece(Math.floor(Math.random() * 7));
    if (collide(this.arena, this)) {
      for (let i = 0; i < this.arena.length; i++) {
        this.arena[i].fill(0);
      }
      //this.fitness += this.rowCount;
      savedPlayers.push(this);
      //console.log(savedPlayers);
      players.splice(index, 1);
    }
    this.updateScore();
  }
  this.collide = function() {
    return collide(this.arena, this);
  }
  this.drop = function(players, i) {
    this.y++;
    if (collide(this.arena, this)) {
      this.y--; // recovery
      this.pieces++;
      mergeMatrices(this.arena, this);
      arenaSweep(this.arena, this);
      this.reset(players, i);
    }
    this.time = millis();
  }
  this.rotate = function() {
    this.matrix.reverse();
    for (let y = 0; y < this.matrix.length; y++) {
      for (let x = y + 1; x < this.matrix[y].length; x++) {
        [this.matrix[y][x], this.matrix[x][y]] = [this.matrix[x][y], this.matrix[y][x]];
      }
    }
  }
  this.updateScore = function() {
    document.getElementById("score").innerText = this.score;
  }
}

function populate(pPlayers) {
  let bbplayer;
  var bestSore = 0;
  var bPlayer;
  var sum = 0;
  let rplayers = [];
  var bPlayers = [];
  for (var i = 0; i < pPlayers.length; i++) {
    sum += pPlayers[i].fitness;
  }
  while (rplayers.length < pPlayers.length) {
    //console.log("Mating: ");
    let mateOne = pickOne(pPlayers, sum);
    //console.log("Mate One Score: " + mateOne.fitness);
    let mateTwo = pickOne(pPlayers, sum);
    //console.log("Mate Two Score: " + mateTwo.fitness);
    mateOne.brain.MateWith(mateTwo.brain);
    let nplayer = new Player();
    nplayer.reset();
    nplayer.brain = mateOne.brain.copy();
    nplayer.brain.mutate(Math.random());
    rplayers.push(nplayer);
  }
  console.log("Median score: " + sum / rplayers.length);
  // for (var i = 0; i < playerCount; i++) {
  //   let nPlayer = new Player()
  //   nPlayer.reset();
  //   nPlayer.brain = bbplayer.brain.copy();
  //   nPlayer.brain.mutate(randnb);
  //   rplayers.push(nPlayer);
  // }
  return rplayers;
}

function pickOne(pPlayers, sum) {
  let fitnessTotal = 0;
  let random = Math.floor(Math.random() * sum);
  for (i = 0; i < pPlayers.length; i++) {
    fitnessTotal += pPlayers[i].fitness;
    if (random < fitnessTotal) {
      return (pPlayers[i]);
    }
  }
}

function pickbest(pPlayers) {
  var bestSore = 0;
  var bPlayer;
  var sum = 0;
  var bPlayers = [];
  for (var i = 0; i < pPlayers.length; i++) {
    if (pPlayers[i].fitness >= bestSore) {
      bestSore = pPlayers[i].fitness;
      sum += pPlayers[i].fitness;
      bPlayers.push(pPlayers[i]);
      bPlayer = pPlayers[i];
    }
  }
  console.log("Median score: " + Math.round(sum));
  console.log("Best: " + bPlayers[(bPlayers.length - 1)].fitness);
  console.log("Worst: " + bPlayers[0].fitness);
  return bPlayers[(bPlayers.length - 1)];
}