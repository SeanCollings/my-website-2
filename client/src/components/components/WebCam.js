import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import { showMessage } from '../../actions/snackBarActions';

import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
// import Paper from '@material-ui/core/Paper';
// import Typography from '@material-ui/core/Typography';
import { Button } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import UndoIcon from '@material-ui/icons/Undo';
import DoneIcon from '@material-ui/icons/Done';

const styles = theme => ({
  root: {
    marginLeft: '24px',
    marginRight: '24px',
    marginTop: '10px'
  }
});

class WebCam extends Component {
  state = { photoTaken: false, capturedPhotoBase65: null };

  onTakePhoto = dataUri => {
    // let base64str = dataUri.substr(22);
    // let decoded = atob(base64str);
    // alert('FileSize: ' + decoded.length);
    // console.log('FileSize: ' + decoded.length);
    this.setState({
      ...this.state,
      photoTaken: true,
      capturedPhotoBase65: dataUri
    });
  };

  onCameraStart(stream) {}

  onCameraStop() {}

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
    // this.props.uploadUserPhoto(this.state.capturedPhotoBase65);
    this.setState({
      ...this.state,
      photoTaken: false,
      capturedPhotoBase65: null
    });

    this.props.hideCamera();

    return null;
  };

  renderCameraDisplay = () => {
    const { classes } = this.props;
    const { photoTaken, capturedPhotoBase65 } = this.state;

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
              <img
                style={{
                  display: 'inline',
                  margin: '0 auto',
                  // marginLeft: '-25%',
                  marginLeft: '-25px',
                  height: '100%'
                  // width: 'auto'
                }}
                src={capturedPhotoBase65 ? capturedPhotoBase65 : ''}
                alt="captured"
              />
            </div>
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
                  capturedPhotoBase65: null
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
        isSilentMode={true}
        sizeFactor={0.4}
        isMaxResolution={false}
      />
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
