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
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import Divider from '@material-ui/core/Divider';

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
  },
  textField: {
    width: 200
  }
});

class NotificationAdmin extends Component {
  state = {
    createGroup: false,
    errorGroupName: false,
    groupName: '',
    groupIcon: null,
    newGroupMembers: []
  };

  componentDidMount() {
    // Get all users
    this.props.fetchAllUsers(['User Groups']);
  }

  createGroup = () => {
    this.setState({ createGroup: true });
  };

  createClick = () => {
    const { groupName, newGroupMembers, groupIcon } = this.state;

    if (groupName.length === 0) return this.setState({ errorGroupName: true });

    this.props.createNotificationGroup(groupName, groupIcon, newGroupMembers);
    this.cancelCreateGroup();
  };

  cancelCreateGroup = () => {
    this.setState({
      ...this.state,
      createGroup: false,
      newGroupMembers: [],
      groupIcon: null,
      groupName: ''
    });
  };

  handleChange = id => {
    const { newGroupMembers } = this.state;
    let found = newGroupMembers.includes(id);

    if (found) {
      this.setState({ newGroupMembers: newGroupMembers.filter(x => x !== id) });
    } else {
      this.setState({ newGroupMembers: [...newGroupMembers, id] });
    }
  };

  renderUsersList = () => {
    const { maintenance, auth } = this.props;
    const { newGroupMembers } = this.state;

    if (!maintenance.users) return null;

    return maintenance.users.map(user => {
      const initial = user.givenName.charAt(0).toUpperCase();
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
              <Avatar style={{ width: '30px', height: '30px' }}>
                {initial}
              </Avatar>
            )}
          </ListItemAvatar>
          <ListItemText primary={`${user.givenName} ${user.familyName}`} />
          <ListItemSecondaryAction style={{ display }}>
            <Checkbox
              edge="end"
              onChange={() => this.handleChange(user._id)}
              checked={newGroupMembers.includes(user._id)}
              id={user._id}
              style={{
                color: '#3D9970'
              }}
            />
          </ListItemSecondaryAction>
        </ListItem>
      );
    });
  };

  uploadImageToScreen = event => {
    if (event && event.target && event.target.files[0]) {
      const image = event.target.files[0];
      const imageType = image.type;

      const reader = new FileReader();
      reader.readAsArrayBuffer(image);

      reader.onload = event => {
        var blob = new Blob([event.target.result]);
        window.URL = window.URL || window.webkitURL;
        var blobURL = window.URL.createObjectURL(blob);
        var image = new Image();
        image.src = blobURL;
        image.onload = () => {
          const width = 50;
          const scaleFactor = width / image.width;
          const height = image.height * scaleFactor;

          let canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          var ctx = canvas.getContext('2d');
          ctx.drawImage(image, 0, 0, width, height);
          const resized = canvas.toDataURL(imageType, 0.8);

          this.setState({
            groupIcon: resized
          });
        };
      };
      reader.onerror = error => console.log(error);
    }
  };

  handleTextChange = event => {
    const error = event.target.value === 0;

    this.setState({
      ...this.state,
      groupName: event.target.value,
      errorGroupName: error
    });
  };

  renderCreateGroup = () => {
    const { classes } = this.props;
    const { errorGroupName, groupIcon, groupName } = this.state;
    return (
      <div>
        <Button
          onClick={() => this.cancelCreateGroup()}
          style={{
            backgroundColor: '#FF4136',
            color: 'white',
            width: '100px',
            marginRight: '12px'
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => this.createClick()}
          style={{
            backgroundColor: '#3D9970',
            color: 'white',
            width: '100px'
          }}
        >
          Create
        </Button>
        <Grid
          item
          style={{
            marginLeft: '24px',
            marginRight: '24px',
            marginTop: '12px',
            backgroundColor: 'white'
          }}
        >
          <TextField
            id="group-name"
            className={classes.textField}
            margin="normal"
            placeholder="Group Name"
            error={errorGroupName}
            value={groupName}
            onChange={event => this.handleTextChange(event)}
          />
          <List>
            <ListItem style={{ justifyContent: 'center', paddingTop: '0px' }}>
              <ListItemText primary="Group Icon:" style={{ flex: 'none' }} />
              <div>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="group-image-input"
                  multiple={false}
                  type="file"
                  onChange={event => this.uploadImageToScreen(event)}
                />
                <label htmlFor="group-image-input">
                  <Avatar
                    src={groupIcon}
                    style={{
                      backgroundColor: groupIcon ? 'transparent' : '#3D9970'
                    }}
                  >
                    G
                  </Avatar>
                </label>
              </div>
              <Avatar
                onClick={() =>
                  this.setState({ ...this.state, groupIcon: null })
                }
                style={{
                  display: groupIcon ? '' : 'none',
                  width: '25px',
                  height: '25px',
                  position: 'absolute',
                  right: '20px',
                  backgroundColor: '#FF4136'
                }}
              >
                <CloseIcon style={{ width: '15px' }} />
              </Avatar>
            </ListItem>
          </List>
          <Typography>Add Members:</Typography>
          <List style={{ maxHeight: '265px', overflow: 'auto' }}>
            {this.renderUsersList()}
          </List>
        </Grid>
      </div>
    );
  };

  renderMyGroups = () => {
    const { notifications, auth } = this.props;

    if (!notifications.groups || notifications.groups.length === 0)
      return <Typography>You don't have any groups yet...</Typography>;

    const groupsLength = notifications.groups.length;
    return notifications.groups.map((group, index) => {
      if (group.createdById.toString() !== auth._id.toString()) return null;

      const members = group.members.length;
      return (
        <div key={group._id}>
          <ListItem>
            <ListItemAvatar>
              <Avatar
                src={group.icon}
                style={{
                  backgroundColor: group.icon ? 'transparent' : '#3D9970'
                }}
              >
                G
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={group.name}
              secondary={`Members: ${members}`}
            />
            <ListItemSecondaryAction>
              <IconButton onClick={() => console.log('Edit:', group.name)}>
                <EditIcon />
              </IconButton>
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
    const { classes, auth } = this.props;

    return (
      <div style={{ paddingTop: ' 12px' }}>
        {auth.superUser ? (
          this.state.createGroup ? (
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
                  paddingTop: '12px',
                  marginLeft: '24px',
                  marginRight: '24px'
                }}
              >
                <Typography style={{ color: 'bisque' }}>My Groups</Typography>
                <List className={classes.list}>{this.renderMyGroups()}</List>
              </Grid>
            </div>
          )
        ) : (
          <Typography style={{ color: 'bisque' }}>
            Some sweet admin func coming soon...
          </Typography>
        )}
      </div>
    );
  }
}

function mapStateToProps({ auth, resizeScreen, notifications, maintenance }) {
  return {
    auth,
    resizeScreen,
    notifications,
    maintenance
  };
}

export default connect(
  mapStateToProps,
  actions
)(withStyles(styles)(NotificationAdmin));
