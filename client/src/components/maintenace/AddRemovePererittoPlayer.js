import React, { Component } from 'react';
import { connect } from 'react-redux';
import { /*TwitterPicker*/ CirclePicker } from 'react-color';
import * as actions from '../../actions';

import SnackBar from '../components/SnackBar';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  colourSelectError: {
    color: 'red'
  }
});

const colours = [
  '#FF851B',
  '#FCB900',
  '#7BDCB5',
  '#2ECC40',
  '#8ED1FC',
  '#0074D9',
  '#ABB8C3',
  '#FF4136',
  '#F78DA7',
  '#B10DC9'
];

class AddRemovePererittoPlayer extends Component {
  state = {
    playerName: '',
    openSnackBar: false,
    playerColour: '',
    errorColour: false,
    errorName: false
  };

  style = {
    color: this.state.errorColour ? 'red' : 'blue'
  };

  static getDerivedStateFromProps(props, state) {
    // const { maintenance } = props;

    // if ((maintenance !== null && maintenance.error) || maintenance.success) {
    //   console.log(maintenance.error);
    //   console.log(maintenance.success);
    //   // this.setState({ openSnackBar: true });
    //   return {
    //     cachedSomeProp: nextProps.someProp
    //   };
    // } else {
    //   // this.setState({ openSnackBar: false });
    // }

    return null;
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   // console.log('nextProps', nextProps);
  //   // console.log('nextState', nextState);

  //   const { maintenance } = nextProps;

  //   if ((maintenance !== null && maintenance.error) || maintenance.success) {
  //     console.log(maintenance.error);
  //     console.log(maintenance.success);

  //     this.setState({ openSnackBar: true });
  //     return true;
  //   } else {
  //     this.setState({ openSnackBar: false });
  //     return false;
  //   }
  // }

  handleColourPickerChange = colour => {
    this.setState({ playerColour: colour.hex, errorColour: false });
  };

  onInputChange = event => {
    this.setState({ playerName: event.target.value });
  };

  addPlayerClick = () => {
    if (this.state.playerName === '') {
      this.setState({ errorColour: true });
      console.log('Select a name');
      return;
    } else if (this.state.playerColour === '') {
      console.log('Select a colour');
      return;
      // this.setState({showSnackBar: true, snackBarMessage: 'Select a colour', snackBarVairant: 'error'});
    }

    this.props.addPererittoUser(this.state.playerName, this.state.playerColour);
  };

  deletePlayerClick = () => {
    if (this.state.playerName === '') {
      console.log('Select a name');
    }

    this.props.deletePererittoUser(this.state.playerName);
  };

  onFormSubmit = event => {
    event.preventDefault();
  };

  renderMessage() {
    // console.log('errorcolor', this.state.errorColour);
    return (
      <Typography
        style={{
          marginTop: '10px',
          color: this.state.errorColour ? 'red' : ''
        }}
      >
        Select an avatar colour for new player
      </Typography>
    );
  }

  renderSnackBar() {
    const { maintenance } = this.props;

    if (maintenance !== null) {
      if (maintenance.error) {
        console.log(maintenance.error);
        return (
          <SnackBar
            open={this.state.openSnackBar}
            variant="error"
            message={maintenance.error}
          />
        );
      } else if (maintenance.success) {
        console.log(maintenance.success);
        return (
          <SnackBar
            open={this.state.openSnackBar}
            variant="success"
            message={maintenance.success}
          />
        );
      }
    }

    return null;
  }

  render() {
    const { classes } = this.props;

    return (
      <Grid>
        <Grid item style={{ textAlign: 'center' }}>
          <Button
            style={{
              marginRight: '10px',
              color: 'white',
              backgroundColor: '#001f3f'
            }}
            onClick={this.addPlayerClick}
          >
            Add Player
          </Button>
          <Button
            style={{
              marginLeft: '10px',
              color: 'white',
              backgroundColor: '#FF4136'
            }}
            onClick={this.deletePlayerClick}
          >
            Remove Player
          </Button>
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
        <Grid item style={{ textAlign: 'center', marginTop: '10px' }}>
          {this.renderMessage()}
          <div
            style={{
              display: 'table',
              margin: '0 auto',
              marginTop: '20px',
              paddingLeft: '30px'
            }}
          >
            <CirclePicker
              circleSize={30}
              onChangeComplete={this.handleColourPickerChange}
              colors={colours}
              triangle="hide"
            />
          </div>
        </Grid>
        <Grid item style={{ margin: 'auto' }} />
        <Grid item style={{ textAlign: 'center', marginTop: '10px' }}>
          <Typography
            style={{
              borderBottom: `1px solid black`,
              width: '150px',
              margin: 'auto',
              paddingBottom: '1px',
              paddingTop: '20px',
              marginBottom: '1px'
            }}
          />
          <Typography
            style={{
              borderBottom: `10px solid ${this.state.playerColour}`,
              width: this.state.playerColour !== '' ? '150px' : '0px',
              margin: 'auto'
            }}
          />
          <Typography
            style={{
              borderTop: `1px solid black`,
              width: '150px',
              margin: 'auto',
              marginTop: '1px'
            }}
          />
        </Grid>
        {this.renderSnackBar()}
      </Grid>
    );
  }
}

function mapStateToProps({ maintenance }) {
  return { maintenance };
}

export default connect(
  mapStateToProps,
  actions
)(withStyles(styles)(AddRemovePererittoPlayer));