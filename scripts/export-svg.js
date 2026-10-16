#!/usr/bin/env node
// Reuse the actual Blot algorithm with local letter assets. No server needed.
const fs = require('node:fs/promises');
const path = require('node:path');
const { Maze, generateMazeFromString } = require('../V2/index.js');

async function loadPattern(character) {
  if (!/^(?:[A-Z]|sep|space)$/.test(character)) throw new Error('Unsupported pattern');
  const asset = path.join(__dirname, '../V2/assets/patterns', character + '.json');
  return Maze.fromJSON(JSON.parse(await fs.readFile(asset, 'utf8')));
}

function toSVG(grid, start = { i: 0, j: 0 }, end = { i: grid[0].length-1, j: grid.length-1 }) {
  const rows = grid.length, cols = grid[0].length;
  const size = 5, margin = 10;
  const paths = [];
  const line = (x1, y1, x2, y2) => paths.push(`M${margin+x1*size} ${margin+y1*size}L${margin+x2*size} ${margin+y2*size}`);
  for (let y=0; y<rows; y++) for (let x=0; x<cols; x++) {
    const [top, right, bottom, left] = grid[y][x];
    if (top && !(y === start.j && x === start.i)) line(x,y,x+1,y);
    if (right) line(x+1,y,x+1,y+1);
    if (y === rows-1 && bottom && !(y === end.j && x === end.i)) line(x,y+1,x+1,y+1);
    if (x === 0 && left) line(x,y,x,y+1);
  }
  const width=cols*size+2*margin, height=rows*size+2*margin;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}mm" height="${height}mm" role="img" aria-labelledby="title"><title id="title">Message Maze — follow the hidden message from top left to bottom right or left</title><rect width="100%" height="100%" fill="white"/><path d="${paths.join('')}" fill="none" stroke="black" stroke-width="0.4" stroke-linecap="square"/></svg>\n`;
}

async function main() {
  const [message, output] = process.argv.slice(2);
  if (!message || !output || process.argv.length !== 4) {
    throw new Error('Usage: node scripts/export-svg.js "HELLO WORLD" maze.svg');
  }
  const maze = await generateMazeFromString(message, loadPattern);
  const grid = maze.exportMaze();
  // wx avoids silently overwriting an existing drawing.
  await fs.writeFile(output, toSVG(grid, maze.start, maze.end), { flag: 'wx' });
  console.log(`Saved ${output}: ${grid[0].length} × ${grid.length} cells`);
}
if (require.main === module) main().catch(error => { console.error(error.message); process.exitCode=1; });
module.exports = { loadPattern, toSVG };
