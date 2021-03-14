var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
canvas.width = 240;
canvas.height = 400;
context.scale(20, 20);
function arenaSweep() {
  var rowCount = 1;
  outer: for (let i = (arena.length - 1); i > -1; i--) {
    var y = i;
    for (let j = 0; j < arena[y].length; j++) {
      var x = j;
      if (arena[y][x] == 0) {
        continue outer;
      }
    }
    var row = arena.splice(y, 1)[0].fill(0);
    arena.unshift(row);
    i += 1;
    player.score += (rowCount * 10);
    rowCount *= 2;
  }
}
function collide(arena, player) {
  var m = player.matrix;
  var o = player.pos;
  for (let i = 0; i < m.length; i++) {
    var y = i;
    for (let j = 0; j < m[y].length; j++) {
      var x = j;
      if (m[y][x] !== 0 && (arena[(y + o.y)] && arena[(y + o.y)][(x + o.x)]) !== 0) {
        return true;
      }
    }
  }
  return false;
}
function createMatrix(width, height) {
  var createedmatrix = [];
  while (height += -1) {
    createedmatrix.push(new Array(width).fill(0));
  }
  return createedmatrix;
}
function createPeace(type) {
  if (type.toLocaleLowerCase() == "t") {
    return [
      [
        0,
        0,
        0
      ],
      [
        1,
        1,
        1
      ],
      [
        0,
        1,
        0
      ]
    ];
  } else if (type.toLocaleLowerCase() == "o") {
    return [
      [
        2,
        2
      ],
      [
        2,
        2
      ]
    ];
  } else if (type.toLocaleLowerCase() == "l") {
    return [
      [
        0,
        3,
        0
      ],
      [
        0,
        3,
        0
      ],
      [
        0,
        3,
        3
      ]
    ];
  } else if (type.toLocaleLowerCase() == "j") {
    return [
      [
        0,
        4,
        0
      ],
      [
        0,
        4,
        0
      ],
      [
        4,
        4,
        0
      ]
    ];
  } else if (type.toLocaleLowerCase() == "i") {
    return [
      [
        0,
        5,
        0,
        0
      ],
      [
        0,
        5,
        0,
        0
      ],
      [
        0,
        5,
        0,
        0
      ],
      [
        0,
        5,
        0,
        0
      ]
    ];
  } else if (type.toLocaleLowerCase() == "s") {
    return [
      [
        0,
        6,
        6
      ],
      [
        6,
        6,
        0
      ],
      [
        0,
        0,
        0
      ]
    ];
  } else if (type.toLocaleLowerCase() == "z") {
    return [
      [
        7,
        7,
        0
      ],
      [
        0,
        7,
        7
      ],
      [
        0,
        0,
        0
      ]
    ];
  }
}
function draw() {
  context.fillStyle = "#000000";
  context.fillRect(0, 0, canvas.width, canvas.height);
  drawMatrix(arena, {
    x: 0,
    y: 0
  });
  drawMatrix(player.matrix, player.pos);
}
function playerDrop() {
  player.pos.y += 1;
  if (collide(arena, player) == true) {
    player.pos.y += -1;
    merge(arena, player);
    playerReset();
    arenaSweep();
    updateScore();
  }
  dropCounter = 0;
}
function drawMatrix(matrix, offset) {
  for (let i = 0; i < matrix.length; i++) {
    var row = matrix[i];
    var y = i;
    for (let j = 0; j < row.length; j++) {
      var value = row[j];
      var x = j;
      if (value !== 0) {
        context.fillStyle = colors[value];
        context.fillRect((x + offset.x), (y + offset.y), 1, 1);
      }
    }
  }
}
function merge(arena, player) {
  for (let i = 0; i < player.matrix.length; i++) {
    var row = player.matrix[i];
    var y = i;
    for (let j = 0; j < row.length; j++) {
      var value = row[j];
      var x = j;
      if (value !== 0) {
        arena[(y + player.pos.y)][(x + player.pos.x)] = value;
      }
    }
  }
}
function playerMove(dir) {
  player.pos.x += dir;
  if (collide(arena, player) == true) {
    player.pos.x -= dir;
  }
}
function playerReset() {
  var pieces = [
    "i",
    "l",
    "j",
    "o",
    "t",
    "s",
    "z"
  ];
  player.matrix = createPeace(pieces[Math.floor(Math.random() * pieces.length)]);
  player.pos.y = 0;
  player.pos.x = (Math.floor(arena[0].length / 2) - Math.floor(player.matrix[0].length / 2));
  if (collide(arena, player) == true) {
    for (let i = 0; i < arena.length; i++) {
      var row = arena[i];
      row.fill(0);
      player.score = 0;
      updateScore();
    }
  }
}
function playerRotate(dir) {
  var pos = player.pos.x;
  var offset = 1;
  rotate(player.matrix, dir);
  while (collide(arena, player) == true) {
    player.pos.x += offset;
    if (offset > 0) {
      offset = ((offset + 1) - ((offset + 1) + (offset + 1)));
    } else {
      offset = ((offset + -1) - ((offset + -1) + (offset + -1)));
    }
    if (offset > player.matrix[0].length) {
      rotate(player.matrix, (dir - (dir + dir)));
      player.pos.x = pos;
      return;
    }
  }
}
function rotate(matrix, dir) {
  for (let i = 0; i < matrix.length; i++) {
    var y = i;
    for (var j = 0; j < y; j++) {
      var x = j;
      var temp = matrix[x][y];
      matrix[x][y] = matrix[y][x];
      matrix[y][x] = temp;
    }
  }
  if (dir > 0) {
    for (let i = 0; i < matrix.length; i++) {
      var row = matrix[i];
      row.reverse();
    }
  } else {
    matrix.reverse();
  }
}
var lastTime = 0;
var dropCounter = 0;
var dropInterval = 1000;
function update(time) {
  if (time == undefined || time == null) {
    time = 0;
  }
  var deltaTime = (time - lastTime);
  lastTime = time;
  dropCounter += deltaTime;
  if (dropCounter > dropInterval) {
    playerDrop();
  }
  draw();
  requestAnimationFrame(update);
}
function updateScore() {
  document.getElementById("score").textContent = player.score;
}
var colors = [
  null,
  "#ff0d72",
  "#0dc2ff",
  "#0dff72",
  "#f538ff",
  "#ff8e0d",
  "#ffe138",
  "#3877ff"
];
var arena = createMatrix(12, 21);
var player = {
  pos: {
    x: 0,
    y: 0
  },
  matrix: null,
  score: 0
};
document.body.onkeydown = function (event) {
  if (event.keyCode == 38 || event.keyCode == 81) {
    playerRotate(-1);
  } else if (event.keyCode == 40) {
    playerDrop();
  } else if (event.keyCode == 37) {
    playerMove(-1);
  } else if (event.keyCode == 39) {
    playerMove(1);
  } else if (event.keyCode == 87) {
    playerRotate(1);
  }
}
playerReset();
update();
