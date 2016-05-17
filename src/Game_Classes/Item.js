class Item {
  constructor(stats) {
    this.stats = stats;
    this.id = (Math.round(Math.random() * Date.now()));
  }
}

export default Item;