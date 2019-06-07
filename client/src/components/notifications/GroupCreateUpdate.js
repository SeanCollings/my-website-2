import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import { removeMessage } from '../../actions/snackBarActions';
import Loader from 'react-loader-advanced';
import MiniLoader from 'react-loader-spinner';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Avatar from '@material-ui/core/Avatar';
import CancelIcon from '@material-ui/icons/Cancel';
import Divider from '@material-ui/core/Divider';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import AddPersonIcon from '@material-ui/icons/PersonAdd';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  textField: {
    width: 200
  }
});

class GroupCreateUpdate extends Component {
  state = {
    errorGroupName: false,
    errorEmailAddress: false,
    emailAddress: '',
    groupIcon: null,
    groupName: '',
    newGroupMembers: [],
    creatingUpdatingGroup: false,
    emailAddressArray: []
  };

  componentDidMount() {
    const { selectedGroup } = this.props;

    if (selectedGroup) {
      const membersArray = [];
      selectedGroup.members.forEach(member => {
        membersArray.push(member._user);
      });

      this.setState({
        ...this.state,
        groupName: selectedGroup.name,
        groupIcon: selectedGroup.icon,
        newGroupMembers: membersArray
      });
    }
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.snackBar.open && this.state.creatingUpdatingGroup) {
      this.cancelCreateGroup();
      this.props.getNotificationGroups();
    }

    return true;
  }

  createUpdateClick = () => {
    const { selectedGroup, auth } = this.props;
    const { groupName, newGroupMembers, groupIcon } = this.state;

    if (groupName.length === 0) return this.setState({ errorGroupName: true });
    // if (newGroupMembers.length === 0)
    //   return this.setState({ errorEmailAddress: true });

    if (auth.superUser) {
      if (selectedGroup) {
        this.props.updateNotificationGroup(
          selectedGroup._id,
          groupName,
          groupIcon,
          newGroupMembers,
          selectedGroup.createdById
        );
      } else {
        this.props.createNotificationGroup(
          groupName,
          groupIcon,
          newGroupMembers
        );
      }
    } else {
      if (selectedGroup) {
        this.props.updateNonSuperUserNotificationGroup(
          selectedGroup._id,
          groupName,
          groupIcon,
          // emailAddress.trim(),
          selectedGroup.createdById
        );
      } else {
        this.props.createNonSuperUserNotificationGroup(
          groupName,
          groupIcon,
          newGroupMembers
        );
      }
    }

    this.setState({ creatingUpdatingGroup: true });
    // this.cancelCreateGroup();
  };

  cancelCreateGroup = () => {
    this.setState({
      ...this.state,
      newGroupMembers: [],
      groupIcon: null,
      groupName: ''
    });

    this.props.cancelAddEdit();
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
              <Avatar style={{ width: '30px', height: '30px' }}>
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
                color: '#3D9970'
              }}
            />
          </ListItemSecondaryAction>
        </ListItem>
      );
    });
  };

  handleEmailChange = event => {
    const error = event.target.value === 0;

    this.setState({
      ...this.state,
      emailAddress: event.target.value,
      errorEmailAddress: error
    });
  };

  addEmailAddress = () => {
    const { emailAddress, newGroupMembers } = this.state;
    if (emailAddress.length === 0) {
      this.setState({ errorEmailAddress: true });
    } else {
      this.setState({
        ...this.state,
        emailAddress: '',
        errorEmailAddress: false,
        newGroupMembers: [...newGroupMembers, emailAddress]
      });
    }
  };

  removeEmailAddress = emailAddress => {
    const { newGroupMembers } = this.state;
    this.setState({
      newGroupMembers: newGroupMembers.filter(x => x !== emailAddress)
    });
  };

  renderNonSuperUserList = () => {
    const { classes, selectedGroup } = this.props;
    const { errorEmailAddress, emailAddress, newGroupMembers } = this.state;

    return (
      <div style={{ paddingBottom: '8px' }}>
        {selectedGroup ? (
          <Typography
            style={{
              paddingLeft: '8px',
              paddingRight: '8px'
            }}
          >
            You can only update the Group Name and Icon for now. Some more of
            that sweet, sweet func will be sprinkled in this area shortly...
          </Typography>
        ) : (
          <div>
            <Typography
              style={{
                marginBottom: '-8px',
                paddingLeft: '8px',
                paddingRight: '8px'
              }}
            >
              Enter a valid email address to add a new member to this group:
            </Typography>
            <TextField
              id="email"
              className={classes.textField}
              margin="normal"
              label="Email Address"
              error={errorEmailAddress}
              value={emailAddress}
              onChange={event => this.handleEmailChange(event)}
            />
            <AddPersonIcon
              style={{ position: 'absolute', marginTop: '36px' }}
              onClick={() => this.addEmailAddress()}
            />
            <List style={{ paddingLeft: '12px' }}>
              {newGroupMembers.length === 0 ? (
                <ListItem>
                  <ListItemText
                    style={{ fontSize: 'small', textAlign: 'center' }}
                    primary="No email address added..."
                  />
                </ListItem>
              ) : (
                newGroupMembers.map((member, index) => {
                  return (
                    <ListItem
                      key={index}
                      style={{ paddingTop: '8px', paddingBottom: '8px' }}
                    >
                      <ListItemText primary={member} />
                      <ListItemSecondaryAction>
                        <IconButton
                          onClick={() => this.removeEmailAddress(member)}
                        >
                          <CancelIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  );
                })
              )}
            </List>
          </div>
        )}
      </div>
    );
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

  spinner = (
    <span>
      <MiniLoader type="Oval" color="#3D9970" height={45} width={45} />
    </span>
  );

  render() {
    const { classes, selectedGroup, auth } = this.props;
    const {
      errorGroupName,
      groupIcon,
      groupName,
      creatingUpdatingGroup
    } = this.state;

    return (
      <div style={{ opacity: creatingUpdatingGroup ? '0.9' : '1' }}>
        <Loader
          show={creatingUpdatingGroup ? true : false}
          message={this.spinner}
          backgroundStyle={{ backgroundColor: 'transparent' }}
        >
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
            onClick={() => this.createUpdateClick()}
            style={{
              backgroundColor: '#3D9970',
              color: 'white',
              width: '100px'
            }}
          >
            {selectedGroup ? 'Update' : 'Create'}
          </Button>
          <Grid
            item
            style={{
              marginLeft: selectedGroup ? '' : '24px',
              marginRight: selectedGroup ? '' : '24px',
              marginTop: '12px',
              backgroundColor: 'white',
              borderRadius: '15px'
            }}
          >
            <TextField
              id="group-name"
              className={classes.textField}
              margin="normal"
              label="Group Name"
              // placeholder="Group Name"
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
                <IconButton
                  onClick={() =>
                    this.setState({ ...this.state, groupIcon: null })
                  }
                  style={{ paddingRight: '0px', marginLeft: '24px' }}
                >
                  <CancelIcon />
                </IconButton>
              </ListItem>
              <Divider />
            </List>
            {auth.superUser ? (
              <div>
                <Typography style={{ paddingBottom: '8px' }}>
                  Add Members:
                </Typography>
                <List
                  style={{
                    maxHeight: '265px',
                    overflow: 'auto',
                    paddingTop: '0px'
                  }}
                >
                  {this.renderUsersList()}
                </List>
              </div>
            ) : (
              this.renderNonSuperUserList()
            )}
          </Grid>
        </Loader>
      </div>
    );
  }
}

function mapStateToProps({ auth, maintenance, snackBar }) {
  return {
    auth,
    maintenance,
    snackBar
  };
}

export default connect(
  mapStateToProps,
  { ...actions, removeMessage }
)(withStyles(styles)(GroupCreateUpdate));
