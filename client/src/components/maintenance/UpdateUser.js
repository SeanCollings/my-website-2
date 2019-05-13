import React, { Component } from 'react';

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

const styles = theme => ({
  disabledButton: {
    opacity: '0.3'
  },
  colorRed: {
    color: 'red'
  },
  table: {
    // minWidth: 700
  },
  tableRow: {
    height: '1px',
    whiteSpace: 'nowrap'
  },
  tableCellLeft: {
    paddingRight: '24px',
    width: '50%'
  },
  tableCellRight: {
    width: '50%'
  },
  cssUnderline: {
    borderBottomColor: '#DEDEDE',
    '&:after': {
      borderBottomColor: '#FF4136'
    }
  },
  input: {
    color: '#FFC300'
  }
});

class UpdateUser extends Component {
  constructor(props) {
    super(props);
    this.state = { updateEnabled: false };

    this.nameInput = React.createRef();
    this.surnameInput = React.createRef();
    this.emailInput = React.createRef();
    this.superUserInput = React.createRef();
    this.pererittoInput = React.createRef();
  }

  updateClick = () => {
    this.setState({ updateEnabled: !this.state.updateEnabled });
  };

  saveClick = () => {
    this.setState({ updateEnabled: false });
    console.log(this.nameInput.current.value);
    console.log(this.surnameInput.current.value);
    console.log(this.emailInput.current.value);
    console.log(this.superUserInput.current.checked);
    console.log(this.pererittoInput.current.checked);
  };

  editField = (reference, field) => {
    const { classes } = this.props;

    return (
      <Input
        classes={{
          underline: classes.cssUnderline,
          input: classes.input
        }}
        defaultValue={field}
        inputProps={{ ref: reference }}
      />
    );
  };

  editCheckBox = (reference, value) => {
    // const {classes} = this.props;

    return (
      <Checkbox
        defaultChecked={value}
        inputProps={{ ref: reference }}
        // disabled
        // classes={{
        //   underline: classes.cssUnderline,
        //   input: classes.input
        // }}
      />
    );
  };

  renderContent(data) {
    const { classes } = this.props;
    const { updateEnabled } = this.state;

    return (
      <Table className={classes.table}>
        <TableBody>
          <TableRow className={classes.tableRow}>
            <TableCell
              component="th"
              scope="row"
              align="right"
              className={classes.tableCellLeft}
            >
              Name
            </TableCell>
            <TableCell className={classes.tableCellRight}>
              {updateEnabled
                ? this.editField(this.nameInput, data.name)
                : data.name}
            </TableCell>
          </TableRow>
          <TableRow className={classes.tableRow}>
            <TableCell
              component="th"
              scope="row"
              align="right"
              className={classes.tableCellLeft}
            >
              Surname
            </TableCell>
            <TableCell className={classes.tableCellRight}>
              {updateEnabled
                ? this.editField(this.surnameInput, data.surname)
                : data.surname}
            </TableCell>
          </TableRow>
          <TableRow className={classes.tableRow}>
            <TableCell
              component="th"
              scope="row"
              align="right"
              className={classes.tableCellLeft}
            >
              Email Address
            </TableCell>
            <TableCell className={classes.tableCellRight}>
              {updateEnabled
                ? this.editField(this.emailInput, data.email)
                : data.email}
            </TableCell>
          </TableRow>
          <TableRow className={classes.tableRow}>
            <TableCell
              component="th"
              scope="row"
              align="right"
              className={classes.tableCellLeft}
            >
              Super User
            </TableCell>
            <TableCell className={classes.tableCellRight}>
              {updateEnabled
                ? this.editCheckBox(this.superUserInput, data.superUser)
                : data.superUser
                ? 'Yes'
                : 'No'}
            </TableCell>
          </TableRow>
          <TableRow className={classes.tableRow}>
            <TableCell
              component="th"
              scope="row"
              align="right"
              className={classes.tableCellLeft}
            >
              Pereritto User
            </TableCell>
            <TableCell className={classes.tableCellRight}>
              {updateEnabled
                ? this.editCheckBox(this.pererittoInput, data.pererittoUser)
                : data.pererittoUser
                ? 'Yes'
                : 'No'}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }

  render() {
    const { classes, data } = this.props;

    return (
      <Grid>
        {this.renderContent(data)}
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
              backgroundColor: '#001f3f',
              marginRight: '10px',
              minWidth: '100px'
            }}
            onClick={this.updateClick}
          >
            {this.state.updateEnabled ? 'Cancel' : 'Update'}
          </Button>
          <Button
            disabled={this.state.updateEnabled ? false : true}
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

export default withStyles(styles)(UpdateUser);
