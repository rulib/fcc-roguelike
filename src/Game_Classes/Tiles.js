export class Tile {
  constructor(row, col) {
    this.row = row;
    this.col = col;
    this.items = [];
    this.mobs = [];
    this.explored = 0;
    this.visible = 0;
    // this.attemptEntry = this.attemptEntry.bind(this);
    // this.leave = this.leave.bind(this);
  }

  beSeen() {
    this.visible = 1;
  }

  beUnseen() {
    this.visible = 0;
    this.memory = {
      items: this.items,
      mobs: this.mobs,
    };
  }

  becomeExplored() {
    this.explored = 1;
  }

  takeItem(item) {
    this.items.push(item);
  }

  giveItem() {
    let item = null;
    // console.log(`Tile reporting array of items length ${this.items.length}`)
    if (this.items.length > 0) {
      item = this.items[this.items.length - 1];
      this.items.pop();
    }
    return item;
  }

  attemptEntry(entrant) {
    if (this.mobs.length) {
      entrant.attack(this.mobs[0]);
    } else if (this.attributes.passable === 1) {
      const origin = entrant.location.arr[entrant.location.row][entrant.location.col];
      origin.leave(entrant);
      entrant.orient(this);
      this.mobs.push(entrant);
      if (entrant.constructor.name === 'Player') {
        entrant.see();
      }
    } else {
      entrant.bonk();
    }
  }

  leave(exant) {
    // console.log(`Attempting mob leaving list ${this.mobs}`)
    const isExant = (item) => item.id === exant.id;
    const index = this.mobs.findIndex(isExant);
    this.mobs.splice(index, 1);
    // console.log(`Checking mob leaving list ${this.mobs}`)
  }

}

export class Floor extends Tile {
  constructor(row, col) {
    super(row, col);
    Math.round(Math.random()) === 0 ? this.color = 'BurlyWood' : this.color = 'Tan';
    this.symbol = '.';
    this.attributes = {
      passable: 1,
      opaque: 0,
    };
  }
}

export class Sand extends Tile {
  constructor(row, col) {
    super(row, col);
    Math.round(Math.random()) === 0 ? this.color = 'BurlyWood' : this.color = 'Tan';
    this.symbol = '.';
    this.attributes = {
      passable: 1,
      opaque: 0,
    };
  }
}

export class Wall extends Tile {
  constructor(row, col) {
    super(row, col);
    this.symbol = '#';
    this.attributes = {
      passable: 0,
      opaque: 1,
    };
  }
}
