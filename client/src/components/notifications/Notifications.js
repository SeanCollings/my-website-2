import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import { showMessage } from '../../actions/snackBarActions';
import Loader from 'react-loader-advanced';
import MiniLoader from 'react-loader-spinner';

import RenderGroups from './RenderGroups';
import { MessageTypeEnum } from '../../utils/constants';
import { writeData } from '../../utils/utility';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
// import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
// import ListItemIcon from '@material-ui/core/ListItemIcon';
import Avatar from '@material-ui/core/Avatar';
// import Divider from '@material-ui/core/Divider';
import GroupIcon from '@material-ui/icons/SupervisorAccount';
// import PersonIcon from '@material-ui/icons/Person';
import BackIcon from '@material-ui/icons/ArrowBackIos';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
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
    marginTop: '10px',
    borderRadius: '15px'
  }
});

class Notifications extends Component {
  state = {
    groupHeader: 'All Groups',
    selectedGroup: null,
    groupMembers: null,
    openList: false,
    numberGroupMembers: 0,
    updating: false
  };

  componentDidMount() {
    this.props.getSplashes();
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { notifications, subscriptions } = nextProps;
    const { groupMembers } = this.state;

    if (this.props.notifications.members !== notifications.members) {
      if (notifications.members && notifications.members !== groupMembers) {
        this.setState({ groupMembers: notifications.members });
        return true;
      }
    }

    if (this.props.subscriptions.splashes !== subscriptions.splashes) {
      this.setState({ updating: false });
    }

    return true;
  }

  sendSplash = event => {
    const { selectedGroup } = this.state;

    event.preventDefault();

    if (!navigator.onLine) {
      if ('serviceWorker' in navigator && 'SyncManager' in window) {
        navigator.serviceWorker.ready.then(sw => {
          // Write post to IndexedDB
          writeData('send-splash', { id: selectedGroup._id })
            .then(() => {
              // Register sync event with the service worker
              // Choose id param to distinguish between different sync tasks
              return sw.sync.register('sync-new-splash');
            })
            .then(() => {
              this.props.showMessage(
                MessageTypeEnum.info,
                'Your Splash has been synced!'
              );

              navigator.serviceWorker.addEventListener('message', event => {
                this.props.showMessage(MessageTypeEnum.info, event.data);
              });
            })
            .catch(function(err) {
              console.log(err);
            });
        });
      }
    } else {
      this.props.sendSplashNotification(selectedGroup._id);
      this.setState({ updating: true });
    }
  };

  selectedGroup = group => {
    // this.props.getGroupMembers(group._id);
    this.setState({
      ...this.state,
      groupHeader: `${group.name}`,
      selectedGroup: group,
      numberGroupMembers: group.members.length + 1
    });
  };

  handleListClick() {
    const { openList, groupMembers, selectedGroup } = this.state;
    this.setState({ openList: !openList });

    if (!groupMembers) {
      this.props.getGroupMembers(selectedGroup._id);
    }
  }

  spinner = (
    <span>
      <MiniLoader type="TailSpin" color="#3D9970" height={36} width={36} />
    </span>
  );

  renderSelectedGroup = () => {
    const { subscriptions } = this.props;
    const { groupMembers, openList, numberGroupMembers, updating } = this.state;

    const canSplash = subscriptions.splashes > 0;

    return (
      <div>
        <Loader
          show={updating ? true : false}
          message={this.spinner}
          backgroundStyle={{ backgroundColor: 'transparent' }}
          messageStyle={{ paddingTop: '48px' }}
        >
          <Button
            onClick={event => this.sendSplash(event)}
            style={{
              backgroundColor: '#0074D9',
              color: 'white',
              marginTop: '48px',
              opacity: updating || !canSplash ? '0.4' : '1'
            }}
            disabled={updating || !canSplash ? true : false}
          >
            Send Splash
          </Button>
        </Loader>
        <Typography style={{ paddingTop: '12px', color: 'bisque' }}>
          Splashes Left: {subscriptions.splashes}
        </Typography>
        <Grid
          item
          style={{
            marginTop: '48px',
            backgroundColor: 'white',
            borderRadius: '15px',
            maxWidth: '360px'
          }}
        >
          <List>
            <ListItem button onClick={() => this.handleListClick()}>
              <GroupIcon style={{ opacity: '0.54' }} />
              <ListItemText primary={`Members: ${numberGroupMembers}`} />
              {openList ? (
                <ExpandLess style={{ opacity: '0.54' }} />
              ) : (
                <ExpandMore style={{ opacity: '0.54' }} />
              )}
            </ListItem>
          </List>
          <Collapse in={openList} timeout="auto" unmountOnExit>
            <List>
              {!groupMembers ? (
                <ListItem>
                  <ListItemText primary="Loading members..." />
                </ListItem>
              ) : (
                groupMembers.map(member => {
                  const username = `${member.givenName} ${member.familyName}`;
                  const initial = member.givenName.charAt(0).toUpperCase();
                  return (
                    <ListItem
                      key={member._id}
                      style={{
                        opacity: member.allowNotifications ? '1' : '0.5'
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          src={member.uploadedPhoto}
                          style={{
                            backgroundColor: member.uploadedPhoto
                              ? 'transparent'
                              : '#3D9970',
                            height: '30px',
                            width: '30px'
                          }}
                        >
                          {initial}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={username} />
                    </ListItem>
                  );
                })
              )}
            </List>
          </Collapse>
        </Grid>
      </div>
    );
  };

  render() {
    const { classes, auth, notifications } = this.props;
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
                groupHeader: 'All Groups',
                groupMembers: null,
                openList: false
              })
            }
          >
            <BackIcon
              style={{
                position: 'relative',
                top: '2px',
                height: '14px',
                display: selectedGroup ? '' : 'none'
              }}
            />
            {groupHeader}
          </Typography>
          {selectedGroup ? (
            this.renderSelectedGroup()
          ) : (
            <List className={classes.list}>
              <RenderGroups
                auth={auth}
                groups={notifications.groups}
                selectGroup={this.selectedGroup}
              />
            </List>
          )}
        </Grid>
      </div>
    );
  }
}

function mapStateToProps({
  auth,
  resizeScreen,
  notifications,
  subscriptions,
  maintenance: { users }
}) {
  return {
    auth,
    resizeScreen,
    notifications,
    subscriptions,
    users
  };
}

export default connect(
  mapStateToProps,
  { ...actions, showMessage }
)(withStyles(styles)(Notifications));
