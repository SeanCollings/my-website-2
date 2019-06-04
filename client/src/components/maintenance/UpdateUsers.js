import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import MaterialTable from 'material-table';
import Loader from 'react-loader-advanced';

import TableLoading from './components/tableLoading';
import UpdateUser from './UpdateUser';
import { MAINTENANCE_MENU } from '../../utils/maintenance';

import Grid from '@material-ui/core/Grid';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
// import Typography from '@material-ui/core/Typography';
// import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  disabledButton: {
    opacity: '0.3'
  }
});

const ITEM_HEIGHT = 48;

class UpdateUsers extends Component {
  state = {
    updateEnabled: false,
    anchorEl: null,
    screenType: MAINTENANCE_MENU.ALL_USERS.type,
    options: MAINTENANCE_MENU.ALL_USERS.options,
    selectedOption: MAINTENANCE_MENU.ALL_USERS.options[0],
    selectedUsers: null,
    showSpinner: true,
    lastLoginSelected: false
  };

  componentDidMount() {
    const { screenType, options } = this.state;
    this.props.fetchAllUsers([screenType, options[0]]);
  }

  componentDidUpdate() {
    if (!this.state.selectedUsers) {
      this.setState({ selectedUsers: this.props.users });
      this.setState({ showSpinner: false });
    }

    // if (!this.state.originalUsers) {
    //   this.setState({ originalUsers: this.props.users });
    // }
  }

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = clickedOption => {
    const { options, selectedOption } = this.state;
    const { users } = this.props;

    if (options.includes(clickedOption) && clickedOption !== selectedOption) {
      let selectedUsers = [];
      switch (clickedOption) {
        case MAINTENANCE_MENU.ALL_USERS.options[0]:
          this.setState({
            ...this.state,
            selectedUsers: users,
            lastLoginSelected: false
          });
          break;
        case MAINTENANCE_MENU.ALL_USERS.options[1]:
          for (let i = 0; i < users.length; i++) {
            if (users[i].superUser) selectedUsers.push(users[i]);
          }
          this.setState({
            ...this.state,
            selectedUsers,
            lastLoginSelected: false
          });
          break;
        case MAINTENANCE_MENU.ALL_USERS.options[2]:
          for (let i = 0; i < users.length; i++) {
            if (users[i].pererittoUser) selectedUsers.push(users[i]);
          }
          this.setState({
            ...this.state,
            selectedUsers,
            lastLoginSelected: false
          });
          break;
        case MAINTENANCE_MENU.ALL_USERS.options[3]:
          for (let i = 0; i < users.length; i++) {
            if (users[i].lastLogin) selectedUsers.push(users[i]);
          }
          selectedUsers.sort(function(a, b) {
            a = new Date(a.lastLogin);
            b = new Date(b.lastLogin);
            return b - a;
          });
          this.setState({
            ...this.state,
            selectedUsers,
            lastLoginSelected: true
          });
          break;
        default:
          this.setState({
            ...this.state,
            selectedUsers,
            lastLoginSelected: false
          });
          break;
      }

      this.setState({ selectedOption: clickedOption });
    }
    this.setState({ anchorEl: null });
  };

  renderAllUsers() {
    const { resizeScreen } = this.props;
    const {
      selectedUsers,
      screenType,
      selectedOption,
      lastLoginSelected
    } = this.state;

    const tableStyle = {
      width: '1px',
      whiteSpace: 'nowrap',
      padding: '0px',
      paddingRight: '10px'
    };

    const columns = [
      {
        title: 'Name',
        field: 'name',
        headerStyle: tableStyle,
        cellStyle: tableStyle
      },
      {
        title: 'Surname',
        field: 'surname',
        headerStyle: tableStyle,
        cellStyle: tableStyle
      }
      // {
      //   title: 'Email Address',
      //   field: 'email',
      //   headerStyle: tableStyle,
      //   cellStyle: tableStyle
      // }
    ];

    if (!resizeScreen) {
      columns.unshift({
        title: 'Row',
        field: 'index',
        headerStyle: tableStyle,
        cellStyle: tableStyle
      });

      columns.push({
        title: 'Email Address',
        field: 'email',
        headerStyle: tableStyle,
        cellStyle: tableStyle
      });
    }

    return (
      <div
        style={{
          paddingLeft: '10px',
          paddingRight: '10px',
          maxWidth: '1200px',
          margin: 'auto'
        }}
      >
        <Loader show={false}>
          <MaterialTable
            title="Users Table"
            columns={columns}
            data={
              selectedUsers !== null && selectedUsers.length > 0
                ? selectedUsers.map((user, index) => ({
                    index: index + 1,
                    id: user._id,
                    name: user.givenName,
                    surname: user.familyName,
                    email: user.emailAddress,
                    superUser: user.superUser,
                    pererittoUser: user.pererittoUser,
                    lastLogin: user.lastLogin
                  }))
                : []
            }
            detailPanel={[
              {
                // icon: () => {
                //   return null;
                // },
                render: rowData => {
                  return (
                    <UpdateUser
                      data={rowData}
                      lastLoginSelected={lastLoginSelected}
                      updateList={() => {
                        // this.setState({ showSpinner: true });
                        this.props.fetchAllUsers([screenType, selectedOption]);
                      }}
                    />
                  );
                }
              }
            ]}
            onRowClick={(event, rowData, togglePanel) => togglePanel()}
            options={{
              rowStyle: {
                height: 'auto'
              },
              headerStyle: {
                backgroundColor: '#2980B9',
                color: '#DEDEDE'
              }
            }}
            components={
              this.state.showSpinner
                ? {
                    Body: props => <TableLoading />,
                    Header: props => (
                      <TableHead>
                        <TableRow style={{ backgroundColor: '#2980B9' }}>
                          {/* <TableCell style={{    paddingRight: '0px'}}></TableCell> */}
                          <TableCell
                            style={{
                              paddingRight: '0px',
                              color: '#DEDEDE',
                              display: resizeScreen ? 'none' : ''
                            }}
                          >
                            Row
                          </TableCell>
                          <TableCell
                            style={{ paddingRight: '0px', color: '#DEDEDE' }}
                          >
                            Name
                          </TableCell>
                          <TableCell
                            style={{ paddingRight: '0px', color: '#DEDEDE' }}
                          >
                            Surname
                          </TableCell>
                          <TableCell
                            style={{
                              whiteSpace: 'nowrap',
                              color: '#DEDEDE',
                              display: resizeScreen ? 'none' : ''
                            }}
                          >
                            Email Address
                          </TableCell>
                        </TableRow>
                      </TableHead>
                    )
                  }
                : null
            }
          />
        </Loader>
      </div>
    );
  }

  render() {
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);

    return (
      <Grid>
        <Grid
          item
          style={{
            textAlign: 'left',
            maxWidth: '100%',
            width: '100%',
            margin: 'auto'
          }}
        >
          <Grid
            item
            style={{
              textAlign: 'center'
            }}
          >
            <IconButton
              aria-label="More"
              aria-owns={open ? 'long-menu' : undefined}
              aria-haspopup="true"
              onClick={this.handleClick}
              style={{ color: '#DEDEDE', right: 0 }}
            >
              <MoreHorizIcon />
            </IconButton>
            <Menu
              id="long-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={this.handleClose}
              PaperProps={{
                style: {
                  maxHeight: ITEM_HEIGHT * 4.5,
                  width: 200
                }
              }}
            >
              {this.state.options.map(option => (
                <MenuItem
                  key={option}
                  selected={option === this.state.selectedOption}
                  onClick={() => this.handleClose(option)}
                >
                  {option}
                </MenuItem>
              ))}
            </Menu>
          </Grid>
          {this.renderAllUsers()}
        </Grid>
      </Grid>
    );
  }
}

function mapStateToProps({ maintenance, resizeScreen }) {
  return { users: maintenance.users, resizeScreen };
}

export default connect(
  mapStateToProps,
  actions
)(withStyles(styles)(UpdateUsers));
