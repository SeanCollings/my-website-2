import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

import { toggleDice } from '../../actions/appActions';
import dice from '../../images/dice_small.png';

import Fab from '@material-ui/core/Fab';
import Avatar from '@material-ui/core/Avatar';

import './dice.css';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {}
});

const ToggleDiceButton = props => {
  return (
    <div className={`${props.showButton ? 'button-show' : 'button-hide'}`}>
      <NavLink to="/dice" style={{ textDecoration: 'none' }}>
        <Fab
          onClick={props.toggleDice}
          aria-label="add"
          style={{
            color: '#dedede',
            background: '#c70039',
            position: 'fixed',
            bottom: '40px',
            right: '30px'
          }}
        >
          <Avatar
            style={{
              transform: 'scale(1.3)',
              filter: 'invert(1) sepia(1) drop-shadow(2px 4px 6px red)'
            }}
            alt="show-dice"
            src={dice}
          />
        </Fab>
      </NavLink>
    </div>
  );
};

export default connect(
  null,
  { toggleDice }
)(withStyles(styles)(ToggleDiceButton));
