import React from 'react';
import ReactDOM from 'react-dom';
import Game from './React_Components/Game';

require('./styles/style.scss');

ReactDOM.render(
  <Game />,
  document.getElementById('app')
);
