const { test } = require('node:test');
const assert = require('node:assert/strict');
const { Maze, formatInput, generateMazeWithTextSolution, generateMazeListFromString, importPattern } = require('../V2/index.js');
const { loadPattern, toSVG } = require('../scripts/export-svg.js');

test('word wrapping preserves every character and separator', () => {
  for (const message of ['HELLO WORLD', 'HI ABCDEFGHIJKLMN OK', 'ABCDEFGHIJKLMN OP', 'ONE TWO THREE FOUR FIVE']) {
    const lines = formatInput(message);
    const actual = lines.flat().filter(c => c !== 'sep' && c !== 'space').join('');
    assert.equal(actual, message.replaceAll(' ', ''));
    assert.ok(lines.every(line => line.length > 0));
  }
});

test('all bundled patterns load', async () => {
  for (const char of [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ','sep','space']) {
    const maze = await loadPattern(char);
    assert.ok(maze instanceof Maze);
    assert.ok(maze.cols > 0 && maze.rows > 0);
  }
});

test('generated maze has reciprocal walls, connected cells, and an open solution', async () => {
  for (const text of ['A', 'HELLO WORLD', 'HI ABCDEFGHIJKLMN OK']) {
    const maze = await generateMazeWithTextSolution(text, loadPattern);
    const grid=maze.exportMaze();
    const steps=[[0,-1,0,2],[1,0,1,3],[0,1,2,0],[-1,0,3,1]];
    for (let y=0;y<maze.rows;y++) for (let x=0;x<maze.cols;x++) for (const [dx,dy,wall,opposite] of steps) {
      if (grid[y+dy]?.[x+dx]) assert.equal(grid[y][x][wall], grid[y+dy][x+dx][opposite]);
    }
    const seen=new Set(), queue=[[maze.start.i,maze.start.j]];
    while (queue.length) {
      const [x,y]=queue.pop(), key=`${x},${y}`;
      if (seen.has(key)) continue;
      seen.add(key);
      for (const [dx,dy,wall] of steps) if (!grid[y][x][wall] && grid[y+dy]?.[x+dx]) queue.push([x+dx,y+dy]);
    }
    assert.equal(seen.size, maze.rows*maze.cols, text);
    for (let i=1;i<maze.solutionCells.length;i++) {
      const a=maze.solutionCells[i-1], b=maze.solutionCells[i];
      const step=steps.find(([dx,dy]) => a.i+dx===b.i && a.j+dy===b.j);
      assert.ok(step, `Solution discontinuity in ${text}`);
      assert.equal(Boolean(grid[a.j][a.i][step[2]]), false);
    }
    assert.match(toSVG(grid), /^<svg/);
  }
});

test('empty or overlong input fails before loading assets', async () => {
  for (const input of ['', '123!!', 'A'.repeat(31)]) await assert.rejects(generateMazeListFromString(input, loadPattern));
  const grid=await generateMazeListFromString('hello! world', loadPattern);
  assert.ok(grid.length);
});

test('asset HTTP failures retain the useful error', async () => {
  const previous=global.fetch;
  global.fetch=async () => ({ok:false,status:404});
  try { await assert.rejects(importPattern('A'), /pattern A: HTTP 404/); }
  finally { global.fetch=previous; }
});
