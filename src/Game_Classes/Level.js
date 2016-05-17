import d from './d';
import Ray from './Ray';
import Perimeter from './Perimeter';
import { Floor as Floor, Wall as Wall, Sand as Sand, Tile as Tile } from './Tiles';
import Menu from './Menu';
import { Mob as Mob, Player as Player, Cat as Cat, Dog as Dog } from './Mobs';
import Item from './Item';


class Level {
  constructor(player) {
    this.rooms = [];
    this.map = this.initializeMap();
    this.hollowRectangle({ row: 1, col: 1 }, 16, 78);
    this.carveRooms();
    this.player = player;
    this.monst = [];
    this.msgArr = [];
  }

  tick() {
    for (let i = 0; i < this.monst.length; i++) {
      if (this.monst[i].constructor.name === 'Player') {
        console.log('The player has no AI');
      } else {
        console.log(`Running AI for ${this.monst[i].stats.name}`);
        this.monst[i].mobAI();
      }
    }
    this.msgArr = [];
  }

  handleDeath() {
    this.player = new Player('Hank');
    this.monst = [];
    this.map = this.initializeMap();
    this.spawnPlayer(15, 78);
    this.spawnCat(12, 55);
    this.spawnCat(15, 76);
  }

  updateMessage(msg) {
    if (msg) {
      let arr = this.msgArr;
      arr = arr.push(msg);
      console.log(this.msgArr);
      arr = this.msgArr;
      const combo = arr.join(' ');
      this.msgArr = arr;
      this.message = combo;
    } else {
      this.message = '';
      this.msgArr = [];
    }
  }

  spawnPlayer(row, col) {
    this.player.location = {
      row,
      col,
      arr: this.map,
      level: this,
    };
    this.map[row][col].mobs.push(this.player);
    this.player.see();
  }

  //  Cleans up monster array on monster death
  despawn(id) {
    const deadOne = (item) => item.id === id;
    const index = this.monst.findIndex(deadOne);
    this.monst.splice(index, 1);
  }

  print(input, args) {
    //  args is an optional object of arguments required for displaying menus
    //  console.log(`Printing with input ${input} and arguments ${args}`)
    //  console.log(args);
    let context = 'undefined';
    let output = [];
    if (input === 'map') {
      const map = this.map;
        //  only needs to update after every turn is completely done
      let msgRow = [];
      let msgTxt = '';
      if (this.message) {
        msgTxt = this.message;
      } else {
        msgTxt = '                                 Dungeon Level 1';
      }
      for (let i = 0; i < 80; i++) {
        if (i < msgTxt.length) {
          msgRow.push({
            symbol: msgTxt[i],
            status: 'seen',
            color: 'white',
          });
        } else {
          msgRow.push({
            symbol: ' ',
            status: 'seen',
            color: 'white',
          });
        }
      }
      output.push(msgRow);
      for (let i = 0; i < map.length; i++) {
        let row = [];
        for (let j = 0; j < map[i].length; j++) {
          const tile = map[i][j];
          const mob = tile.mobs[0] ? tile.mobs[0].stats : {};
          const item = tile.items[0] ? tile.items[0].stats : {};
    /*      if (map[i][j].explored === 0) {
            row.push({
              symbol: ' ',
              status: 'unexplored',
            });
          } else if (tile.explored === 1 && tile.visible === 1) {*/
            // line 125 needs to go for production
          if (tile.explored === 0 || tile.visible === 0 || tile.visible === 1
            || tile.explored === 1) {
            if (tile.mobs[0]) {
              row.push({
                symbol: mob.symbol,
                status: 'seen',
                color: mob.color,
              });
            } else if (map[i][j].items[0]) {
              row.push({
                symbol: item.symbol,
                status: 'seen',
              });
            } else {
              row.push({
                symbol: tile.symbol,
                status: 'seen',
                color: tile.color,
              });
            }
          } else {
            if (tile.memory.mobs[0]) {
              row.push({
                symbol: tile.memory.mobs[0].stats.symbol,
                status: 'notSeen',
                color: tile.memory.mobs[0].stats.color,
              });
            } else if (tile.memory.items[0]) {
              row.push({
                symbol: tile.memory.items[0].stats.symbol,
                status: 'notSeen',
              });
            } else {
              row.push({
                symbol: tile.symbol,
                status: 'notSeen',
                color: tile.color,
              });
            }
          }
        }
        output.push(row);
      }
      let statRow = [];
      const p = this.player;
      const statText =
      `Level: ${p.stats.level}
      XP: ${p.stats.xp}/${p.stats.xpToLvlUp}
      HP: ${p.stats.hp}/${p.stats.maxHp}
      Atk: ${p.stats.equipped.weapon.stats.dice}d${p.stats.equipped.weapon.stats.dieType}`;

      // need to allow for multilining here
      for (let i = 0; i < 80; i++) {
        if (i < statText.length) {
          statRow.push({
            symbol: statText[i],
            status: 'seen',
            color: 'white',
          });
        } else {
          statRow.push({
            symbol: ' ',
            status: 'seen',
            color: 'white',
          });
        }
      }
      output.push(statRow);
      context = 'map';
    } else if (input === 'openMenu') {
      //  console.log(`Opening a new menu with arguments ${args}`)
      this.menu = new Menu(args);
      output = this.menu.screen;
      context = 'menu';
    } else if (input === 'menu') {
      output = this.menu.screen;
    }
    return {
      map: output,
      stats: this.player.stats,
      context,
    };
  }

  initializeMap() {
    let map = [];
    for (let i = 0; i < 18; i++) {
      let row = [];
      for (let j = 0; j < 80; j++) {
        if (i === 0 || i === 17) {
          row.push(new Wall(i, j));
        } else if (j === 0 || j === 79) {
          row.push(new Wall(i, j));
        } else if (i === 15 && j <= 78 && j >= 74) {
          row.push(new Floor(i, j));
        } else {
          const tile =
          Math.round(Math.random()) + Math.round(Math.random()) === 2
            ? new Wall(i, j)
            : new Floor(i, j);
          row.push(tile);
        }
      }
      map.push(row);
    }
    return map;
  }

  // Carves out a rectangle from the map with top left corner at topLeft
  hollowRectangle(topLeft, height, width) {
    const top = topLeft.row;
    const bottom = topLeft.row + height;
    const left = topLeft.col;
    const right = topLeft.col + width;
    let room = [];
    for (let i = top; i < bottom; i++) {
      let row = [];
      for (let j = left; j < right; j++) {
        row.push(new Floor(i, j));
      }
      room.push(row);
    }
    this.rooms.push({ topLeft, room });
  }

  carveRooms() {
    let rooms = this.rooms;
    for (let i = 0; i < rooms.length; i++) {
      return null;
    }
    return null;
  }

  spawnCat(row, col) {
    const cat = new Cat({
      row,
      col,
      arr: this.map,
      level: this,
    });
    this.map[row][col].mobs.push(cat);
    this.monst.push(cat);
  }

  spawnDog(row, col) {
    const dog = new Dog({
      row,
      col,
      arr: this.map,
      level: this,
    });
    this.map[row][col].mobs.push(dog);
    this.monst.push(dog);
  }

}

export default Level;
