import d from './d';

class Item {
  constructor(stats) {
    this.stats = stats;
    this.id = (Math.round(Math.random() * Date.now()));
  }

  use(user) {
    if (this.stats.proc && this.stats.proc.name) {
      return this[this.stats.proc.name](user);
    }
    return null;
  }

  healPotion(user) {
    const HEAL_VALUE = d(3, 6, 1);
    let used = 1;
    // Makes sure potion is usable
    if (user.stats.hp === user.stats.maxHp) {
      used = 0;
      user.location.level.updateMessage('You are already at full health!');
    } else {
      used = 1;
      user.heal(HEAL_VALUE);
      user.location.level.updateMessage('You quaff the healing potion!');
    }
    // Player will destroy any object that reports it is used.
    return used;
  }

}

export default Item;
