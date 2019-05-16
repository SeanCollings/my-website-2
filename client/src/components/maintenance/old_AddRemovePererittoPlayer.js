import React, { Component } from 'react';
import { connect } from 'react-redux';
import { /*TwitterPicker*/ CirclePicker } from 'react-color';
import * as actions from '../../actions';
import { showMessage } from '../../actions/snackBarActions';

import { MessageTypeEnum } from '../../utils/constants';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
// import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
// import FormControl from '@material-ui//core/FormControl';
// import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import { fade } from '@material-ui/core/styles/colorManipulator';
// import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';

const styles = theme => ({
  colourSelectError: {
    color: '#FF4136'
  },
  // textField: {
  //   maxWidth: '100%',
  //   width: '400px'
  // },
  formControl: {
    paddingTop: '24px',
    width: '400px',
    maxWidth: '100%'
  },
  select: {
    // paddingLeft: '10px',
    // textAlign: 'center'
    // paddingRight: '10px'
  },
  root: {
    maxHeight: '275px',
    overflow: 'visible'
  },
  search: {
    margin: 'auto',
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginRight: theme.spacing.unit * 2,
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit * 3,
      width: 'auto'
    },
    maxWidth: '400px'
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
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
    userName: '',
    searchedItem: '',
    openSnackBar: false,
    playerColour: '',
    errorColour: false,
    errorName: false,
    userList: [],
    searchedUsers: null
  };

  style = {
    color: this.state.errorColour ? 'red' : 'blue'
  };

  componentDidMount() {
    this.props.fetchAllUsers();
  }

  componentDidUpdate(props) {
    const { users } = this.props;
    let userList = [];

    if (users && users.length > 0) {
      users.map(user => {
        return userList.push(`${user.givenName} ${user.familyName}`);
      });
    }

    if (this.state.userList.length === 0) {
      this.setState({ userList });
    }
  }

  handleColourPickerChange = colour => {
    this.setState({ playerColour: colour.hex, errorColour: false });
  };

  onInputChange = event => {
    this.setState({ playerName: event.target.value });
  };

  handleChange = event => {
    this.setState({ userName: event.target.value });
  };

  onSearchChange = event => {
    this.setState({ searchedItem: event.target.value });

    this.search(event.target.value);
  };

  search = searchTerm => {
    const { userList } = this.state;

    if (searchTerm.length > 1) {
      let lowercasedSearchTerm = searchTerm.toLowerCase();
      let searchedUsers = userList.filter(user => {
        return user.toLowerCase().includes(lowercasedSearchTerm);
      });

      this.setState({ searchedUsers });
      console.log('Search', searchedUsers);
    } else {
      this.setState({ searchedUsers: null });
    }
  };

  addPlayerClick = () => {
    if (this.state.playerName === '') {
      this.props.showMessage(MessageTypeEnum.error, 'Select a name!');
      return this.setState({ errorName: true });
    } else if (this.state.errorName) {
      this.setState({ errorName: false });
    }

    if (this.state.playerColour === '') {
      this.props.showMessage(MessageTypeEnum.error, 'Select a colour!');
      return this.setState({ errorColour: true });
    }

    this.props.addPererittoUser(this.state.playerName, this.state.playerColour);
    this.props.getPererittoUsers();
    this.props.getWinners();
  };

  deletePlayerClick = () => {
    if (this.state.playerName === '') {
      this.props.showMessage(MessageTypeEnum.error, 'Select a name!');
    } else {
      this.props.deletePererittoUser(this.state.playerName);
    }
  };

  onFormSubmit = event => {
    event.preventDefault();
  };

  renderUsers = () => {
    const { users } = this.props;
    if (users.length > 0) {
      return users.map(user => {
        return (
          <MenuItem key={user._id} value={user.givenName}>
            {user.familyName}, {user.givenName}
          </MenuItem>
        );
      });
    }

    return null;
  };

  renderMessage() {
    return (
      <Typography
        style={{
          marginTop: '10px',
          color: this.state.errorColour ? '#FF4136' : ''
        }}
      >
        Select an avatar colour for new player
      </Typography>
    );
  }

  renderSearchMenu = () => {
    const { searchedUsers } = this.state;

    if (searchedUsers) {
      return searchedUsers.map(user => {
        return (
          <MenuItem
            key={user}
            style={{ paddingTop: '3px', paddingBottom: '3px' }}
          >
            {user}
          </MenuItem>
        );
      });
    }
  };

  render() {
    const { classes } = this.props;
    const { searchedUsers } = this.props;

    return (
      <Grid>
        <Grid item style={{ textAlign: 'center', paddingBottom: '24px' }}>
          <Button
            style={{
              marginRight: '10px',
              color: 'white',
              backgroundColor: '#001f3f',
              minWidth: '125px'
            }}
            onClick={this.addPlayerClick}
          >
            Add Player
          </Button>
          <Button
            style={{
              marginLeft: '10px',
              color: 'white',
              backgroundColor: '#FF4136',
              minWidth: '125px'
            }}
            onClick={this.deletePlayerClick}
          >
            Remove Player
          </Button>
        </Grid>
        <Grid item style={{ textAlign: 'center' }}>
          <form onSubmit={this.onFormSubmit}>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search users…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput
                }}
                onChange={this.onSearchChange}
              />
            </div>
            {/* <FormControl className={classes.formControl}>
              <Select
                value={this.state.userName}
                onChange={this.handleChange}
                displayEmpty
                // className={classes.select}
                classes={{ selectMenu: classes.root }}
                MenuProps={{
                  style: { maxHeight: '600px', height: '375px' }
                }}
              >
                <MenuItem value="" disabled>
                  Select User
                </MenuItem>
                {this.renderUsers()}
              </Select>
            </FormControl> */}
            {/* <TextField
              error={this.state.errorName}
              id="outlined-uncontrolled"
              label="Name"
              className={classes.textField}
              margin="normal"
              variant="outlined"
              onChange={this.onInputChange}
            /> */}

            <MenuList
              style={{ padding: '0px' }}
              // style={{
              //   display: searchedUsers && searchedUsers.length > 0 ? '' : 'none'
              // }}
            >
              {this.renderSearchMenu()}
            </MenuList>
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
      </Grid>
    );
  }
}

function mapStateToProps({ maintenance }) {
  return { users: maintenance.users };
}

export default connect(
  mapStateToProps,
  { ...actions, showMessage }
)(withStyles(styles)(AddRemovePererittoPlayer));
