import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import Loader from 'react-loader-advanced';
import MiniLoader from 'react-loader-spinner';

import GroupCreateUpdate from './GroupCreateUpdate';

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
import EditIcon from '@material-ui/icons/Edit';
import Divider from '@material-ui/core/Divider';
import BackIcon from '@material-ui/icons/ArrowBackIos';
import DeleteIcon from '@material-ui/icons/DeleteForever';
import Modal from '@material-ui/core/Modal';

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
  },
  textField: {
    width: 200
  },
  modalStyles: {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '5px',
    maxWidth: '400px',
    width: '75%',
    padding: '12px'
  },
  paper: {
    position: 'absolute',
    // width: '400',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    outline: 'none'
  }
});

class NotificationAdmin extends Component {
  state = {
    createGroup: false,
    errorGroupName: false,
    groupName: '',
    groupIcon: null,
    groupHeader: 'My Created Groups',
    selectedGroup: null,
    editGroup: false,
    newGroupMembers: [],
    showModal: false,
    groupToDelete: null,
    deletingGroup: false
  };

  componentDidMount() {
    const { auth } = this.props;
    // Get all users
    if (auth.superUser) this.props.fetchAllUsers(['User Groups']);
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.snackBar.open && this.state.deletingGroup) {
      this.props.getNotificationGroups();
      this.setState({ deletingGroup: false });
    }

    return true;
  }

  createGroup = () => {
    this.setState({ createGroup: true });
  };

  editGroup = group => {
    this.setState({
      ...this.state,
      selectedGroup: group,
      groupHeader: `Edit: ${group.name}`,
      editGroup: true
    });
  };

  handleClose = () => {
    this.setState({ showModal: false });
  };

  showDeleteModal = () => {
    const { classes } = this.props;
    return (
      <Modal
        aria-labelledby="confirm-delete"
        aria-describedby="confirm-delete"
        open={this.state.showModal}
        onClose={this.handleClose}
      >
        <div className={`${classes.modalStyles} ${classes.paper}`}>
          <Typography
            id="modal-title"
            style={{ textAlign: 'center' }}
            paragraph
          >
            Warning!
          </Typography>
          <Typography
            id="modal-title"
            style={{ textAlign: 'center' }}
            paragraph
          >
            Are you sure you want to delete the group
          </Typography>
          <Button
            style={{
              width: '45%',
              backgroundColor: '#FF4136',
              color: 'white',
              marginRight: '10%'
            }}
            onClick={() =>
              this.setState({
                ...this.state,
                groupToDelete: null,
                showModal: false
              })
            }
          >
            Cancel
          </Button>
          <Button
            style={{
              width: '45%',
              backgroundColor: '#3D9970',
              color: 'white'
            }}
            onClick={() => this.deleteGroup()}
          >
            Confirm
          </Button>
        </div>
      </Modal>
    );
  };

  deleteGroup = () => {
    const { groupToDelete } = this.state;
    if (groupToDelete) {
      this.props.deleteNotificationGroup(
        groupToDelete.createdById,
        groupToDelete._id,
        groupToDelete.name
      );
    }
    this.setState({
      ...this.state,
      showModal: false,
      groupToDelete: null,
      deletingGroup: true
    });
  };

  renderEditScreen = () => {
    const { selectedGroup } = this.state;

    return (
      <Grid>
        <GroupCreateUpdate
          selectedGroup={selectedGroup}
          cancelAddEdit={() => this.cancelAddEdit()}
        />
      </Grid>
    );
  };

  renderMyGroups = () => {
    const { notifications, auth } = this.props;

    if (!notifications.groups || notifications.groups.length === 0)
      return <Typography>You don't have any groups yet...</Typography>;

    const groupsLength = notifications.groups.length;
    return notifications.groups.map((group, index) => {
      if (group.createdById.toString() !== auth._id.toString()) return null;

      // const members = group.members.length + 1;
      return (
        <div key={group._id}>
          <ListItem>
            <ListItemAvatar>
              <Avatar
                src={group.icon}
                style={{
                  backgroundColor: group.icon ? 'transparent' : '#3D9970',
                  width: '25px',
                  height: '25px'
                }}
              >
                G
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={group.name}
              // secondary={`Members: ${members}`}
            />
            <ListItemSecondaryAction>
              <IconButton
                onClick={() =>
                  this.setState({
                    ...this.state,
                    groupToDelete: group,
                    showModal: true
                  })
                }
                style={{ paddingRight: '0px' }}
              >
                <DeleteIcon />
              </IconButton>
              <IconButton onClick={() => this.editGroup(group)}>
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

  cancelAddEdit = () => {
    this.setState({
      ...this.state,
      editGroup: false,
      createGroup: false,
      groupHeader: 'My Created Groups',
      selectedGroup: null
    });
  };

  spinner = (
    <span>
      <MiniLoader type="Oval" color="#3D9970" height={45} width={45} />
    </span>
  );

  render() {
    const { classes } = this.props;
    const { groupHeader, selectedGroup, editGroup, deletingGroup } = this.state;

    return (
      <div
        style={{ paddingTop: ' 12px', opacity: deletingGroup ? '0.9' : '1' }}
      >
        <Loader
          show={deletingGroup ? true : false}
          message={this.spinner}
          backgroundStyle={{ backgroundColor: 'transparent' }}
        >
          {this.state.createGroup ? (
            <GroupCreateUpdate cancelAddEdit={() => this.cancelAddEdit()} />
          ) : (
            <div>
              <Button
                onClick={() => this.createGroup()}
                style={{
                  backgroundColor: '#3D9970',
                  color: 'white',
                  display: editGroup ? 'none' : ''
                }}
              >
                Create Group
              </Button>
              <Grid
                item
                style={{
                  paddingTop: editGroup ? '' : '12px',
                  marginLeft: '24px',
                  marginRight: '24px'
                }}
              >
                <Typography
                  style={{
                    color: 'bisque',
                    paddingBottom: editGroup ? '12px' : ''
                    // fontSize: editGroup ? 'large' : ''
                  }}
                  onClick={() =>
                    this.setState({
                      ...this.state,
                      selectedGroup: null,
                      editGroup: false,
                      groupHeader: 'My Created Groups'
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
                {editGroup ? (
                  this.renderEditScreen()
                ) : (
                  <List className={classes.list}>{this.renderMyGroups()}</List>
                )}
              </Grid>
              {this.showDeleteModal()}
            </div>
          )}

          {/* (
             <Typography style={{ color: 'bisque' }}>
               Some sweet admin func coming soon...
             </Typography>
           )} */}
        </Loader>
      </div>
    );
  }
}

function mapStateToProps({
  auth,
  resizeScreen,
  notifications,
  maintenance,
  snackBar
}) {
  return {
    auth,
    resizeScreen,
    notifications,
    maintenance,
    snackBar
  };
}

export default connect(
  mapStateToProps,
  actions
)(withStyles(styles)(NotificationAdmin));
