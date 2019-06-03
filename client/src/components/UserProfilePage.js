import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import Loader from 'react-loader-advanced';
// import MiniLoader from 'react-loader-spinner';
// import { ClipLoader } from 'halogenium';
import * as actions from '../actions';
import { showMessage } from '../actions/snackBarActions';
import WebCam from './components/WebCam';

// import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import CameraIcon from '@material-ui/icons/PhotoCamera';
import DeleteIcon from '@material-ui/icons/Delete';
import ImageIcon from '@material-ui/icons/Image';
import Modal from '@material-ui/core/Modal';
// import Radio from '@material-ui/core/Radio';
// import RadioGroup from '@material-ui/core/RadioGroup';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import FormControl from '@material-ui/core/FormControl';
// import FormLabel from '@material-ui/core/FormLabel';
import { withStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';

// import Paper from './components/paper';

const styles = theme => ({
  root: {
    // backgroundColor: 'white',
    marginLeft: '24px',
    marginRight: '24px',
    marginTop: '24px'
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
    // padding: theme.spacing(4),
    outline: 'none'
  }
});

class UserProfilePage extends Component {
  state = {
    showModal: false,
    showWarning: false,
    showCamera: false,
    showUploadImage: false,
    updateUser: false
  };

  componentDidUpdate() {
    if (this.props.snackBar.open && this.state.updateUser) {
      this.setState({ updateUser: false });
      this.props.fetchUser();
    }
  }

  cameraMoreClick = () => {
    this.setState({ showModal: true });
  };

  renderProfilePhoto = () => {
    const { classes, auth } = this.props;

    if (auth === null || auth === false) return null;

    return (
      <div className={classes.root}>
        <Grid
          item
          style={{
            textAlign: 'center'
            // display: capturedPhotoBase65 ? '' : 'none'
          }}
        >
          {!auth.uploadedPhoto ? (
            <div
              style={{
                width: '200px',
                height: '200px',
                // position: 'relative',
                overflow: 'hidden',
                borderRadius: '50%',
                margin: 'auto'
              }}
            >
              <Avatar
                style={{
                  height: '200px',
                  width: '200px'
                }}
              >
                No Photo
              </Avatar>
            </div>
          ) : (
            <Avatar
              style={{
                height: '200px',
                width: '200px',
                margin: 'auto'
              }}
              src={auth.uploadedPhoto}
            />
          )}
          <Avatar
            style={{
              width: '50px',
              height: '50px',
              top: '-50px',
              left: '60px',
              backgroundColor: '#0074D9',
              color: 'white',
              display: 'inline-flex'
            }}
            onClick={() => this.cameraMoreClick()}
          >
            <CameraIcon />
          </Avatar>
        </Grid>
      </div>
    );
  };

  renderSelectionModal = () => {
    const { classes, auth } = this.props;

    return (
      <Modal
        aria-labelledby="profile-picture-select"
        aria-describedby="profile-picture-select"
        open={this.state.showModal}
        onClose={this.handleClose}
      >
        {!this.state.showWarning ? (
          <div className={`${classes.modalStyles} ${classes.paper}`}>
            <Typography id="modal-title" style={{ textAlign: 'center' }}>
              Profile Photo
            </Typography>
            <Grid
              item
              style={{
                display: 'flex',
                justifyContent: 'space-evenly',
                padding: '10px'
              }}
            >
              <Avatar
                style={{ marginRight: '30px', backgroundColor: '#0074D9' }}
                onClick={() => this.initiateCamera()}
              >
                <CameraIcon />
              </Avatar>
              <Avatar
                style={{ marginRight: '30px', backgroundColor: '#900C3F' }}
                onClick={() => this.uploadImage()}
              >
                <ImageIcon />
              </Avatar>
              <Avatar
                style={{
                  backgroundColor: '#FF4136',
                  opacity: auth.uploadedPhoto ? '1' : '0.4'
                }}
                onClick={() =>
                  auth.uploadedPhoto ? this.removePhotoPrompt() : null
                }
              >
                <DeleteIcon />
              </Avatar>
            </Grid>
            <Typography
              id="modal-icons"
              variant="inherit"
              style={{
                display: 'flex',
                justifyContent: 'space-evenly',
                paddingBottom: '10px'
              }}
            >
              <Typography variant="body1" style={{ marginRight: '20px' }}>
                Camera
              </Typography>
              <Typography variant="body1" style={{ marginRight: '20px' }}>
                Gallery
              </Typography>
              <Typography variant="body1">Remove</Typography>
            </Typography>
            <Button
              style={{ width: '100%', backgroundColor: '#DEDEDE' }}
              onClick={() => this.setState({ showModal: false })}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <div className={`${classes.modalStyles} ${classes.paper}`}>
            <Typography
              id="modal-title"
              style={{ textAlign: 'center', paddingBottom: '10px' }}
            >
              Are you sure you want to remove the current photo?
            </Typography>
            <Button
              style={{
                width: '45%',
                backgroundColor: '#001f3f',
                color: 'white',
                marginRight: '10%'
              }}
              onClick={this.confirmRemoveClick}
            >
              Confirm
            </Button>
            <Button
              style={{
                width: '45%',
                backgroundColor: '#FF4136',
                color: 'white'
              }}
              onClick={() =>
                this.setState({
                  ...this.state,
                  showWarning: false,
                  showModal: true
                })
              }
            >
              Cancel
            </Button>
          </div>
        )}
      </Modal>
    );
  };

  confirmRemoveClick = () => {
    this.setState({
      ...this.state,
      showWarning: false,
      showModal: false,
      updateUser: true
    });
    this.props.removeUserPhoto();
  };

  removePhotoPrompt = () => {
    this.setState({ ...this.state, showWarning: true });
  };

  initiateCamera = () => {
    this.setState({ ...this.state, showModal: false, showCamera: true });
  };

  uploadImage = () => {
    this.setState({ ...this.state, showModal: false, showUploadImage: true });
  };

  handleClose = () => {
    this.setState({ showModal: false });
  };

  handleWarningClose = () => {
    this.setState({ showWarning: false });
  };

  render() {
    const { classes, auth } = this.props;
    const { showCamera } = this.state;

    if (!auth) return null;

    return (
      <div className={classes.pageFill}>
        {!showCamera ? (
          <div>
            {this.renderProfilePhoto()}
            {this.renderSelectionModal()}
          </div>
        ) : (
          <WebCam
            hideCamera={() =>
              this.setState({
                showCamera: false
              })
            }
            newPhotoUpload={() => this.setState({ updateUser: true })}
          />
        )}
      </div>
    );
  }
}

UserProfilePage.propTypes = {
  classes: PropTypes.object.isRequired
};

function mapStateToProps({ auth, resizeScreen, settings, snackBar }) {
  return { auth, resizeScreen, settings, snackBar };
}

export default connect(
  mapStateToProps,
  { ...actions, showMessage }
)(withStyles(styles)(UserProfilePage));
