import React from 'react';
import Board from './Board';

import { Floor as Floor, Wall as Wall, Sand as Sand, Tile as Tile } from '../Game_Classes/Tiles';
import { Mob as Mob, Player as Player, Cat as Cat, Dog as Dog } from '../Game_Classes/Mobs';
import Item from '../Game_Classes/Item';
import Level from '../Game_Classes/Level';


class Game extends React.Component {
  constructor(props) {
    const player = new Player('Hank');
    const one = new Level(player);
    one.spawnPlayer(15, 78);
    one.spawnCat(12, 55);
    one.spawnCat(15, 76);
    const array = one.print('map');
    super(props);
    this.state = {
      array: array.map,
      level: one,
      context: 'map',
    };
    this.playerMove = this.playerMove.bind(this);
    this.openMenu = this.openMenu.bind(this);
    this.keyHandler = this.keyHandler.bind(this);
    this.navMenus = this.navMenus.bind(this);
    this.drop = this.drop.bind(this);
  }

  componentDidMount() {

  }

  keyHandler(key) {
    if (this.state.context === 'map') {
      if (key === 11) {
        this.playerPickUp();
      } else if (key === 10) {
        this.setState({
          highlight: 0,
        });
        this.openMenu('Inventory',
          '(d) to drop, (e) to equip/unequip weapon/armor, (a) to use item');
      } else {
        this.playerMove(key);
      }
    } else if (this.state.context === 'menu') {
      if (key === 2) {
        this.navMenus('Up');
      } else if (key === 8) {
        this.navMenus('Down');
      } else if (key === 12) {
        console.log('attempting to turn pages');
        const menu = this.state.level.menu.next();
        this.setState({
          array: menu,
        });
      } else if (key === 10) {
        const map = this.state.level.print('map');
        this.setState({
          array: map.map,
          context: 'map',
          highlight: 0,
        });
      } else if (key === 13) {
        this.drop();
      } else if (key === 14) {
        this.equip();
      } else if (key === 15) {
        this.use();
      }
    }
  }


  openMenu(args, instruct) {
    const argObject = {
      title: args,
      data: this.state.level.player,
      highlight: this.state.highlight,
      dir: instruct,
    };
      // console.log('Opening menu with arguments:')
      // console.log(argObject.data);
    const level = this.state.level.print('openMenu', argObject);
    // console.log(`Level: ${level}`);
    // console.log(level)
    this.setState({
      context: level.context,
      array: level.map,
    });
  }

  navMenus(args) {
    if (args === 'Up') {
      this.state.level.menu.nav(0);
      const menu = this.state.level.print('menu');
      this.setState({
        array: menu.map,
      });
    } else if (args === 'Down') {
      this.state.level.menu.nav(1);
      // console.log(this.state.level.menu)
      const menu = this.state.level.print('menu');
      this.setState({
        array: menu.map,
      });
    }
  }

  drop() {
    this.state.level.menu.drop();
    const menu = this.state.level.print('menu');
    this.setState({
      array: menu.map,
    });
  }

  equip() {
    this.state.level.menu.equip();
    const menu = this.state.level.print('menu');
    this.setState({
      array: menu.map,
    });
  }

  use() {
    this.state.level.menu.use();
    const menu = this.state.level.print('menu');
    this.setState({
      array: menu.map,
    });
  }

  playerPickUp() {
    this.state.level.player.pickUp();
    const array = this.state.level.print('map');
    this.setState({
      array: array.map,
    });
  }

  playerMove(dir) {
    // console.log(dir)
    this.state.level.player.tryMove(dir);
    const array = this.state.level.print('map');
    this.setState({
      array: array.map,
      context: array.context,
    });
  }

  render() {
    return (
      <div className="outer">
        <div className="title">Roguelike: Prototype Edition</div>
        <Board array={this.state.array} keyHandler={this.keyHandler} />
        Arrow keys to move, i to view inventory, comma (,) key to pick up items
      </div>
    );
  }
}

export default Game;