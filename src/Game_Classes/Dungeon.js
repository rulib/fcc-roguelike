class Dungeon {
  constructor() {
    this.openFloor = [];
    this.roomNumber = 0;
    this.minRooms = 8;
    this.maxRooms = 20;
    this.roomTimeout = 350;
  }
  /*
  Direction codes:
  1\2/3
  4-5-6
  7/8\9

  0: null directions
  */

  // generates a 1-filled array with rows and columns

  blank(rows, cols) {
    return Array(rows).fill(1).map(() => Array(cols));
  }

  // Picks a tile at random, looks for tile with single open vert/hor neighbor,
  // returns object of {row, col, dir} where dir is direction opposite single
  // open neighbor - aka the direction to build out.


  findAdj(array) {
    const ROWS = array.length;
    const COLS = array[0].length;
    const ROW = Math.floor(Math.random() * (ROWS - 2)) + 1;
    const COL = Math.floor(Math.random() * (COLS - 2)) + 1;
    let output = {
      row: ROW,
      col: COL,
      dir: 0,
    };
    const NEIGHBORS = [array[ROW - 1][COL], array[ROW][COL - 1],
                       array[ROW][COL + 1], array[ROW + 1][COL]];
    if (NEIGHBORS.reduce((a, b) => a + b) === 3) {
      const DIR = NEIGHBORS.indexOf(0);
      if (DIR === 0) {
        output.dir = 8;
      } else if (DIR === 1) {
        output.dir = 6;
      } else if (DIR === 2) {
        output.dir = 4;
      } else if (DIR === 3) {
        output.dir = 2;
      }
    }
    return output;
  }

  // Generates a rectangular room with door at input.row/input.col and room in direction input.dir
  rectRoom(input) {
    const ROW = input.row;
    const COL = input.col;
    const DIR = input.dir;
  }

  // Scans an area for viability of room based on input.origin, input.dir,
  // input.width, and input.height
  scan(input){

  }
}

export default Dungeon;
