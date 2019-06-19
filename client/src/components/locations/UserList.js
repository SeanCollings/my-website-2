import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Avatar from '@material-ui/core/Avatar';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';

class UserList extends Component {
  state = { newGroupMembers: [] };

  componentDidMount() {
    const { auth, userList } = this.props;

    // Get all users
    if (auth.superUser) this.props.fetchAllUsers(['User Groups']);
    if (userList) this.setState({ newGroupMembers: userList });
  }

  handleChange = id => {
    const { newGroupMembers } = this.state;
    let found = newGroupMembers.includes(id);

    if (found) {
      const newUserList = newGroupMembers.filter(x => x !== id);
      this.setState({ newGroupMembers: newUserList });
      this.props.setUserList(newUserList);
    } else {
      const newUserList = [...newGroupMembers, id];
      this.setState({ newGroupMembers: newUserList });
      this.props.setUserList(newUserList);
    }
  };

  render() {
    const { maintenance, auth, checkboxColor, avatarColor } = this.props;
    const { newGroupMembers } = this.state;

    if (!maintenance.users)
      return <Typography>No users to display...</Typography>;
    else if (maintenance.users.length === 0)
      return <Typography>Loading users...</Typography>;

    return maintenance.users.map(user => {
      const initial = user.givenName.charAt(0).toUpperCase();
      const username = `${user.givenName} ${user.familyName}`;
      const display = user._id === auth._id ? 'none' : '';
      return (
        <ListItem key={user._id} style={{ display }}>
          <ListItemAvatar>
            {user.uploadedPhoto ? (
              <Avatar
                src={user.uploadedPhoto}
                style={{ width: '30px', height: '30px' }}
              />
            ) : (
              <Avatar
                style={{
                  width: '30px',
                  height: '30px',
                  backgroundColor: avatarColor
                }}
              >
                {initial}
              </Avatar>
            )}
          </ListItemAvatar>
          <ListItemText primary={username} />
          <ListItemSecondaryAction style={{ display }}>
            <Checkbox
              edge="end"
              onChange={() => this.handleChange(user._id)}
              checked={newGroupMembers.includes(user._id)}
              id={user._id}
              style={{
                color: checkboxColor
              }}
            />
          </ListItemSecondaryAction>
        </ListItem>
      );
    });
  }
}

function mapStateToProps({ maintenance, auth }) {
  return {
    maintenance,
    auth
  };
}

export default connect(
  mapStateToProps,
  actions
)(UserList);
