class Menu {
  constructor(args) {
    this.startCol = 3;
    this.endCol = 76;
    this.startRow = 3;
    this.endRow = 16;
    this.screen = this.initializeMenu();
    this.title = args.title;
    this.data = args.data;
    this.dir = args.dir;
    this.inventory = this.data.stats.inventory;
    this.pageLength = 10;
    this.pages = this.paginate(this.inventory, this.pageLength);
    this.page = 0;
    this.equipment = this.data.stats.equipped;
    this.highlight = args.highlight;
    this.screen = this.printTitle(this.screen, this.title, this.dir);
    this.screen = this.printData(this.screen);
    //  this.screen = this.printData(this.screen, this.data);
    //  console.log(this.data.stats)
  }

  initializeMenu() {
    let menu = [];
    for (let i = 0; i < 20; i++) {
      let row = [];
      for (let j = 0; j < 80; j++) {
        if (i < this.startRow || i > this.endRow) {
          row.push({
            symbol: '_',
            status: 'seen',
          });
        } else if (j < this.startCol || j > this.endCol) {
          row.push({
            symbol: '|',
            status: 'seen',
          });
        } else {
          row.push({
            symbol: '  ',
            status: 'seen',
          });
        }
      }
      menu.push(row);
    }
    return menu;
  }

  paginate(array, pageLength) {
    const length = array.length;
    const pages = Math.ceil(length / pageLength);
    let pageArray = [];
    for (let i = 0; i < pages; i++) {
      const replacement = [].concat(array);
      pageArray.push(replacement.slice(0 + (i * pageLength), (i * pageLength + pageLength)));
    }
    console.log(pageArray);
    return pageArray;
  }

  nav(direction) {
    console.log(
        `
      Direction: ${direction}
      Highlight at call: ${this.highlight}
      Page: ${this.page}
      lastPage: ${this.pages.length - 1}
      Button Point: ${this.buttonPoint}
      Buttons: ${this.buttons}
      Equipment Point: ${this.equippedHighlightPoint}
      Menu Length: ${this.menuLength}
      `)

      //  Move up
    if (direction === 0 && this.highlight > 0) {
      this.highlight--;
      console.log(`
        Highlight after call: ${this.highlight}
        `);
    }

    //  Move down to last item
    if (direction === 1 && this.highlight < this.menuLength - 1) {
      this.highlight++;
      console.log(`
        Highlight after call: ${this.highlight}
        `);
    }

    return this.printData(this.screen);
  }

  next() {
    if (this.nextButtonPoint && this.highlight === this.nextButtonPoint) {
      this.page++;
      this.highlight = 0;
      let arr = this.initializeMenu();
      arr = this.printTitle(arr, this.title, this.dir);
      arr = this.printData(arr);
      this.screen = arr;
      return arr;
    } else if (this.prevButtonPoint && this.highlight === this.prevButtonPoint) {
      this.page--;
      this.highlight = 0;
      let arr = this.initializeMenu();
      arr = this.printTitle(arr, this.title, this.dir);
      arr = this.printData(arr);
      this.screen = arr;
      return arr;
    }
    return this.screen;
  }


  refresh() {
    this.inventory = this.data.stats.inventory;
    this.pages = this.paginate(this.inventory, this.pageLength);
    this.page = 0;
    this.equipment = this.data.stats.equipped;
    let arr = this.initializeMenu();
    arr = this.printTitle(arr, this.title, this.dir);
    arr = this.printData(arr);
    this.screen = arr;
    return this.screen;
  }

  drop() {
    if (this.pages[this.page] && this.highlight < this.pages[this.page].length) {
      //  reconstruct original inventory number:
      console.log(this.screen[6][8]);
      const n = this.pageLength;
      const page = this.page;
      const playerInv = this.data.stats.inventory;
      const player = this.data;
      const index = this.highlight + (page * n);

      player.drop(playerInv, index);
      this.inventory = this.data.stats.inventory;
      this.pages = this.paginate(this.inventory, this.pageLength);
      this.page = 0;

      //  Clear and re-render
      this.refresh();
    }
    return this.screen;
  }

  equip() {
    const PLAYER = this.data;
    const INV = PLAYER.stats.inventory;

    const WEAPON = PLAYER.stats.equipped.weapon;
    const ARMOR = PLAYER.stats.equipped.armor;
    const HELM = PLAYER.stats.equipped.helm;

    const WEAPON_INDEX = this.equippedHighlightPoint;
    const ARMOR_INDEX = this.equippedHighlightPoint + 1;
    const HELM_INDEX = this.equippedHighlightPoint + 2;

    const PAGE = this.page;
    const N = this.pageLength;

    const INDEX = this.highlight + (PAGE * N);

    if (this.pages[this.page] && this.highlight < this.pages[this.page].length) {
      console.log(this.screen[6][8]);
      PLAYER.equip(INV[INDEX]);
      this.inventory = INV;
      this.pages = this.paginate(this.inventory, this.pageLength);
      this.page = 0;
    } else if (this.highlight === WEAPON_INDEX) {
      PLAYER.equip(WEAPON);
    } else if (this.highlight === ARMOR_INDEX) {
      PLAYER.equip(ARMOR);
    } else if (this.highlight === HELM_INDEX) {
      PLAYER.equip(HELM);
    }

    //  Clear and re-render
    this.refresh();
  }

  //  Print the blank inventory Screen
  printTitle(menu, title, dir) {
    const titleRow = this.startRow - 2;
    const titleCol = this.startCol + 1;
    let newMenu = [].concat(menu);
    for (let i = 0; i < title.length; i++) {
      //  console.log(title[i]);
      newMenu[titleRow][titleCol + i] = {
        symbol: title[i],
        status: 'seen',
      };
    }
    for (let i = 0; i < dir.length; i++) {
      //  console.log(title[i]);
      newMenu[titleRow + 1][titleCol + i] = {
        symbol: dir[i],
        status: 'seen',
      };
    }
    for (let i = 0; i < `Inventory p.${this.page + 1}`.length; i++) {
      newMenu[titleRow + 2][titleCol + i] = {
        symbol: `Inventory p.${this.page + 1}`[i],
        status: 'seen',
      };
    }
    for (let i = 0; i < 'Equipped:'.length; i++) {
      newMenu[titleRow + 2][39 + i] = {
        symbol: 'Equipped:'[i],
        status: 'seen',
      };
    }
    for (let i = 0; i < 'Weapon:'.length; i++) {
      newMenu[titleRow + 3][40 + i] = {
        symbol: 'Weapon:'[i],
        status: 'seen',
      };
    }
    for (let i = 0; i < 'Armor:'.length; i++) {
      newMenu[titleRow + 5][40 + i] = {
        symbol: 'Armor:'[i],
        status: 'seen',
      };
    }
    for (let i = 0; i < 'Helm:'.length; i++) {
      newMenu[titleRow + 7][40 + i] = {
        symbol: 'Helm:'[i],
        status: 'seen',
      };
    }
    return newMenu;
  }

  //  Print the menu with inventory
  printData(menu) {
    const pageMessage = 'Next Page -->';
    const lastPageMsg = '<-- Prev Page';
    const startRow = this.startRow + 1;
    const startCol = this.startCol + 1;
    let newMenu = [].concat(menu);

    this.buttons = 0;
    this.equippedHighlightPoint = 0;
    this.buttonPoint = 0;
    this.menuLength = 0;

    //  Handle highlighting for items
    if (this.pages[this.page]) {
      for (let i = 0; i < this.pages[this.page].length; i++) {
        const dataString =
        `${i + 1} ${this.pages[this.page][i].stats.symbol} ${this.pages[this.page][i].stats.name}`;
          //  console.log(`Printing item ${i} for inventory list`)
        for (let j = 0; j < dataString.length; j++) {
          if (this.highlight === i) {
            newMenu[i + startRow][j + startCol] = {
              symbol: dataString[j],
              status: 'seen highlight',
            };
          } else {
            newMenu[i + startRow][j + startCol] = {
              symbol: dataString[j],
              status: 'seen',
            };
          }
        }
      }
    }

    // Set button and equipment highlight points

    // First page of multiple pages - Needs 10 entries and "next page"
    if (this.pages.length > 1 && this.page === 0) {
      this.buttonPoint = 10;
      this.nextButtonPoint = 10;
      this.prevButtonPoint = null;
      this.equippedHighlightPoint = 11;
      this.menuLength = 14;

      // First page of one page - Needs some entries and no "next page"
    } else if (this.pages.length <= 1) {
      this.buttons = 0;
      this.nextButtonPoint = null;
      this.prevButtonPoint = null;
      if (this.pages[this.page]) {
        this.equippedHighlightPoint = this.pages[this.page].length;
        this.menuLength = this.pages[this.page].length + 3;
      } else {
        this.equippedHighlightPoint = 0;
        this.menuLength = 3;
      }

      // Middle pages - Needs entries, next page and prev page
    } else if (this.pages.length > 1 && this.page > 0 && this.page < this.pages.length - 1) {
      this.buttons = 2;
      this.buttonPoint = 10;
      this.nextButtonPoint = 10;
      this.prevButtonPoint = 11;
      this.equippedHighlightPoint = 12;
      this.menuLength = 15;

      // Last of multiple pages
    } else if (this.pages.length > 1 && this.page === this.pages.length - 1 && this.page > 0) {
      this.buttons = 1;
      this.buttonPoint = this.pages[this.page].length;
      this.nextButtonPoint = null;
      this.prevButtonPoint = this.pages[this.page].length;
      this.equippedHighlightPoint = this.pages[this.page].length + this.buttons;
      this.menuLength = this.pages[this.page].length + 4;
    }

    // Handle highlighting of buttons

    const printNext = () => {
      for (let i = 0; i < pageMessage.length; i++) {
        if (this.highlight === this.buttonPoint) {
          newMenu[10 + startRow][i + startCol] = {
            symbol: pageMessage[i],
            status: 'seen highlight',
          };
        } else {
          newMenu[10 + startRow][i + startCol] = {
            symbol: pageMessage[i],
            status: 'seen',
          };
        }
      }
    };

    const printPrev = () => {
      for (let i = 0; i < lastPageMsg.length; i++) {
        if (this.highlight === this.buttonPoint + 1) {
          newMenu[11 + startRow][i + startCol] = {
            symbol: lastPageMsg[i],
            status: 'seen highlight',
          };
        } else {
          newMenu[11 + startRow][i + startCol] = {
            symbol: lastPageMsg[i],
            status: 'seen',
          };
        }
      }
    };

    const printPrevOnly = () => {
      for (let i = 0; i < lastPageMsg.length; i++) {
        if (this.highlight === this.buttonPoint) {
          newMenu[10 + startRow][i + startCol] = {
            symbol: lastPageMsg[i],
            status: 'seen highlight',
          };
        } else {
          newMenu[10 + startRow][i + startCol] = {
            symbol: lastPageMsg[i],
            status: 'seen',
          };
        }
      }
    };

    if (this.pages.length > 1 && this.page === 0) {
      printNext();
    } else if (this.pages.length > 1 && this.page < this.pages.length - 1) {
      printNext();
      printPrev();
    } else if (this.pages.length > 1) {
      printPrevOnly();
    }

    // Handle highlighting of equip slots

    for (let i = 0; i < this.equipment.weapon.stats.name.length; i++) {
      if (this.highlight === this.equippedHighlightPoint) {
        newMenu[startRow + 1][41 + i] = {
          symbol: this.equipment.weapon.stats.name[i],
          status: 'seen highlight',
        };
      } else {
        newMenu[startRow + 1][41 + i] = {
          symbol: this.equipment.weapon.stats.name[i],
          status: 'seen',
        };
      }
    }
    for (let i = 0; i < this.equipment.armor.stats.name.length; i++) {
      if (this.highlight === this.equippedHighlightPoint + 1) {
        newMenu[startRow + 3][41 + i] = {
          symbol: this.equipment.armor.stats.name[i],
          status: 'seen highlight',
        };
      } else {
        newMenu[startRow + 3][41 + i] = {
          symbol: this.equipment.armor.stats.name[i],
          status: 'seen',
        };
      }
    }
    for (let i = 0; i < this.equipment.helm.stats.name.length; i++) {
      if (this.highlight === this.equippedHighlightPoint + 2) {
        newMenu[startRow + 5][41 + i] = {
          symbol: this.equipment.helm.stats.name[i],
          status: 'seen highlight',
        };
      } else {
        newMenu[startRow + 5][41 + i] = {
          symbol: this.equipment.helm.stats.name[i],
          status: 'seen',
        };
      }
    }
    return newMenu;
  }

}


export default Menu;
