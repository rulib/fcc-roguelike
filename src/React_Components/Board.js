import React from 'react';
import Game from './Game'


class Board extends React.Component {
  constructor(props) {
    super(props);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.componentWillUnmount = this.componentWillUnmount.bind(this);
    this.keyHandler = this.keyHandler.bind(this);
  }
  componentDidMount() {
    window.addEventListener('keydown', this.keyHandler);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.keyHandler);
  }

  keyHandler(e) {
    const keyTable = {
      37: 4,
      38: 2,
      39: 6,
      40: 8,
      73: 10,
      188: 11,
      13: 12,
      68: 13,
      69: 14,
    };
    if (e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39
     || e.keyCode === 40 || e.keyCode === 188 || e.keyCode === 73
     || e.keyCode === 13 || e.keyCode === 68 || e.keyCode === 69) {
      this.props.keyHandler(keyTable[e.keyCode]);
    }
  }

  render() {
    // console.log("Rendering board on props: " + this.props.array[0]);

    const boardArray = this.props.array;
    let cellName = 'cell';
    //  console.log(boardArray)
    let cellRows = boardArray.map((row, index) => {
      let columns = row.map((cell, ind) => {
        // console.log(cell === 0)
        cellName = `cell ${cell.status} ${cell.color}`;
        const id = `row${index}col${ind}`;
        return <div className={cellName} id={id} key={id}>{cell.symbol}</div>;
      });
      return (
        <div className="row"> {columns} </div>
      );
    });
    return (
      <div className="boardBox" tabIndex="1" onKeyDown={this.focusHandler}>
        {cellRows}
      </div>
    );
  }
}

export default Board;