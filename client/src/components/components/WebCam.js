import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import { showMessage } from '../../actions/snackBarActions';
import Loader from 'react-loader-advanced';
import MiniLoader from 'react-loader-spinner';

import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
// import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { Button } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import UndoIcon from '@material-ui/icons/Undo';
import DoneIcon from '@material-ui/icons/Done';
import ErrorIcon from '@material-ui/icons/ErrorOutline';
import MoreIcon from '@material-ui/icons/MoreVert';

const styles = theme => ({
  root: {
    marginLeft: '24px',
    marginRight: '24px',
    marginTop: '24px'
  }
});

class WebCam extends Component {
  state = {
    photoTaken: false,
    capturedPhotoBase65: null,
    showLoader: true,
    truecameraDeniedAccess: false
  };

  componentDidMount() {
    navigator.permissions
      .query({ name: 'camera' })
      .then(permissionObj => {
        if (permissionObj.state === 'denied') {
          this.setState({ cameraDeniedAccess: true });
        }
      })
      .catch(error => {
        console.log('Got error :', error);
      });
  }

  onTakePhoto = dataUri => {
    // let base64str = dataUri.substr(22);
    // let decoded = atob(base64str);
    // alert('FileSize: ' + decoded.length);
    // console.log('FileSize: ' + decoded.length);
    this.setState({
      ...this.state,
      photoTaken: true,
      capturedPhotoBase65: dataUri,
      showLoader: false
    });
  };

  onCameraStart(stream) {
    this.setState({ showLoader: false });
  }

  onCameraStop() {}

  onCameraError(error) {}

  cancelCamera = () => {
    this.setState({
      ...this.state,
      photoTaken: false,
      capturedPhotoBase65: null
    });

    this.props.hideCamera();

    return null;
  };

  uploadPhoto = () => {
    // console.log(this.state.capturedPhotoBase65);
    this.props.uploadUserPhoto(this.state.capturedPhotoBase65);

    this.setState({
      ...this.state,
      photoTaken: false,
      capturedPhotoBase65: null
    });

    this.props.hideCamera();
    this.props.newPhotoUpload();

    return null;
  };

  renderCameraWorkAround = () => {
    if (!this.state.cameraDeniedAccess) return null;

    return (
      <Grid
        item
        style={{
          maxWidth: '600px',
          padding: '24px',
          marginLeft: '10px',
          marginRight: '10px',
          borderRadius: '5px',
          backgroundColor: 'white'
        }}
      >
        <Typography paragraph>Well this is awkward.</Typography>
        <Typography paragraph>
          It seems you have denied permission for your browser to access the
          this devices camera.
        </Typography>
        <Typography paragraph>
          In order for you to take and upload a new profile picture you will
          need to enable the camera. You can always disable it afterwards if you
          feel you need to.
        </Typography>
        <Typography paragraph>
          To enable the camera on Chrome follow these simple steps:
        </Typography>
        <Typography paragraph>
          To the right of the address bar tap More
          <MoreIcon style={{ verticalAlign: 'middle' }} />
          followed by Info{' '}
          <ErrorIcon
            style={{ transform: 'rotate(180deg)', verticalAlign: 'middle' }}
          />
          . Tap <span style={{ color: '#0074D9' }}>Site Settings</span>. Under{' '}
          <span style={{ color: '#0074D9' }}>Permissions</span>, click on{' '}
          <b>Access your camera</b> and select <b>Allow</b>. Navigate back to
          your profile page and select the camera icon again to take that
          perfect profile picture.
        </Typography>
        <Typography paragraph>
          To disable the camera, follow the above steps and select <b>Block</b>.
          The app will now be denied access to this devices camera.
        </Typography>
        <Button
          style={{
            width: '100px',
            color: 'white',
            backgroundColor: '#FF4136',
            marginBottom: '24px'
          }}
          onClick={this.cancelCamera}
        >
          Cancel
        </Button>
      </Grid>
    );
  };

  spinner = (
    <span>
      <MiniLoader type="TailSpin" color="#FFC300" height={45} width={45} />
    </span>
  );

  renderCameraDisplay = () => {
    const { classes } = this.props;
    const { photoTaken, capturedPhotoBase65, cameraDeniedAccess } = this.state;

    if (photoTaken) {
      return (
        <div className={classes.root}>
          <Grid
            item
            style={{
              textAlign: 'center',
              display: capturedPhotoBase65 ? '' : 'none'
            }}
          >
            <Avatar
              style={{
                height: '200px',
                width: '200px',
                margin: 'auto'
              }}
              src={this.state.capturedPhotoBase65}
            />
          </Grid>
          <Grid item style={{ textAlign: 'center', paddingTop: '24px' }}>
            <Button
              style={{
                width: '50px',
                marginRight: '20px',
                color: 'white',
                backgroundColor: '#FF4136'
              }}
              onClick={this.cancelCamera}
            >
              <ClearIcon />
            </Button>
            <Button
              style={{
                width: '50px',
                color: 'white',
                backgroundColor: '#001f3f'
              }}
              onClick={() =>
                this.setState({
                  ...this.state,
                  photoTaken: false,
                  capturedPhotoBase65: null,
                  showLoader: true
                })
              }
            >
              <UndoIcon />
            </Button>
          </Grid>
          <Grid style={{ textAlign: 'center', paddingTop: '24px' }}>
            <Button
              style={{
                width: '100px',
                color: 'white',
                backgroundColor: '#3D9970'
              }}
              onClick={this.uploadPhoto}
            >
              <DoneIcon />
              Upload
            </Button>
          </Grid>
        </div>
      );
    }

    return (
      <div
        style={{
          position: 'relative'
        }}
      >
        <div style={{ display: cameraDeniedAccess ? 'none' : '' }}>
          <Loader
            show={this.state.showLoader ? true : false}
            message={this.spinner}
            style={{ width: '100%' }}
          >
            <Camera
              onTakePhoto={dataUri => {
                this.onTakePhoto(dataUri);
              }}
              onCameraStart={stream => {
                this.onCameraStart(stream);
              }}
              onCameraStop={() => {
                this.onCameraStop();
              }}
              onCameraError={error => {
                this.onCameraError(error);
              }}
              isSilentMode={true}
              sizeFactor={0.3}
              isMaxResolution={false}
            />
          </Loader>
        </div>
        <Button
          style={{
            width: '50px',
            color: 'white',
            backgroundColor: '#FF4136',
            position: 'absolute',
            top: '0',
            zIndex: 10,
            display: cameraDeniedAccess ? 'none' : ''
          }}
          onClick={this.cancelCamera}
        >
          <ClearIcon />
        </Button>
        {this.renderCameraWorkAround()}
      </div>
    );
  };

  render() {
    return <div>{this.renderCameraDisplay()}</div>;
  }
}

WebCam.propTypes = {
  classes: PropTypes.object.isRequired
};

export default connect(
  null,
  { ...actions, showMessage }
)(withStyles(styles)(WebCam));
