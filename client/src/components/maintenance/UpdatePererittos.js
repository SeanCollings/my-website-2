import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import MaterialTable from 'material-table';

import UpdatePereritto from './UpdatePereritto';
import { MAINTENANCE_MENU } from '../../utils/maintenance';
import TableLoading from './components/tableLoading';

import Grid from '@material-ui/core/Grid';
// import Typography from '@material-ui/core/Typography';
// import MoreVertIcon from '@material-ui/icons/MoreVert';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
// import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  disabledButton: {
    opacity: '0.3'
  },
  colorRed: {
    color: 'red'
  }
});

const ITEM_HEIGHT = 48;

class UpdatePererittos extends Component {
  state = {
    updateEnabled: false,
    anchorEl: null,
    screenType: MAINTENANCE_MENU.PERERITTO_USERS.type,
    options: MAINTENANCE_MENU.PERERITTO_USERS.options,
    selectedOption: MAINTENANCE_MENU.PERERITTO_USERS.options[0],
    selectedUsers: null,
    showSpinner: true
  };

  componentDidMount() {
    const { screenType, options } = this.state;
    this.props.fetchAllUsers([screenType, options[0]]);
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.users !== nextProps.users) {
      this.setState({ selectedUsers: nextProps.users });
      this.setState({ showSpinner: false });
    }

    return true;
  }

  componentDidUpdate() {
    if (!this.state.selectedUsers) {
      this.setState({ selectedUsers: this.props.users });
      this.setState({ showSpinner: false });
    }
  }

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = clickedOption => {
    const { options, selectedOption, screenType } = this.state;

    if (options.includes(clickedOption) && clickedOption !== selectedOption) {
      for (let i = 0; i < options.length; i++) {
        if (options[i] === clickedOption) {
          this.setState({ showSpinner: true });
          this.props.fetchAllUsers([screenType, options[i]]);
          break;
        }
      }

      this.setState({ selectedOption: clickedOption });
    }

    this.setState({ anchorEl: null });
  };

  renderAllUsers() {
    const { resizeScreen } = this.props;
    const { selectedUsers, selectedOption } = this.state;

    const columns = [
      {
        title: 'Name',
        field: 'name'
      },
      {
        title: 'Surname',
        field: 'surname'
      }
    ];

    if (!resizeScreen) {
      columns.unshift({
        title: 'Row',
        field: 'index'
      });
    }

    return (
      <div
        style={{
          paddingLeft: '10px',
          paddingRight: '10px',
          maxWidth: '600px',
          margin: 'auto'
        }}
      >
        <MaterialTable
          title="Pereritto Table"
          columns={columns}
          data={
            selectedUsers !== null && selectedUsers.length > 0
              ? selectedUsers.map((user, index) => ({
                  index: index + 1,
                  _id: user._id,
                  name: user.givenName,
                  surname: user.familyName,
                  pererittoUser: user.pererittoUser,
                  _pereritto: user._pereritto,
                  retired: user.retired
                }))
              : []
          }
          detailPanel={[
            {
              render: rowData => {
                return (
                  <UpdatePereritto
                    data={rowData}
                    selectedOption={selectedOption}
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
              backgroundColor: '#EF6161',
              color: '#DEDEDE'
            }
          }}
          components={
            this.state.showSpinner
              ? {
                  Body: props => <TableLoading />,
                  Header: props => (
                    <TableHead>
                      <TableRow style={{ backgroundColor: '#EF6161' }}>
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
                      </TableRow>
                    </TableHead>
                  )
                }
              : null
          }
        />
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
            maxWidth: '1200px',
            width: '100%',
            margin: 'auto'
          }}
        >
          <Grid
            item
            style={{
              textAlign: 'center'
              // marginTop: '-50px',
              // marginRight: '15px'
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
              // style={{ marginTop: '20px' }}
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
)(withStyles(styles)(UpdatePererittos));
