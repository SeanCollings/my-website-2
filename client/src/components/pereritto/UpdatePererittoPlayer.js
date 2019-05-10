import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

const styles = theme => ({
  root: {
    maxWidth: '100%',
    width: '360px'
  },
  rootChecked: {
    color: '#001f3f',
    '&$checked': {
      color: '#001f3f'
    }
  },
  checked: {},
  textField: {
    maxWidth: '80%',
    width: '400px'
  }
});

class UpdatePererittoPlayer extends Component {
  state = { playerName: '', checked: true };
  componentDidMount() {
    this.props.getPererittoUsers();
  }

  onFormSubmit = event => {
    event.preventDefault();
  };

  handleChange = () => {
    this.setState({ checked: !this.state.checked });
  };

  onInputChange = event => {
    this.setState({ playerName: event.target.value });
  };

  updatePlayerClick = () => {
    if (this.state.playerName === '') {
      this.setState({ errorColour: true });
      console.log('Select a name');
      return;
    }

    this.props.updatePererittoUser(this.state.playerName, this.state.checked);
  };

  render() {
    const { classes } = this.props;

    return (
      <Grid className={classes.root}>
        <Grid item style={{ textAlign: 'center' }}>
          <Button
            style={{
              marginRight: '10px',
              color: 'white',
              backgroundColor: '#001f3f'
            }}
            onClick={this.updatePlayerClick}
          >
            Update Player
          </Button>
          <Grid item style={{ textAlign: 'center' }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.checked}
                  onChange={this.handleChange}
                  value="checked"
                  classes={{
                    root: classes.rootChecked,
                    checked: classes.checked
                  }}
                />
              }
              label="Winner?"
            />
          </Grid>
        </Grid>
        <Grid item style={{ textAlign: 'center' }}>
          <form onSubmit={this.onFormSubmit}>
            <TextField
              id="outlined-uncontrolled"
              label="Name"
              className={classes.textField}
              margin="normal"
              variant="outlined"
              onChange={this.onInputChange}
            />
          </form>
        </Grid>
      </Grid>
    );
  }
}

function mapStateToProps({ auth, pererittoUsers }) {
  return {
    pererittoUsers,
    superUser: auth.superUser
  };
}

export default connect(
  mapStateToProps,
  actions
)(withStyles(styles)(UpdatePererittoPlayer));
