import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import GroupIcon from '@material-ui/icons/SupervisorAccount';
import Button from '@material-ui/core/Button';
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

class Notifications extends Component {
  state = { groupHeader: 'Groups', selectedGroup: null };

  sendSplash = event => {
    const { selectedGroup } = this.state;

    event.preventDefault();
    this.props.testNotification(selectedGroup._id);
  };

  selectedGroup = group => {
    this.setState({
      ...this.state,
      groupHeader: `Group: ${group.name}`,
      selectedGroup: group
    });
  };

  renderSelectedGroup = () => {
    // const { selectedGroup } = this.state;

    return (
      <Button
        onClick={event => this.sendSplash(event)}
        style={{
          backgroundColor: '#0074D9',
          color: 'white',
          marginTop: '96px'
        }}
      >
        Send Splash
      </Button>
    );
  };

  renderGroups = () => {
    const { notifications } = this.props;

    if (!notifications.groups || notifications.groups.length === 0)
      return <Typography>You're not apart of any groups yet...</Typography>;

    const groupsLength = notifications.groups.length;
    return notifications.groups.map((group, index) => {
      const members = group.members.length;
      const initial = group.name.charAt(0).toUpperCase();
      return (
        <div key={group._id}>
          <ListItem button onClick={() => this.selectedGroup(group)}>
            <ListItemAvatar>
              <Avatar
                src={group.icon}
                style={{
                  backgroundColor: group.icon ? 'transparent' : '#3D9970'
                }}
              >
                {initial}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={group.name}
              secondary={`Members: ${members}`}
            />
            <ListItemSecondaryAction>
              <ListItemIcon>
                <GroupIcon />
              </ListItemIcon>
            </ListItemSecondaryAction>
          </ListItem>
          {groupsLength === index + 1 ? null : (
            <Divider variant="inset" component="li" />
          )}
        </div>
      );
    });
  };

  render() {
    const { classes } = this.props;
    const { groupHeader, selectedGroup } = this.state;

    return (
      <div style={{ paddingTop: ' 12px' }}>
        <Grid
          item
          style={{
            paddingTop: '12px',
            marginLeft: '24px',
            marginRight: '24px'
          }}
        >
          <Typography
            style={{ color: 'bisque' }}
            onClick={() =>
              this.setState({
                ...this.state,
                selectedGroup: null,
                groupHeader: 'Groups'
              })
            }
          >
            {groupHeader}
          </Typography>
          {selectedGroup ? (
            this.renderSelectedGroup()
          ) : (
            <List className={classes.list}>{this.renderGroups()}</List>
          )}
        </Grid>
      </div>
    );
  }
}

function mapStateToProps({ resizeScreen, notifications }) {
  return {
    resizeScreen,
    notifications
  };
}

export default connect(
  mapStateToProps,
  actions
)(withStyles(styles)(Notifications));
