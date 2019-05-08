import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TwitterPicker } from 'react-color';
import * as actions from '../actions';

import Paper from './components/paper';
import TabContainer from './components/tabContainer';
import SnackBar from './components/SnackBar';

import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  pageFill: {
    paddingBottom: '2.5rem'
  },
  textField: {
    width: '100%',
    maxWidth: '500px'
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

class ContactsPage extends Component {
  state = {
    value: 0,
    playerName: '',
    openSnackBar: false,
    playerColour: ''
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleColourPickerChange = colour => {
    console.log(colour.hex);
    this.setState({ playerColour: colour.hex });
  };

  onInputChange = event => {
    this.setState({ playerName: event.target.value });
  };

  addPlayerClick = () => {
    if (this.state.playerColour !== '') {
      this.props.addPererittoUser(
        this.state.playerName,
        this.state.playerColour
      );
    } else {
      console.log('Select a colour');
      // this.setState({showSnackBar: true, snackBarMessage: 'Select a colour', snackBarVairant: 'error'});
    }
  };

  onFormSubmit = event => {
    event.preventDefault();
  };

  renderPereritto() {
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
            disabled
            style={{
              marginLeft: '10px',
              color: 'white',
              backgroundColor: '#FF4136'
            }}
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
              value={this.state.playerName}
              onChange={this.onInputChange}
            />
          </form>
        </Grid>
        <Grid item style={{ textAlign: 'center', marginTop: '10px' }}>
          <Typography style={{ marginTop: '10px' }}>
            Select an avatar color for new user
          </Typography>
          <div
            style={{
              display: 'table',
              margin: '0 auto',
              marginTop: '10px'
            }}
          >
            <TwitterPicker
              onChange={this.handleColourPickerChange}
              colors={colours}
              triangle="hide"
              value={this.state.playerColour}
            />
          </div>
        </Grid>
        <Grid item style={{ margin: 'auto' }} />
      </Grid>
    );
  }

  renderSnackBar() {
    const { maintenance } = this.props;

    if (maintenance && maintenance.error) {
      // this.setState({ openSnackBar: true });

      // setTimeout(() => {
      //   this.setState({ openSnackBar: false });
      // }, 4000);

      return (
        <SnackBar
          variant={'error'}
          open={this.state.openSnackBar}
          message={maintenance.error}
        />
      );
    }

    if (maintenance) {
      console.log(maintenance);
    }

    return null;
  }

  renderUsers() {
    return 'Users';
  }

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <div className={classes.pageFill}>
        <Paper title="Maintenance" />
        <Tabs
          value={value}
          onChange={this.handleChange}
          centered
          style={{ backgroundColor: '' }}
        >
          <Tab label="Users" />
          <Tab label="Pereritto" />
        </Tabs>
        {value === 0 && <TabContainer>{this.renderUsers()}</TabContainer>}
        {value === 1 && <TabContainer>{this.renderPereritto()}</TabContainer>}
        {this.renderSnackBar()}
      </div>
    );
  }
}

function mapStateToProps({ maintenance }) {
  return { maintenance };
}

export default connect(
  mapStateToProps,
  actions
)(withStyles(styles)(ContactsPage));
