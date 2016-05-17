import d from './d';
import Ray from './Ray';
import Perimeter from './Perimeter';
import { Floor as Floor, Wall as Wall, Sand as Sand, Tile as Tile } from './Tiles';
import Menu from './Menu';
import Item from './Item';

export class Mob {
  constructor(loc, stats) {
    this.stats = stats;
    this.id = (Math.round(Math.random() * Date.now()));
    this.location = loc;
    if (stats.inventory && stats.inventory.length > 0) {
      for (let i = 0; i < stats.inventory.length; i++) {
        if (typeof(stats.inventory[i].stats.weight) === 'number') {
          this.stats.carriedWeight += stats.inventory[i].stats.weight;
        }
      }
      this.drop = this.drop.bind(this);
    }
  }
  mobAI() {
    let playerLocation = null;
    let tiles = [];
    for (let i = 1; i <= 9; i++) {
      const t = this.fetchTile(i);
      if (t) {
        tiles.push(t);
      }
    }
    if (tiles.length) {
      for (let i = 0; i < tiles.length; i++) {
        if (tiles[i].mobs.length) {
          for (let j = 0; j < tiles[i].mobs.length; j++) {
            if (tiles[i].mobs[j].constructor.name === 'Player') {
              playerLocation = tiles[i].mobs[j];
            }
          }
        }
      }
    }
    if (playerLocation) {
      this.attack(playerLocation);
    }
  }

  typeSubtract(number, type) {
    const types = [4, 6, 8, 10, 12, 20];
    let index = types.indexOf(type);

    if (index === -1) {
      console.log('Invalid type error, defaulting to d4');
      return {
        type: 4,
        lostDice: 0,
      };
    }

    index = index - number;

    if (index < 0) {
      return {
        type: 4,
        lostDice: Math.abs(index),
      };
    }

    return {
      type: types[index],
      lostDice: 0,
    };
  }

  fetchTile(direction) {
    /*
    123
    456 (5 is origin)
    789
    */
    const row = this.location.row;
    const col = this.location.col;
    // console.log(`Mob at Row: ${row}, Col: ${col} observing tile`)
    const map = this.location.arr;
    const directions = {
      1: {
        row: -1,
        col: -1,
      },
      2: {
        row: -1,
        col: 0,
      },
      3: {
        row: -1,
        col: 1,
      },
      4: {
        row: 0,
        col: -1,
      },
      5: {
        row: 0,
        col: 0,
      },
      6: {
        row: 0,
        col: 1,
      },
      7: {
        row: 1,
        col: -1,
      },
      8: {
        row: 1,
        col: 0,
      },
      9: {
        row: 1,
        col: 1,
      },
    };
    const target = map[row + directions[direction].row][col + directions[direction].col];
    if (!target) {
      console.log("You can't interact with the edge of the world!");
      return null;
    }
    // console.log(target);
    return target;
  }
  bonk() {
    this.location.level.updateMessage('Bonk! You hit your head on the wall');
  }

  gainXp(exp) {
    this.stats.xp += exp;
    this.location.level.updateMessage(`You gain ${exp} xp!`);
    this.levelUp();
  }

  levelUp() {
    const REQUIRED_XP = this.stats.xpToLvlUp;
    const NEW_REQUIRED_XP = Math.floor(100 + (Math.log(this.stats.level + 1) * 100));
    const NEW_LVL = this.stats.level + 1;
    if (this.stats.xp >= REQUIRED_XP) {
      this.location.level.updateMessage(`You are now level ${NEW_LVL}!`);
      this.stats.xp = this.stats.xp - REQUIRED_XP;
      this.stats.xpToLvlUp = NEW_REQUIRED_XP;
      console.log(NEW_REQUIRED_XP);
      this.stats.maxHp += 10;
      this.stats.hp = this.stats.maxHp;
      this.stats.level += 1;
      this.levelUp();
    }
  }

  attack(target) {
    // console.log(this.location);
    // console.log("---------------------------------------");
    if (target) {
      let die = this.stats.damage.dice;
      let dieT = this.stats.damage.type;
      let flat = this.stats.damage.flatdamage;
      let x = this.stats.damage.explodes;
      if (this.stats.equipped && this.stats.equipped.weapon
          && this.stats.equipped.weapon.stats.dice
          && this.stats.equipped.weapon.stats.dieType) {
        console.log('attacking with weapon');
        const weap = this.stats.equipped.weapon.stats;
        die = weap.dice;
        dieT = weap.dieType;
        flat = weap.flatdamage;
        x = weap.explodes;
      }
      console.log(`${this.stats.name} attacks the ${target.stats.name} for ${die}d${dieT}`);
      target.defense(this, die, dieT, flat, x);
    } else {
      console.log('The attack whiffs at nothing!');
    }
  }

  defense(aggressor, dice, type, flatdamage, explodes) {
    // Defining natural armor
    let armor = this.stats.defense.ac;
    let lightArmor = this.stats.defense.acLight;

    console.log(`Natural armor: ${armor}; ${lightArmor}`);

    // Defending with equipped items in all slots that have AC or light AC.
    if (this.stats.equipped) {
      const EQUIP = this.stats.equipped;
      const KEYS = Object.keys(EQUIP);
      const getAc = function getAc(val) {
        if (EQUIP[val].stats.ac) { return EQUIP[val].stats.ac; }
        return 0;
      };
      const getLac = function getLac(val) {
        if (EQUIP[val].stats.acLight) { return EQUIP[val].stats.acLight; }
        return 0;
      };
      armor += KEYS.map(getAc).reduce((a, b) => a + b);
      lightArmor += KEYS.map(getLac).reduce((a, b) => a + b);
    }

    console.log(`Equipped armor: ${armor}; ${lightArmor}`);
    const reduced = this.typeSubtract(armor, type);
    const redType = reduced.type;
    const redDice = dice - reduced.lostDice;

    /* acLight is light armor, a negative number (for legacy reasons) that is added to the final
    damage total after armor has reduced die types and total number of dice. */
    console.log(`Rolling ${redDice} d ${redType} to attack`);
    const roll = d(redDice, redType, explodes);
    const damage = roll + flatdamage + lightArmor;
    let agg = '';
    let tar = '';
    let hit = '';
    if (this.constructor.name === 'Player') {
      tar = 'you';
      agg = `The ${aggressor.stats.name}`;
      hit = 'hits';
    } else {
      tar = `the ${this.stats.name}`;
      agg = 'You';
      hit = 'hit';
    }

    this.location.level.updateMessage(`${agg} ${hit} ${tar}!`);
    this.takeDamage(damage, aggressor);
  }

  takeDamage(damage, aggressor) {
    let dmg = damage;
    if (damage < 0) { dmg = 0; }
    console.log(`${this.stats.name} #${this.id} takes ${dmg} 
      damage from the ${aggressor.stats.name} #${aggressor.id} 's attack`);
    this.stats.hp -= dmg;
    this.deathCheck(aggressor);
  }

  heal(hp) {
    if (this.stats.hp === this.stats.maxHp) {
      return 0;
    } else if (this.stats.hp + hp < this.stats.maxHp) {
      this.stats.hp += hp;
      return 1;
    }
    this.stats.hp = this.stats.maxHp;
    return 1;
  }

  deathCheck(aggressor) {
    const isPlayer = aggressor.constructor.name === 'Player';
    if (this.stats.hp <= 0 && this.constructor.name !== 'Player') {
      this.location.level.updateMessage(`The ${this.stats.name} dies!`);
      const tile = this.fetchTile(5);
      // console.log(this.stats.intrinsicInventory)
      for (let i = 0; i < this.stats.intrinsicInventory.length; i++) {
        // console.log(`Dropping a ${this.stats.intrinsicInventory[i].stats.symbol}`)
        this.drop(this.stats.intrinsicInventory, [i]);
      }
      for (let j = 0; j < this.stats.inventory.length; j++) {
        this.drop(this.stats.inventory, [j]);
      }
      if (isPlayer) { aggressor.gainXp(this.stats.xpAward); }
      tile.leave(this);
      this.location.level.despawn(this.id);
    } else if (this.stats.hp <= 0 && this.constructor.name === 'Player') {
      this.location.level.updateMessage('You died!');
      this.location.level.handleDeath();
    }
  }

  tryMove(direction) {
    this.location.level.updateMessage(null);
    const target = this.fetchTile(direction);
    // console.log(`Attempting entry into ${target.row}, ${target.col}`);
    // console.log(`${this.id} moving from ${this.location.row}, ${this.location.col}`)
    target.attemptEntry(this);
    if (this.constructor.name === 'Player') {
      console.log('Game ticks, triggering AI loop');
      this.location.level.tick();
    }
  }

  orient(tile) {
    this.location.row = tile.row;
    this.location.col = tile.col;
  }

  drop(inventory, item) {
    // takes an inventory and the index of an item to drop and gives it to the tile,
    const tile = this.fetchTile(5);
    const itemToDrop = inventory[item];
    tile.takeItem(itemToDrop);
    this.stats.carriedWeight -= itemToDrop.stats.weight;
    inventory.splice(item, 1);
    let name = '';
    let drops = '';
    if (this.constructor.name === 'Player') {
      this.location.level.updateMessage(null);
      name = 'You';
      drops = 'drop';
    } else {
      name = `The ${this.stats.name}`;
      drops = 'drops';
    }
    this.location.level.updateMessage(`${name} ${drops} the ${itemToDrop.stats.name}!`);
  }

  expend(inventory, item) {
    // takes an inventory and the index of an item to drop and gives it to the tile,
    const ITEM_TO_DROP = inventory[item];
    this.stats.carriedWeight -= ITEM_TO_DROP.stats.weight;
    inventory.splice(item, 1);
  }

  use(inventory, item) {
    // takes an inventory and the index of an item to drop and gives it to the tile,
    const ITEM = inventory[item];
    const USER = this;
    const USED = ITEM.use(USER);
    if (USED) {
      this.expend(inventory, item);
    }
  }

  unEquip(slot) {
    if (!this.stats.equipped[slot].stats.fake) {
      this.stats.inventory.unshift(this.stats.equipped[slot]);
    }
    this.stats.equipped[slot] = { stats: { name: 'Nothing', fake: 1 } };
  }

  equip(item) {
    if (item.stats.type && this.stats.equipped[item.stats.type] && this.stats.equipped[item.stats.type].id === item.id) {
      this.unEquip(item.stats.type);
    } else if (item.stats.type) {
      this.unEquip(item.stats.type);
      const IS_ITEM = (test) => item.id === test.id;
      const INDEX = this.stats.inventory.findIndex(IS_ITEM);
      this.stats.equipped[item.stats.type] = item;
      this.stats.inventory.splice(INDEX, 1);
    } else {
      console.log('Item Unequippable!');
    }
  }

  pickUp() {
    const tile = this.fetchTile(5);
    const item = tile.giveItem();
    // console.log(item);
    if (item != null) {
      this.stats.inventory.push(item);
      this.stats.carriedWeight += item.stats.weight;
      console.log('Something to pick up');
      this.location.level.updateMessage(null);
      this.location.level.updateMessage(
        `You picked up a ${item.stats.name}! New carried weight: ${this.stats.carriedWeight}`);
    } else {
      console.log('Nothing to pick up');
      this.location.level.updateMessage(null);
      this.location.level.updateMessage('There is nothing here to pick up!');
    }
  }

}

export class Cat extends Mob {
  constructor(loc) {
    const corpse = new Item({
      name: "cat corpse",
      symbol: "%",
      weight: 20,
    });
    // generate inventory first
    let intrinsicInventory = [corpse];
    let inventory = [];
      // feed stats with inventory to Mob, which will autocalculate carriedWeight;
    let stats = {
      name: 'cat',
      symbol: 'c',
      hp: 25,
      maxHp: 25,
      xpAward: 1000,
      level: 1,
      damage: {
        dice: 2,
        type: 4,
        explodes: 1,
        flatdamage: 0,
      },
      defense: {
        ac: 0,
        acLight: -2,
      },
      inventory,
      intrinsicInventory,
      carriedWeight: 0,
      color: 'maroon',
    };
    super(loc, stats);
    this.stats.maxHp = 25*this.stats.level;
    this.stats.hp = this.stats.maxHp;
  }
}

export class Dog extends Mob {
  constructor(loc) {
    const corpse = new Item({
      name: 'dog corpse',
      symbol: '%',
      weight: 20,
    });
    let intrinsicInventory = [corpse];
    let inventory = [];
    let stats = {
      name: 'dog',
      symbol: 'd',
      hp: 25,
      maxHp: 25,
      xpAward: 25,
      level: 1,
      damage: {
        dice: 2,
        type: 4,
        explodes: 1,
        flatdamage: 0,
      },
      defense: {
        ac: 0,
        acLight: 0,
      },
      inventory,
      intrinsicInventory,
      carriedWeight: 0,
    };
    super(loc, stats);
    this.stats.maxHp = 25*this.stats.level;
    this.stats.hp = this.stats.maxHp;
  }
}

export class Player extends Mob {
  constructor(name, loc) {
    const corpse = new Item({
      name: `${name} corpse`,
      symbol: '%',
      weight: 20,
    });
    const souvenir = new Item({
      name: 'Healing Potion',
      symbol: '!',
      weight: 1,
      proc: {
        name: 'healPotion',
        
      },
    });
    const hat = new Item({
      name: 'Baseball Jersey',
      symbol: '!',
      weight: 2,
      type: 'armor',
      acLight: -6,
      ac: 0,
    });
    const stick = new Item({
      name: 'Pointy Stick',
      symbol: '|',
      weight: 4,
      type: 'weapon',
      dice: 4,
      dieType: 12,
      explodes: 1,
      flatdamage: 0,
    });
    const startHelm = new Item({
      name: 'Helm of Might',
      symbol: '[',
      weight: 4,
      type: 'helm',
      acLight: -2,
      ac: 0,
    });
    const startArmor = new Item({
      name: 'Armor of Blazes',
      symbol: ']',
      weight: 4,
      type: 'armor',
      acLight: 0,
      ac: 1,
    });
    const startSword = new Item({
      name: 'Sword of Poking',
      symbol: '|',
      weight: 4,
      type: 'weapon',
      dice: 4,
      dieType: 8,
      explodes: 1,
      flatdamage: 0,
    });

    // super calls parent constructor
    let intrinsicInventory = [corpse];
    let inventory = [souvenir, hat, stick];
    let stats = {
      name,
      symbol: '@',
      hp: 25,
      maxHp: 25,
      xpAward: 25,
      xp: 0,
      level: 1,
      xpToLvlUp: 100,
      damage: {
        dice: 3,
        type: 6,
        explodes: 1,
        flatdamage: 0,
      },
      defense: {
        ac: 0,
        acLight: 0,
      },
      inventory,
      intrinsicInventory,
      equipped: {
        weapon: startSword,
        armor: startArmor,
        helm: startHelm,
      },
      carriedWeight: 0,
      visionRadius: 3,
    };
    stats.intrinsicInventory = [corpse];
    super(loc, stats);
    this.stats.maxHp = 35 * this.stats.level;
    this.stats.hp = this.stats.maxHp;
  }

  see() {
    const r = this.stats.visionRadius;
    const origin = {
      row: this.location.row,
      col: this.location.col,
    };
    const arr = this.location.arr;
    // Unsee the previously seen tiles
    for (let i = origin.row - (r + 1); i < origin.row + (r + 2); i++) {
      for (let j = origin.col - (r + 1); j < origin.col + (r + 2); j++) {
        if (arr[i] && arr[i][j]) {
          // console.log(r)
          arr[i][j].beUnseen();
        } else {
          console.log('bad tile');
        }
      }
    }
    // Generate a list of farthest-away potentially-visible tiles and cast rays to them
    // Should refactor to Map probably
    const perim = new Perimeter(origin, r);
    for (let i = 0; i < perim.length; i++) {
      const ray = new Ray(origin, perim[i], r);
      // have we hit a wall yet
      let previous = 0;
      for (let j = 0; j < ray.length; j++) {
        const rR = ray[j].row;
        const rC = ray[j].col;
        const cell = arr[rR] && arr[rR][rC] ? arr[rR][rC] : null;
        // if it's clear so far, see the tile
        if (cell && cell.attributes.opaque === 0 && previous === 0) {
          cell.beSeen();
          cell.becomeExplored();
        // else if you hit a wall, see the wall and stop looking at tiles
        } else if (cell && cell.attributes.opaque === 1 && previous === 0) {
          cell.beSeen();
          cell.becomeExplored();
          previous = 1;
        }
      }
    }
  }
}
