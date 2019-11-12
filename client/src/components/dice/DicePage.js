import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

import { toggleDice } from '../../actions/appActions';
// import Dice from './Dice';
import Dice2 from './Dice2';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {}
});

class DicePage extends Component {
  state = { numberOfDice: 1 };

  render() {
    // const { numberOfDice } = this.state;

    return (
      <div>
        <Grid container direction="column" justify="center" alignItems="center">
          <NavLink to="/pereritto" style={{ textDecoration: 'none' }}>
            <Button onClick={this.props.toggleDice}>Return</Button>
          </NavLink>
          <br />
          <div className="dice">
            <Dice2 cube={'1'} />
            <br />
            <br />
            <br />
            <Dice2 cube={'2'} />
            <br />
            <br />
            <br />
            <Dice2 cube={'3'} />
            <br />
            <br />
            <br />
            <Dice2 cube={'4'} />
          </div>
          {/* <Button
            onClick={() => this.setState({ numberOfDice: numberOfDice - 1 })}
          >
            Remove
          </Button>
          <Button
            onClick={() => this.setState({ numberOfDice: numberOfDice + 1 })}
          >
            Add
          </Button> */}
        </Grid>
      </div>
    );
  }
}

export default connect(
  null,
  { toggleDice }
)(withStyles(styles)(DicePage));
