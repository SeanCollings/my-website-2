import React from 'react';

import './dice.css';
// import Button from '@material-ui/core/Button';
// import Grid from '@material-ui/core/Grid';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {}
});

const Dice = () => {
  return (
    // <div >
    <ol className="die-list even-roll" data-roll="1" id="die-1">
      <li className="die-item" data-side="1">
        <span className="dot"></span>
      </li>
      <li className="die-item" data-side="2">
        <span className="dot"></span>
        <span className="dot"></span>
      </li>
      <li className="die-item" data-side="3">
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </li>
      <li className="die-item" data-side="4">
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </li>
      <li className="die-item" data-side="5">
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </li>
      <li className="die-item" data-side="6">
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </li>
    </ol>
    // </div>
  );
};

export default withStyles(styles)(Dice);
