import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
// import List from '@material-ui/core/List';
// import ListItem from '@material-ui/core/ListItem';
// import ListItemAvatar from '@material-ui/core/ListItemAvatar';
// import ListItemText from '@material-ui/core/ListItemText';
// import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

class UpdateUsers extends Component {
  componentDidMount() {
    this.props.fetchAllUsers();
  }

  renderAllUsers() {
    const { users } = this.props;

    if (users !== null && users.length > 1) {
      return users.map((user, index) => {
        const details = `${index + 1}. ${user.givenName} ${user.familyName} - ${
          user.emailAddress
        } ${user.pererittoUser ? '1' : '0'}`;
        return (
          <Grid key={index}>
            <Typography>{details}</Typography>
          </Grid>
        );
      });
    }

    return <Typography>Retrieving user list...</Typography>;
  }

  render() {
    return (
      <Grid>
        <Grid
          item
          style={{ textAlign: 'left', maxWidth: '100%', width: '360px' }}
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
)(UpdateUsers);
