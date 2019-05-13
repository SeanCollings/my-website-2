import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import MaterialTable from 'material-table';

import UpdateUser from './UpdateUser';

import Grid from '@material-ui/core/Grid';
// import Typography from '@material-ui/core/Typography';
// import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
// import List from '@material-ui/core/List';
// import ListItem from '@material-ui/core/ListItem';
// import ListItemAvatar from '@material-ui/core/ListItemAvatar';
// import ListItemText from '@material-ui/core/ListItemText';
// import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

const styles = theme => ({
  disabledButton: {
    opacity: '0.3'
  },
  colorRed: {
    color: 'red'
  }
});

class UpdateUsers extends Component {
  state = { updateEnabled: false };
  componentDidMount() {
    this.props.fetchAllUsers();
  }

  renderAllUsers() {
    const { users, resizeScreen } = this.props;

    const tableStyle = {
      width: '1px',
      whiteSpace: 'nowrap',
      padding: '1px'
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
      },
      {
        title: 'Email Address',
        field: 'email',
        headerStyle: tableStyle,
        cellStyle: tableStyle
      }
    ];

    if (!resizeScreen) {
      columns.unshift({
        title: 'Row',
        field: 'index',
        headerStyle: tableStyle,
        cellStyle: tableStyle
      });
    }

    return (
      <div style={{ paddingLeft: '10px', paddingRight: '10px' }}>
        <MaterialTable
          title="Users Table"
          columns={columns}
          data={
            users !== null && users.length > 0
              ? users.map((user, index) => ({
                  index: index + 1,
                  id: user._id,
                  name: user.givenName,
                  surname: user.familyName,
                  email: user.emailAddress,
                  superUser: user.superUser,
                  pererittoUser: user.pererittoUser
                }))
              : []
          }
          detailPanel={[
            {
              // icon: () => {
              //   return null;
              // },
              render: rowData => {
                return <UpdateUser data={rowData} />;
                // <Typography style={{ paddingLeft: '24px' }}>
                //   Name: {rowData.name}
                //   {rowData.surame}
                //   {rowData.email}
                // </Typography>
                /*<Grid>
                <List>
                  <ListItem dense key={rowData.email}>
                    <ListItemText primary={'Name'} />
                    <ListItemSecondaryAction>
                      <ListItemText primary={rowData.name} />
                    </ListItemSecondaryAction>
                    <ListItemText primary={`Surname: ${rowData.surname}`} />
                    <ListItemSecondaryAction>
                      <ListItemText primary={rowData.name} />
                    </ListItemSecondaryAction>
                    <ListItemText primary={`Email Address: ${rowData.email}`} />
                    <ListItemSecondaryAction>
                      <ListItemText primary={rowData.name} />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </Grid>*/
              }
            }
          ]}
          onRowClick={(event, rowData, togglePanel) => togglePanel()}
          options={{
            rowStyle: {
              height: 'auto'
            }
          }}
        />
      </div>
    );
  }

  render() {
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
