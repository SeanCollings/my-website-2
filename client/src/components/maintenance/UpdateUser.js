import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';

import Grid from '@material-ui/core/Grid';
// import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
// import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Input from '@material-ui/core/Input';
import Checkbox from '@material-ui/core/Checkbox';
import green from '@material-ui/core/colors/green';

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

class UpdateUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      updateEnabled: false,
      preventSave: false
    };

    this.nameInput = React.createRef();
    this.surnameInput = React.createRef();
    this.emailInput = React.createRef();
    this.splashInput = React.createRef();
    this.superUserInput = React.createRef();
    this.pererittoInput = React.createRef();
    this.pereryvInput = React.createRef();
  }

  updateClick = () => {
    this.setState({ updateEnabled: !this.state.updateEnabled });
  };

  preventSave() {
    if (this.nameInput.current.value.length === 0)
      return this.setState({ preventSave: true });
    else if (this.surnameInput.current.value.length === 0)
      return this.setState({ preventSave: true });
    else if (this.emailInput.current.value.length === 0)
      return this.setState({ preventSave: true });

    return this.setState({ preventSave: false });
  }

  saveClick = () => {
    this.setState({ updateEnabled: false });

    const attributes = {
      id: this.props.data.id,
      body: {
        givenName: this.nameInput.current.value,
        familyName: this.surnameInput.current.value,
        emailAddress: this.emailInput.current.value,
        splashes: this.splashInput.current.value,
        superUser: this.superUserInput.current.checked,
        pererittoUser: this.pererittoInput.current.checked,
        pereryvUser: this.pereryvInput.current.checked
      }
    };

    if (!this.state.preventSave) {
      this.props.updateUser(attributes);
      // this.props.fetchAllUsers([this.state.screen, this.state.options[0]]);
      this.props.updateList();
    }
  };

  editField = (reference, field, isNumber) => {
    const { classes } = this.props;

    return (
      <Input
        disableUnderline
        readOnly={this.state.updateEnabled ? false : true}
        classes={{
          input: classes.input,
          root: classes.rootInput
        }}
        style={{
          color: !this.state.updateEnabled ? '#AAAAAA' : '',
          height: '0px'
        }}
        defaultValue={field}
        inputProps={{ ref: reference }}
        onChange={() => this.preventSave()}
        type={isNumber ? 'number' : ''}
      />
    );
  };

  editCheckBox = (reference, value) => {
    const { classes } = this.props;

    return (
      <Checkbox
        disabled={!this.state.updateEnabled}
        style={{ height: '0px' }}
        defaultChecked={value}
        inputProps={{ ref: reference }}
        classes={{
          root: this.state.updateEnabled ? classes.rootCheckbox : '',
          checked: classes.checked
        }}
      />
    );
  };

  renderContent(data, lastLoginSelected) {
    const { classes } = this.props;

    if (lastLoginSelected) {
      const loginDate = new Date(data.lastLogin).toLocaleString('en-GB');
      return (
        <Table className={classes.table}>
          <TableBody>
            <TableRow className={classes.tableRow}>
              <TableCell
                component="th"
                scope="row"
                align="left"
                className={classes.tableCellLeft}
                classes={{ root: classes.table }}
              >
                {`${loginDate}`}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
    }
    return (
      <Table className={classes.table}>
        <TableBody>
          <TableRow className={classes.tableRow}>
            <TableCell
              component="th"
              scope="row"
              align="right"
              className={classes.tableCellLeft}
              classes={{ root: classes.table }}
            >
              Name:
            </TableCell>
            <TableCell
              className={classes.tableCellRight}
              classes={{ root: classes.table }}
            >
              {this.editField(this.nameInput, data.name)}
            </TableCell>
          </TableRow>
          <TableRow className={classes.tableRow}>
            <TableCell
              component="th"
              scope="row"
              align="right"
              className={classes.tableCellLeft}
              classes={{ root: classes.table }}
            >
              Surname:
            </TableCell>
            <TableCell
              className={classes.tableCellRight}
              classes={{ root: classes.table }}
            >
              {this.editField(this.surnameInput, data.surname)}
            </TableCell>
          </TableRow>
          <TableRow className={classes.tableRow}>
            <TableCell
              component="th"
              scope="row"
              align="right"
              className={classes.tableCellLeft}
              classes={{ root: classes.table }}
            >
              Email Address:
            </TableCell>
            <TableCell
              className={classes.tableCellRight}
              classes={{ root: classes.table }}
            >
              {this.editField(this.emailInput, data.email)}
            </TableCell>
          </TableRow>
          <TableRow className={classes.tableRow}>
            <TableCell
              component="th"
              scope="row"
              align="right"
              className={classes.tableCellLeft}
              classes={{ root: classes.table }}
            >
              Splashes:
            </TableCell>
            <TableCell
              className={classes.tableCellRight}
              classes={{ root: classes.table }}
            >
              {this.editField(this.splashInput, data.splashes, true)}
            </TableCell>
          </TableRow>
          <TableRow className={classes.tableRow}>
            <TableCell
              component="th"
              scope="row"
              align="right"
              className={classes.tableCellLeft}
              classes={{ root: classes.table }}
            >
              Super User:
            </TableCell>
            <TableCell
              className={classes.tableCellRight}
              style={{ paddingLeft: 'inherit' }}
              classes={{ root: classes.table }}
            >
              {this.editCheckBox(this.superUserInput, data.superUser)}
            </TableCell>
          </TableRow>
          <TableRow className={classes.tableRow}>
            <TableCell
              component="th"
              scope="row"
              align="right"
              className={classes.tableCellLeft}
              classes={{ root: classes.table }}
            >
              Pereritto User:
            </TableCell>
            <TableCell
              className={classes.tableCellRight}
              classes={{ root: classes.table }}
              style={{ paddingLeft: 'inherit' }}
            >
              {this.editCheckBox(this.pererittoInput, data.pererittoUser)}
            </TableCell>
          </TableRow>
          <TableRow className={classes.tableRow}>
            <TableCell
              component="th"
              scope="row"
              align="right"
              className={classes.tableCellLeft}
              classes={{ root: classes.table }}
            >
              Pereryv User:
            </TableCell>
            <TableCell
              className={classes.tableCellRight}
              classes={{ root: classes.table }}
              style={{ paddingLeft: 'inherit' }}
            >
              {this.editCheckBox(this.pereryvInput, data.pereryvUser)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }

  render() {
    const { classes, data, lastLoginSelected } = this.props;

    return (
      <Grid style={{ paddingRight: '10px' }}>
        {this.renderContent(data, lastLoginSelected)}
        <Grid
          item
          style={{
            paddingBottom: '5px',
            paddingTop: '5px',
            textAlign: 'center',
            display: lastLoginSelected ? 'none' : ''
          }}
        >
          <Button
            size="small"
            style={{
              color: 'white',
              backgroundColor: !this.state.updateEnabled
                ? '#001f3f'
                : '#FF4136',
              marginRight: '10px',
              minWidth: '100px'
            }}
            onClick={this.updateClick}
          >
            {this.state.updateEnabled ? 'Cancel' : 'Update'}
          </Button>
          <Button
            disabled={
              (this.state.preventSave ? true : false) ||
              (this.state.updateEnabled ? false : true)
            }
            size="small"
            style={{
              marginLeft: '10px',
              color: 'white',
              backgroundColor: '#2ECC40',
              minWidth: '100px'
            }}
            classes={{ disabled: classes.disabledButton }}
            onClick={this.saveClick}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    );
  }
}

export default connect(
  null,
  actions
)(withStyles(styles)(UpdateUser));
