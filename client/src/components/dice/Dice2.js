import React from 'react';
import './dice2.css';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {}
});

const Dice = ({ cube }) => {
  return (
    <div className="cube" cube={cube}>
      <div className="side front" data-side="1">
        <span className="dot"></span>
      </div>
      <div className="side back" data-side="2">
        <span className="dot"></span>
        <span className="dot"></span>
      </div>
      <div className="side right" data-side="3">
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </div>
      <div className="side left" data-side="4">
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </div>
      <div className="side top" data-side="5">
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </div>
      <div className="side bottom" data-side="6">
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </div>
    </div>
  );
};

export default withStyles(styles)(Dice);
