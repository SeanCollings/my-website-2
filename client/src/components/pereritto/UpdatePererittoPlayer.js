import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';

import DatePicker from '../components/DatePicker';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox';

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
  state = { playerName: '', checked: true, errorName: false };
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
      this.setState({ errorName: true });
      console.log('Select a name');
      return;
    }

    this.props.updatePererittoUser(this.state.playerName, this.state.checked);
  };

  render() {
    const { classes, resizeScreen } = this.props;

    return (
      <div style={{ paddingTop: '12px' }}>
        <Grid className={classes.root}>
          <Grid item style={{ textAlign: 'center' }}>
            <Button
              size={resizeScreen ? 'small' : ''}
              style={{
                marginRight: '10px',
                color: 'white',
                backgroundColor: '#001f3f'
              }}
              onClick={this.updatePlayerClick}
            >
              Update Player
            </Button>
            {/* <Grid item style={{ textAlign: 'center' }}>
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
          </Grid> */}
          </Grid>
          <Grid item style={{ textAlign: 'center' }}>
            <form onSubmit={this.onFormSubmit}>
              <TextField
                error={this.state.errorName ? true : false}
                id="outlined-uncontrolled"
                label="Name"
                margin="normal"
                variant="outlined"
                onChange={this.onInputChange}
                className={classes.textField}
              />
            </form>
          </Grid>
          <Grid item style={{ textAlign: 'center' }}>
            <DatePicker />
          </Grid>
        </Grid>
      </div>
    );
  }
}

function mapStateToProps({ auth, pererittoUsers, resizeScreen }) {
  return {
    pererittoUsers,
    superUser: auth.superUser,
    resizeScreen
  };
}

export default connect(
  mapStateToProps,
  actions
)(withStyles(styles)(UpdatePererittoPlayer));
