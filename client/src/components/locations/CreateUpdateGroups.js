import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  createLocationGroups,
  updateLocationGroups,
  deleteGroup
} from '../../actions/locationActions';

import UploadIcon from '../components/UploadIcon';
import SetGroupLocation from './SetGroupLocation';
import SetLocationMap from './SetLocationMap';
import UserList from './UserList';
import UserListNonSuper from './UserListNonSuper';
import Loader from '../components/loader';

import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  page: {
    textAlign: 'center',
    backgroundColor: 'white',
    borderRadius: '15px',
    maxWidth: '800px',
    margin: 'auto'
  },
  textField: {
    width: 200
  },
  deleteButton: {
    marginBottom: '-12px',
    marginTop: '6px'
  }
});

class CreateUpateGroups extends Component {
  state = {
    groupName: '',
    groupIcon: null,
    markerPosition: null,
    tempPosition: null,
    userList: null,
    showErrors: false,
    deletingGroup: false
  };

  componentDidMount() {
    const { editGroup, auth } = this.props;

    const membersArray = [];
    if (auth.superUser && editGroup) {
      editGroup.members.forEach(member => {
        membersArray.push(member._user);
      });
    }

    if (editGroup) {
      this.setState({
        ...this.state,
        groupName: editGroup.name,
        groupIcon: editGroup.icon,
        markerPosition: editGroup.location,
        userList: auth.superUser ? [...membersArray] : null
      });
    }
  }

  componentDidUpdate() {
    const {
      savePosition,
      creatingUpdatingGroup,
      snackBar,
      editGroup
    } = this.props;
    const {
      tempPosition,
      groupName,
      markerPosition,
      groupIcon,
      userList,
      deletingGroup
    } = this.state;

    if (savePosition) {
      this.setState({ markerPosition: tempPosition });
      this.props.positionSaved();
    }

    if (!snackBar.open && creatingUpdatingGroup) {
      if (groupName.length === 0 || !markerPosition) {
        this.props.createUpdateComplete();
        this.setState({ showErrors: true });
      } else {
        if (editGroup) {
          this.props.updateLocationGroups(
            editGroup._id,
            groupName,
            groupIcon,
            markerPosition,
            userList
          );
        } else {
          this.props.createLocationGroups(
            groupName,
            groupIcon,
            markerPosition,
            userList
          );
        }
      }
    }

    if (editGroup && !snackBar.open && deletingGroup) {
      this.props.deleteGroup(editGroup._id, editGroup.name);
    }

    if (snackBar.open && (creatingUpdatingGroup || deletingGroup)) {
      this.setState({ deletingGroup: false });
      this.props.showAllGroups();
    }
  }

  handleTextChange = event => {
    const error = event.target.value === 0;

    this.setState({
      ...this.state,
      groupName: event.target.value,
      errorGroupName: error
    });
  };

  deleteGroup = () => {
    this.setState({ deletingGroup: true });
  };

  showMapSelected = () => {
    this.props.mapDisplayed();
  };

  render() {
    const {
      classes,
      auth,
      heightFactor,
      topHeight,
      hideMap,
      creatingUpdatingGroup,
      editGroup
    } = this.props;
    const {
      groupIcon,
      groupName,
      markerPosition,
      userList,
      showErrors,
      deletingGroup
    } = this.state;

    const groupFirstLetter = groupName.charAt(0).toUpperCase();

    return (
      <div className={classes.page}>
        {hideMap ? (
          <SetLocationMap
            googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyDD0nkesefYmPhscdaz0EO9XK_MwD5i9QE&amp;v=3.exp&amp;libraries=geometry,drawing,places,visualization"
            loadingElement={<div style={{ height: `100vh` }} />}
            containerElement={<div style={{ height: '100%' }} />}
            mapElement={
              <div
                style={{
                  height: `calc(100vh - ${heightFactor} - ${topHeight})`
                }}
              />
            }
            markerPosition={position =>
              this.setState({ tempPosition: position })
            }
            selectedPosition={markerPosition}
          />
        ) : (
          <Loader
            showLoader={creatingUpdatingGroup || deletingGroup}
            spinnerColor={'#900C3F'}
          >
            <div
              style={{
                opacity: creatingUpdatingGroup || deletingGroup ? '0.6' : '1'
              }}
            >
              <Grid container direction="column" alignItems="center">
                {editGroup ? (
                  <Button
                    onClick={() => this.deleteGroup()}
                    className={classes.deleteButton}
                  >
                    Delete
                  </Button>
                ) : null}
                <TextField
                  id="group-name"
                  className={classes.textField}
                  margin="normal"
                  label="Group Name"
                  // placeholder="Group Name"
                  error={showErrors && groupName.length === 0}
                  value={groupName}
                  onChange={event => this.handleTextChange(event)}
                />
              </Grid>
              <List>
                <ListItem
                  style={{
                    justifyContent: 'center',
                    paddingTop: '0px',
                    paddingBottom: '0px'
                  }}
                >
                  <ListItemText
                    primary="Group Icon:"
                    style={{ flex: 'none' }}
                  />
                  <UploadIcon
                    letter={
                      groupFirstLetter.length > 0 ? groupFirstLetter : 'G'
                    }
                    colorMain={'#900C3F'}
                    colorText={'white'}
                    setGroupIcon={groupIcon => this.setState({ groupIcon })}
                    clearGroupIcon={() => this.setState({ groupIcon: null })}
                    groupIcon={groupIcon}
                    editGroup={editGroup}
                  />
                </ListItem>
                <ListItem style={{ paddingTop: '0px' }}>
                  <SetGroupLocation
                    showMap={() => this.showMapSelected()}
                    markerPosition={markerPosition}
                    showErrors={showErrors && !markerPosition}
                  />
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
                    <UserList
                      checkboxColor={'#900C3F'}
                      setUserList={userList => this.setState({ userList })}
                      userList={userList}
                      editGroup={editGroup}
                    />
                  </List>
                </div>
              ) : (
                <UserListNonSuper
                  avatarColor={'#900C3F'}
                  setUserList={userList => this.setState({ userList })}
                  userList={userList}
                />
              )}
            </div>
          </Loader>
        )}
      </div>
    );
  }
}

function mapStateToProps({ auth, snackBar }) {
  return {
    auth,
    snackBar
  };
}

export default connect(
  mapStateToProps,
  { createLocationGroups, updateLocationGroups, deleteGroup }
)(withStyles(styles)(CreateUpateGroups));
