class Ray {
  // takes objects in format {row:Y, col:X}
  constructor(origin, destination, range) {
    this.cells = [];
    // console.log("Range: " + range)
    let modifier = 1;
    const y1 = origin.row;
    const x1 = origin.col;
    const y2 = destination.row;
    const x2 = destination.col;

    const height = Math.abs(y1 - y2);
    const width = Math.abs(x1 - x2);
    let m = (y2 - y1) / (x2 - x1);

    /* For a ray that is longest horizontally, ray(x) gives the row at x columns from the origin
    in the direction of the target */

    const sightRadius = range;
    let output = [];

    if (width >= height) {
      const ray = (x) => (m * x + y1);
      if (x1 - x2 < 0) {
        // Sweeps to right if destination is right of origin
        // console.log("Sweeping to right")
        for (let i = 0; i <= sightRadius; i++) {
          output.push({
            col: x1 + i,
            row: Math.ceil(ray(i)),
          });
        }
        return output;
      } else if (x1 - x2 > 0) {
        // Sweeps to left if destination is left of origin
        // console.log("Sweeping to left")
        for (let i = 0; i >= 0 - sightRadius; i--) {
          output.push({
            col: x1 + i,
            row: Math.ceil(ray(i)),
          });
        }
        return output;
      }
    } else {
      m = (x2 - x1) / (y2 - y1);
      const ray = (y) => (m * y + x1);
      if (y1 - y2 < 0) {
        // Sweeps to down if destination is below (more positive than) origin
        // console.log("Sweeping to down")
        for (let i = 0; i <= sightRadius; i++) {
          output.push({
            col: Math.ceil(ray(i)),
            row: y1 + i,
          });
        }
        return output;
      } else if (y1 - y2 > 0) {
        // Sweeps to up if destination is above (less positive than) origin
        // console.log("Sweeping to up")
        for (let i = 0; i >= 0 - sightRadius; i--) {
          output.push({
            col: Math.ceil(ray(i)),
            row: y1 + i,
          });
        }
        return output;
      }
    }
  }

}

export default Ray;

