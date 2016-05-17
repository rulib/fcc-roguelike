class Perimeter {
  constructor(origin, radius) {
    let perim = [];
    const rad = radius;
    const o = origin;
    const left = o.col - rad;
    const right = o.col + rad;
    const top = o.row - rad;
    const bottom = o.row + rad;
    for (let i = left; i <= right; i++) {
      perim.push({
        row: top,
        col: i,
      });
      perim.push({
        row: bottom,
        col: i,
      });
    }
    for (let i = top + 1; i <= bottom - 1; i++) {
      perim.push({
        row: i,
        col: left,
      });
      perim.push({
        row: i,
        col: right,
      });
    }
    return perim;
  }

}

export default Perimeter;
