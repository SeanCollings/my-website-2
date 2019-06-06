import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Avatar from '@material-ui/core/Avatar';
import CloseIcon from '@material-ui/icons/Close';
import Divider from '@material-ui/core/Divider';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  textField: {
    width: 200
  }
});

class GroupEditUpdate extends Component {
  state = {
    errorGroupName: false,
    groupIcon: null,
    groupName: '',
    newGroupMembers: []
  };

  componentDidMount() {
    const { selectedGroup } = this.props;

    if (selectedGroup) {
      this.setState({
        ...this.state,
        groupName: selectedGroup.name,
        groupIcon: selectedGroup.icon,
        newGroupMembers: [...selectedGroup.members]
      });
    }
  }

  createClick = () => {
    const { groupName, newGroupMembers, groupIcon } = this.state;

    if (groupName.length === 0) return this.setState({ errorGroupName: true });

    this.props.createNotificationGroup(groupName, groupIcon, newGroupMembers);
    this.cancelCreateGroup();
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

  render() {
    const { classes, selectedGroup } = this.props;
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
            marginLeft: selectedGroup ? '' : '24px',
            marginRight: selectedGroup ? '' : '24px',
            marginTop: '12px',
            backgroundColor: 'white',
            borderRadius: '20px'
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
            <Divider />
          </List>
          <Typography style={{ paddingBottom: '8px' }}>Add Members:</Typography>
          <List style={{ maxHeight: '265px', overflow: 'auto' }}>
            {this.renderUsersList()}
          </List>
        </Grid>
      </div>
    );
  }
}

function mapStateToProps({ auth, maintenance }) {
  return {
    auth,
    maintenance
  };
}

export default connect(
  mapStateToProps,
  actions
)(withStyles(styles)(GroupEditUpdate));
