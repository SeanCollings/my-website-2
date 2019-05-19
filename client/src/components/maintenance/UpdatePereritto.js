import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import { showMessage } from '../../actions/snackBarActions';
import { MessageTypeEnum } from '../../utils/constants';
import { MAINTENANCE_MENU } from '../../utils/maintenance';

import Grid from '@material-ui/core/Grid';
// import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
// import Table from '@material-ui/core/Table';
// import TableBody from '@material-ui/core/TableBody';
// import TableCell from '@material-ui/core/TableCell';
// import TableHead from '@material-ui/core/TableHead';
// import TableRow from '@material-ui/core/TableRow';
// import Input from '@material-ui/core/Input';
// import Checkbox from '@material-ui/core/Checkbox';
import green from '@material-ui/core/colors/green';
import Typography from '@material-ui/core/Typography';
import { /*TwitterPicker*/ CirclePicker } from 'react-color';

const styles = theme => ({
  disabledButton: {
    opacity: '0.3'
  },
  colorRed: {
    color: 'red'
  },
  table: {
    borderBottom: '0px'
  },
  tableRow: {
    height: '1px',
    whiteSpace: 'nowrap',
    borderBottom: 'none'
  },
  tableCellLeft: {
    paddingRight: '24px',
    width: '50%'
  },
  tableCellRight: {
    width: '50%',
    paddingLeft: '15px'
  },
  rootCheckbox: {
    color: green[600],
    '&$checked': {
      color: green[500]
    }
  },
  checked: {},
  rootInput: {
    padding: '0px',
    fontSize: '0.8125rem'
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

class UpdateUser extends Component {
  state = {
    playerColour: '',
    errorColour: false,
    screenType: MAINTENANCE_MENU.PERERITTO_USERS.type,
    options: MAINTENANCE_MENU.PERERITTO_USERS.options
  };

  handleColourPickerChange = colour => {
    this.setState({ playerColour: colour.hex, errorColour: false });
  };

  addPlayerClick = () => {
    const { playerColour } = this.state;
    const { _id, name, _pereritto } = this.props.data;

    if (playerColour === '') {
      this.props.showMessage(MessageTypeEnum.error, 'Select a colour!');
      return this.setState({ errorColour: true });
    }

    this.props.addPererittoUser(_id, name, playerColour, _pereritto);

    // this.props.getPererittoUsers();
    // NEED TO ADD A SPINNER TO CHECK COMPLETION OF CALL
    // if complete, rerender
    // this.props.fetchAllUsers([screenType, options[1]]);
  };

  deletePlayerClick = () => {
    const { playerName, screenType, options } = this.state;
    if (playerName === '') {
      this.props.showMessage(MessageTypeEnum.error, 'Select a name!');
    } else {
      this.props.deletePererittoUser(
        this.props.data._id,
        this.props.data._pereritto
      );
      this.props.fetchAllUsers([screenType, options[0]]);
    }
  };

  renderMessage() {
    return (
      <Typography
        style={{
          color: this.state.errorColour ? '#FF4136' : ''
        }}
      >
        Select an avatar colour for new player
      </Typography>
    );
  }

  renderContent = () => {
    return (
      <Grid
        item
        style={{
          textAlign: 'center',
          marginTop: '5px',
          display:
            this.props.selectedOption === this.state.options[0] ? 'none' : ''
        }}
      >
        {this.renderMessage()}
        <div
          style={{
            margin: '0 auto',
            marginTop: '10px',
            marginBottom: '10px',
            marginLeft: '20px',
            display: 'inline-block'
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
    );
  };

  render() {
    const { playerColour } = this.state;

    return (
      <Grid>
        {this.renderContent()}
        <Grid
          item
          style={{
            paddingBottom: '5px',
            paddingTop: '5px',
            textAlign: 'center'
          }}
        >
          <Button
            size="small"
            style={{
              color: 'white',
              backgroundColor: playerColour === '' ? '#001f3f' : playerColour,
              marginRight: '10px',
              minWidth: '100px',
              display:
                this.props.selectedOption === this.state.options[0]
                  ? 'none'
                  : ''
            }}
            onClick={this.addPlayerClick}
          >
            {playerColour === '' ? 'Pick a colour' : 'Add to Board'}
          </Button>
          <Button
            size="small"
            style={{
              marginLeft: '10px',
              color: 'white',
              backgroundColor: '#FF4136',
              minWidth: '100px',
              display:
                this.props.selectedOption === this.state.options[1]
                  ? 'none'
                  : ''
            }}
            onClick={this.deletePlayerClick}
          >
            Remove Player
          </Button>
        </Grid>
      </Grid>
    );
  }
}

export default connect(
  null,
  { ...actions, showMessage }
)(withStyles(styles)(UpdateUser));
