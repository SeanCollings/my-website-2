import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Loader from 'react-loader-advanced';
import MiniLoader from 'react-loader-spinner';
import * as actions from '../actions';
import { showMessage } from '../actions/snackBarActions';

import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';

import Button from '@material-ui/core/Button';
// import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { withStyles } from '@material-ui/core/styles';

// import Paper from './components/paper';

const styles = theme => ({
  pageFill: {
    // paddingBottom: '2.5rem'
  },
  root: {
    // display: 'flex',
    // backgroundColor: 'white',
    marginLeft: '24px',
    marginRight: '24px',
    marginTop: '10px'
    // maxWidth: '100%'
    // display: 'initial'
  },
  formControl: {
    margin: theme.spacing.unit * 2
  },
  group: {
    margin: `${theme.spacing.unit}px 0`
  }
});

class UserProfilePage extends Component {
  state = {
    value: '',
    getUserSettings: false,
    firstMount: true,
    showLoader: true,
    uploadPhoto: false,
    capturedPhotoBase65: null,
    photoTaken: null
  };

  componentDidMount() {
    if (!this.props.settings) {
      this.props.getUserSettings();
    } else {
      this.setState({ getUserSettings: false });
    }
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.snackBar.open && this.state.getUserSettings) {
      this.setState({ getUserSettings: false });
      console.log('get settungs');
      this.props.getUserSettings();
    }

    return true;
  }

  componentWillUpdate(props) {
    if (props.settings) {
      if (this.state.firstMount) {
        this.setState({ firstMount: false });
        if (props.settings.profilePic !== this.state.value) {
          this.setState({ value: props.settings.profilePic });
          this.setState({ showLoader: false });
        }
      }
    }
  }

  handleChange = event => {
    this.setState({ value: event.target.value });
  };

  spinner = (
    <span>
      <MiniLoader type="TailSpin" color="#FFC300" height={45} width={45} />
    </span>
  );

  spinnerSmall = (
    <span>
      <MiniLoader type="TailSpin" color="#FFC300" height={30} width={30} />
    </span>
  );

  handleChange = event => {
    this.setState({ value: event.target.value });
  };

  onTakePhoto = dataUri => {
    // let base64str = dataUri.substr(22);
    // let decoded = atob(base64str);
    // console.log('FileSize: ' + decoded.length);
    // console.log('takePhoto', dataUri);
    this.setState({
      ...this.state,
      capturedPhotoBase65: dataUri,
      photoTaken: true
    });
  };

  onCameraStart(stream) {
    // console.log('onCameraStart');
  }

  onCameraStop() {
    console.log('onCameraStop');
  }

  renderCamera = () => {
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
        </div>
      );
    }

    return (
      <div className={classes.root}>
        <Grid item style={{ textAlign: '' }}>
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
            sizeFactor={0.5}
            idealResolution={{ width: 214, height: 160 }}
            isMaxResolution={false}
          />
        </Grid>
      </div>
    );
  };

  avatarSelection() {
    const { classes } = this.props;

    return (
      <div className={classes.root} style={{ backgroundColor: 'white' }}>
        <Loader
          show={this.state.showLoader ? true : false}
          message={this.spinner}
          style={{ width: '100%' }}
        >
          <FormControl component="fieldset" className={classes.formControl}>
            <FormLabel component="legend">Preferred Profile Picture:</FormLabel>
            <RadioGroup
              aria-label="PreferredProfile"
              name="PreferredProfile"
              className={classes.group}
              value={this.state.value}
              onChange={this.handleChange}
            >
              <FormControlLabel
                value="none"
                control={<Radio style={{ padding: '5px' }} />}
                label="None"
              />
              <FormControlLabel
                value="google"
                control={<Radio style={{ padding: '5px' }} />}
                label="Google"
              />
              <FormControlLabel
                value="gravatar"
                control={<Radio style={{ padding: '5px' }} />}
                label="Gravatar"
              />
              <FormControlLabel
                value="uploadedPhoto"
                control={<Radio style={{ padding: '5px' }} />}
                label="Uploaded Photo"
              />
            </RadioGroup>
            {this.renderSubmitButton()}
          </FormControl>
        </Loader>
      </div>
    );
  }

  renderSubmitButton = () => {
    const { resizeScreen } = this.props;
    const { getUserSettings } = this.state;

    return (
      <Loader
        show={getUserSettings ? true : false}
        message={this.props.resizeScreen ? this.spinnerSmall : this.spinner}
        backgroundStyle={{ backgroundColor: '' }}
      >
        <Button
          size={resizeScreen ? 'small' : 'medium'}
          style={{
            color: 'white',
            backgroundColor: '#001f3f',
            opacity: getUserSettings ? '0.4' : '1'
          }}
          onClick={this.submitClick}
          disabled={getUserSettings ? true : false}
        >
          Submit
        </Button>
      </Loader>
    );
  };

  renderUploadCancelButton = () => {
    const { resizeScreen } = this.props;
    const { uploadPhoto, photoTaken } = this.state;

    return (
      <div>
        <Button
          size={resizeScreen ? 'small' : 'medium'}
          style={{
            color: 'white',
            marginTop: '24px',
            minWidth: '100px',
            backgroundColor: uploadPhoto ? '#FF4136' : '#001f3f'
          }}
          onClick={() =>
            this.setState({
              ...this.state,
              uploadPhoto: !uploadPhoto,
              photoTaken: null
            })
          }
        >
          {uploadPhoto ? 'Cancel' : 'Upload a Photo'}
        </Button>
        <Button
          size={resizeScreen ? 'small' : 'medium'}
          style={{
            color: 'white',
            marginTop: '24px',
            marginLeft: '10px',
            minWidth: '100px',
            display: photoTaken ? '' : 'none',
            backgroundColor: '#FF4136'
          }}
          onClick={() =>
            this.setState({
              ...this.state,
              capturedPhotoBase65: null,
              photoTaken: false
            })
          }
        >
          Back
        </Button>
      </div>
    );
  };

  submitClick = event => {
    event.preventDefault();
    this.setState({ shouldCall: true });
    this.setState({ getUserSettings: true });
    this.props.updateProfilePic(this.state.value);
  };

  uploadUserPhoto = () => {
    if (this.state.capturedPhotoBase65)
      this.props.uploadUserPhoto(this.state.capturedPhotoBase65);

    this.setState({
      ...this.state,
      // uploadPhoto: false,
      value: 'uploadedPhoto',
      // capturedPhotoBase65: null,
      // photoTaken: null,
      getUserSettings: true
    });

    // this.props.updateProfilePic('uploadedPhoto');
    // this.props.getUserSettings();
  };

  render() {
    const { classes, auth, resizeScreen } = this.props;
    const { uploadPhoto, photoTaken, getUserSettings } = this.state;

    if (!auth) return null;

    return (
      <div className={classes.pageFill}>
        <Grid>
          <Grid item style={{ textAlign: 'center' }}>
            {!uploadPhoto ? this.avatarSelection() : this.renderCamera()}
            {this.renderUploadCancelButton()}
          </Grid>
          <Grid item style={{ textAlign: 'center', marginTop: '24px' }}>
            <Loader
              show={getUserSettings && uploadPhoto ? true : false}
              message={
                this.props.resizeScreen ? this.spinnerSmall : this.spinner
              }
              backgroundStyle={{ backgroundColor: '' }}
            >
              <Button
                size={resizeScreen ? 'small' : 'medium'}
                style={{
                  color: 'white',
                  minWidth: '100px',
                  display: photoTaken ? '' : 'none',
                  backgroundColor: '#2ECC40',
                  opacity: getUserSettings ? '0.4' : '1'
                }}
                onClick={() => this.uploadUserPhoto()}
              >
                Upload
              </Button>
            </Loader>
          </Grid>
        </Grid>
        <div style={{ height: '40px' }} />
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
