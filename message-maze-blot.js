/*
@title: Message Maze
@author: Iambodha
@snapshot: snapshot1.png
*/

const mazeData = [
  [[1, 0, 0, 1], [1, 1, 0, 0], [0, 0, 1, 1], [1, 1, 0, 0], [0, 1, 0, 1], [1, 0, 0, 1], [1, 0, 1, 0], [1, 0, 1, 0], [1, 0, 1, 0], [1, 1, 1, 0], [0, 1, 0, 1], [0, 1, 1, 1], [1, 0, 0, 1], [0, 1, 1, 0], [0, 0, 1, 1], [1, 1, 0, 0], [0, 1, 0, 1], [0, 1, 0, 1], [0, 1, 1, 1], [0, 0, 1, 1], [1, 0, 1, 0], [1, 1, 0, 0], [1, 1, 0, 1], [0, 0, 1, 1], [1, 1, 1, 0], [0, 1, 0, 1], [0, 1, 0, 1], [1, 1, 0, 1], [0, 0, 1, 1], [1, 1, 0, 0], [1, 0, 1, 1], [0, 1, 1, 0], [0, 1, 1, 1], [0, 0, 1, 1], [1, 1, 0, 0], [1, 0, 0, 1], [1, 1, 0, 0], [1, 0, 0, 1], [0, 1, 1, 0], [0, 1, 0, 1], [0, 1, 0, 1], [1, 0, 1, 1], [1, 0, 1, 0], [1, 0, 0, 0], [1, 0, 1, 0], [0, 1, 0, 0], [0, 0, 1, 1], [1, 0, 1, 0], [1, 0, 0, 0], [1, 0, 1, 0], [1, 1, 1, 0], [1, 0, 0, 1], [1, 1, 0, 0], [0, 0, 1, 1], [1, 1, 0, 0], [0, 1, 0, 1], [1, 0, 0, 1], [1, 1, 0, 0], [0, 1, 0, 1], [0, 1, 0, 1], [0, 0, 1, 1], [1, 1, 0, 0]],
  [[0, 1, 1, 0], [0, 0, 1, 1], [1, 0, 1, 0], [0, 0, 1, 0], [0, 1, 1, 0], [0, 0, 1, 1], [1, 0, 1, 0], [1, 0, 1, 0], [1, 0, 1, 0], [1, 0, 1, 0], [0, 0, 1, 0], [1, 1, 1, 0], [0, 0, 1, 1], [1, 1, 1, 0], [1, 0, 1, 1], [0, 1, 1, 0], [0, 1, 1, 1], [0, 0, 1, 1], [1, 0, 1, 0], [1, 0, 1, 0], [1, 0, 1, 0], [0, 1, 1, 0], [0, 0, 1, 1], [1, 0, 1, 0], [1, 0, 1, 0], [0, 1, 1, 0], [0, 0, 1, 1], [0, 0, 1, 0], [1, 1, 1, 0], [0, 0, 1, 1], [1, 0, 1, 0], [1, 0, 1, 0], [1, 0, 1, 0], [1, 1, 1, 0], [0, 1, 1, 1], [0, 1, 1, 1], [0, 0, 1, 1], [0, 1, 1, 0], [1, 0, 1, 1], [0, 1, 1, 0], [0, 0, 1, 1], [1, 0, 1, 0], [1, 0, 1, 0], [0, 1, 1, 0], [1, 0, 1, 1], [0, 0, 1, 0], [1, 0, 1, 0], [1, 1, 1, 0], [0, 0, 1, 1], [1, 0, 1, 0], [1, 0, 1, 0], [0, 1, 1, 0], [0, 0, 1, 1], [1, 0, 1, 0], [0, 1, 1, 0], [0, 0, 1, 1], [0, 1, 1, 0], [0, 0, 1, 1], [0, 1, 1, 0], [0, 0, 1, 1], [1, 0, 1, 0], [0, 1, 1, 0]]
];

const rows = mazeData.length;
const cols = mazeData[0].length;
const cellSize = 5;
const border = cellSize * 5;
const width = cols * cellSize + 2*border;
const height = rows * cellSize + 2*border;

setDocDimensions(width, height);

const grid = [];
for (let i = 0; i < rows; i++) {
  grid[i] = [];
  for (let j = 0; j < cols; j++) {
    grid[i][j] = {
      x: j,
      y: i,
      walls: mazeData[i][j]
    };
  }
}

const t = new bt.Turtle()

function tJumpTo(cellx , celly, corner) {
  if (corner == "tl") {
    t.goTo([border + cellx * cellSize, height - (border + celly * cellSize)]);
  }
  else if (corner == "tr") {
    t.goTo([border + (cellx + 1) * cellSize, height - (border + celly * cellSize)]);
  }
  else if (corner == "bl") {
    t.goTo([border + cellx * cellSize, height - (border + celly * cellSize + cellSize)]);
  }
  else if (corner == "br") {
    t.goTo([border + (cellx + 1) * cellSize, height - (border + celly * cellSize + cellSize)]);
  }
}

function drawMaze() {
  t.setAngle(0);
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const cell = grid[i][j];
      if (cell.walls[2]) {
        t.up();
        tJumpTo(j,i,"bl");
        t.down();
        t.forward(cellSize);
      }
    }
  }
  
  t.setAngle(-90);
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const cell = grid[i][j];
      if (cell.walls[1]) {
        t.up();
        tJumpTo(j,i,"tr");
        t.down();
        t.forward(cellSize);
      }
    }
  }
  
  const Maze = t.lines();
  drawLines(Maze);
}

drawMaze();
