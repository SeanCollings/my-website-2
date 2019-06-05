import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Avatar from '@material-ui/core/Avatar';
import Checkbox from '@material-ui/core/Checkbox';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  pageFill: {
    paddingBottom: '2.5rem',
    maxWidth: '100%'
  },
  list: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: 'white',
    marginTop: '10px'
  }
});

class NotificationAdmin extends Component {
  state = {
    createGroup: false,
    newGroupMembers: []
  };

  componentDidMount() {
    // Get all users
    this.props.fetchAllUsers(['User Groups']);
  }

  createGroup = () => {
    // console.log('Create Group with members', this.state.newGroupMembers);
    this.setState({ createGroup: true });
  };

  cancelCreateGroup = () => {
    this.setState({ ...this.state, createGroup: false, newGroupMembers: null });
  };

  handleChange = e => {
    const { newGroupMembers } = this.state;
    const item = e.target.id;
    let memberMap = {};

    if (newGroupMembers.hasOwnProperty(item)) {
      memberMap[item] = false;
    } else {
      memberMap[item] = true;
    }
    console.log(newGroupMembers);
    this.setState({ newGroupMembers: { ...newGroupMembers, memberMap } });
  };

  renderUsersList = () => {
    const { maintenance } = this.props;
    const { newGroupMembers } = this.state;

    if (!maintenance.users) return null;

    return maintenance.users.map(user => {
      return (
        <ListItem key={user._id}>
          <ListItemAvatar>
            <Avatar style={{ width: '30px', height: '30px' }}>U</Avatar>
          </ListItemAvatar>
          <ListItemText primary={`${user.givenName} ${user.familyName}`} />
          <ListItemSecondaryAction>
            <Checkbox
              edge="end"
              onChange={this.handleChange}
              checked={newGroupMembers[user._id]}
              id={user._id}
              // inputProps={{ 'aria-labelledby': labelId }}
            />
          </ListItemSecondaryAction>
        </ListItem>
      );
    });
  };

  renderCreateGroup = () => {
    return (
      <div>
        <Button
          onClick={() => this.cancelCreateGroup()}
          style={{
            backgroundColor: '#FF4136',
            color: 'white'
          }}
        >
          Cancel
        </Button>
        <Grid
          item
          style={{
            paddingTop: '12px',
            marginLeft: '24px',
            marginRight: '24px',
            marginTop: '12px',
            backgroundColor: 'white'
          }}
        >
          <Typography>Group Name:</Typography>
          <Typography>Group Icon:</Typography>
          <Typography>Select Members:</Typography>
          <List>{this.renderUsersList()}</List>
        </Grid>
      </div>
    );
  };

  renderMyGroups = () => {
    const { notifications } = this.props;

    if (!notifications.groups || notifications.groups.length === 0)
      return <Typography>You haven't created any groups yet...</Typography>;

    return notifications.groups.map(group => {
      return (
        <ListItem key={group.createdBy}>
          <ListItemAvatar>
            <Avatar>G</Avatar>
          </ListItemAvatar>
          <ListItemText primary="Group Name" secondary="Members: 1" />
        </ListItem>
      );
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <div style={{ paddingTop: ' 24px' }}>
        {this.state.createGroup ? (
          this.renderCreateGroup()
        ) : (
          <div>
            <Button
              onClick={() => this.createGroup()}
              style={{
                backgroundColor: '#3D9970',
                color: 'white'
              }}
            >
              Create Group
            </Button>
            <Grid
              item
              style={{
                paddingTop: '24px',
                marginLeft: '24px',
                marginRight: '24px'
              }}
            >
              <Typography style={{ color: 'bisque' }}>My Groups</Typography>
              <List className={classes.list}>{this.renderMyGroups()}</List>
            </Grid>
          </div>
        )}
      </div>
    );
  }
}

function mapStateToProps({ resizeScreen, notifications, maintenance }) {
  return {
    resizeScreen,
    notifications,
    maintenance
  };
}

export default connect(
  mapStateToProps,
  actions
)(withStyles(styles)(NotificationAdmin));
