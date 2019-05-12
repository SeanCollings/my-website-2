import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import MaterialTable from 'material-table';

import Grid from '@material-ui/core/Grid';
// import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
// import List from '@material-ui/core/List';
// import ListItem from '@material-ui/core/ListItem';
// import ListItemAvatar from '@material-ui/core/ListItemAvatar';
// import ListItemText from '@material-ui/core/ListItemText';
// import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

const styles = theme => ({
  disabledButton: {
    opacity: '0.3'
  }
});

class UpdateUsers extends Component {
  state = { updateEnabled: false };
  componentDidMount() {
    this.props.fetchAllUsers();
  }

  updateClick = () => {
    this.setState({ updateEnabled: true });
  };

  saveClick = () => {
    console.log('SAVE CLICKED!');
  };

  renderDetails = rowData => {
    return <div>{rowData.name}</div>;
  };

  renderAllUsers() {
    const { users } = this.props;

    const tableStyle = {
      width: '1px',
      whiteSpace: 'nowrap',
      padding: '5px'
    };

    // if (users !== null && users.length > 1) {
    return (
      <div style={{ paddingLeft: '10px', paddingRight: '10px' }}>
        <MaterialTable
          title="Users Table"
          columns={[
            {
              title: 'Idx',
              field: 'index',
              headerStyle: tableStyle,
              cellStyle: tableStyle
            },
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
          ]}
          data={
            users !== null && users.length > 0
              ? users.map((user, index) => ({
                  index: index + 1,
                  name: user.givenName,
                  surname: user.familyName,
                  email: user.emailAddress
                }))
              : []
          }
          detailPanel={rowData => {
            return this.renderDetails(rowData);
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
          }}
          onRowClick={(event, rowData, togglePanel) => togglePanel()}
          options={{
            rowStyle: {
              // backgroundColor: '#DEDEDE'
            }
          }}
        />
      </div>
    );
  }

  render() {
    const { classes } = this.props;

    return (
      <Grid>
        <Grid
          item
          style={{
            paddingBottom: '24px',
            textAlign: 'center'
          }}
        >
          <Button
            style={{
              color: 'white',
              backgroundColor: '#001f3f',
              marginRight: '10px',
              minWidth: '125px'
            }}
            onClick={this.updateClick}
          >
            Update
          </Button>
          <Button
            disabled={this.state.updateEnabled ? false : true}
            style={{
              marginLeft: '10px',
              color: 'white',
              backgroundColor: '#2ECC40',
              minWidth: '125px'
            }}
            classes={{ disabled: classes.disabledButton }}
            onClick={this.saveClick}
          >
            Save
          </Button>
        </Grid>
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

function mapStateToProps({ maintenance }) {
  return { users: maintenance.users };
}

export default connect(
  mapStateToProps,
  actions
)(withStyles(styles)(UpdateUsers));
