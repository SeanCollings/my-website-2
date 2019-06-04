import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Loader from 'react-loader-advanced';
import MiniLoader from 'react-loader-spinner';
import * as actions from '../actions';
import { showMessage } from '../actions/snackBarActions';
import { removeDeferredPrompt } from '../actions/appActions';

import Button from '@material-ui/core/Button';
// import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { withStyles } from '@material-ui/core/styles';

import notificationImage from '../images/fry.png';
import notificationImageSmall from '../images/fry_small.png';
import notificationIcon from '../images/icons/icon-96x96.png';
import notificationBadge from '../images/icons/bat.png';

// import Paper from './components/paper';

const styles = theme => ({
  pageFill: {},
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
    showEnableLocation: false,
    showAddToHomeScreen: false,
    addToHomeScreenText: 'Add to Home Screen',
    locationButtonText: 'Enable Location',
    showEnableNotifications: false,
    notificationsButtonText: 'Enable Notifications'
  };

  componentDidMount() {
    const { app, settings } = this.props;

    if (!settings) {
      this.props.getUserSettings();
    } else {
      this.setState({ getUserSettings: false });
    }

    // Check if can add to home screen
    if (app && app.deferredPrompt) {
      this.setState({ showAddToHomeScreen: true });
    }

    // Check for location permissions
    if ('geolocation' in navigator) {
      navigator.permissions.query({ name: 'geolocation' }).then(status => {
        // console.log('geolocation', status.state);
        if (status.state === 'prompt') {
          this.setState({ showEnableLocation: true });
        } else if (status.state === 'denied') {
          this.setState({ locationButtonText: 'Location Denied' });
        } else {
          this.setState({ locationButtonText: 'Location Enabled' });
        }
      });
    }

    // Only show notifications buttons if browser allows
    if ('Notification' in window && 'serviceWorker' in navigator) {
      navigator.permissions.query({ name: 'notifications' }).then(status => {
        // console.log('notifications', status.state);
        if (status.state === 'prompt') {
          this.setState({ showEnableNotifications: true });
        } else if (status.state === 'denied') {
          this.setState({ notificationsButtonText: 'Notifications Denied' });
        } else {
          this.setState({ notificationsButtonText: 'Notifications Enabled' });
        }
      });
    }
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.snackBar.open && this.state.getUserSettings) {
      this.setState({ getUserSettings: false });
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
            <FormLabel component="legend">Select an avatar:</FormLabel>
            <RadioGroup
              aria-label="PreferredProfile"
              name="PreferredProfile"
              className={classes.group}
              value={this.state.value}
              onChange={this.handleChange}
            >
              <FormControlLabel
                value="profilePhoto"
                control={<Radio style={{ padding: '5px' }} />}
                label="Profile Photo"
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
            </RadioGroup>
            {this.renderSubmitButton()}
          </FormControl>
        </Loader>
      </div>
    );
  }

  displayConfirmNotification = () => {
    if ('serviceWorker' in navigator) {
      var options = {
        body: 'Succesfully subscribed to Pure Seanography!',
        icon: notificationIcon,
        image: this.props.resizeScreen
          ? notificationImage
          : notificationImageSmall,
        dir: 'ltr',
        lang: 'en-UK',
        vibrate: [100, 50, 200],
        badge: notificationBadge,
        tag: 'confirm-notification',
        renotify: true,
        actions: [
          {
            action: 'confirm',
            title: 'Okay',
            icon: notificationIcon
          },
          {
            action: 'cancel',
            title: 'Cancel',
            icon: notificationIcon
          }
        ]
      };

      navigator.serviceWorker.ready.then(function(swreg) {
        swreg.showNotification('Successfully subscribed!', options);
      });
    }
  };

  configurePushSub = () => {
    if (!('serviceWorker' in navigator)) {
      return;
    }
    this.displayConfirmNotification();
  };

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

  addToHomeScreenClick = () => {
    console.log('addToHomeScreenClick');
    const { app } = this.props;

    if (app && app.deferredPrompt) {
      app.deferredPrompt.prompt();

      app.deferredPrompt.userChoice.then(function(choiceResult) {
        console.log(choiceResult.outcome);

        if (choiceResult.outcome === 'dismissed') {
          console.log('User cancelled installation');
          this.setState({ addToHomeScreenText: 'Add to Home Screen' });
        } else {
          console.log('User added to home screen');
          this.setState({ addToHomeScreenText: 'Added to Home Screen' });
        }
      });

      this.props.removeDeferredPrompt();
    }
  };

  enableNotificationsClick = () => {
    if ('Notification' in window && 'serviceWorker' in navigator) {
      Notification.requestPermission(result => {
        console.log('User Choice', result);
        if (result !== 'granted') {
          console.log('No notification permission granted!');
          this.setState({
            ...this.state,
            showEnableNotifications: false,
            notificationsButtonText: 'Notifications Denied'
          });
        } else {
          console.log('Notifications granted!');
          this.setState({
            ...this.state,
            showEnableNotifications: false,
            notificationsButtonText: 'Notifications Enabled'
          });
          this.configurePushSub();
        }
      });
    }
  };

  enableLocationClick = () => {
    console.log('enableLocationClick');
    // navigator.geolocation.getCurrentPosition(
    //   position => {
    //     this.setState({
    //       ...this.state,
    //       showEnableLocation: false,
    //       locationButtonText: 'Location Enabled'
    //     });
    //   },
    //   err => {
    //     console.log('error:', err);
    //     this.setState({
    //       ...this.state,
    //       showEnableLocation: false,
    //       locationButtonText: 'Location Denied'
    //     });
    //   },
    //   { timeout: Infinity }
    // );
  };

  renderEnableButtons = () => {
    const { resizeScreen, auth } = this.props;
    const {
      showEnableLocation,
      showEnableNotifications,
      locationButtonText,
      notificationsButtonText,
      showAddToHomeScreen
    } = this.state;

    return (
      <Grid item style={{ textAlign: 'center' }}>
        <Grid item>
          <Button
            size={resizeScreen ? 'small' : 'medium'}
            style={{
              color: 'white',
              backgroundColor: '#FF4136',
              minWidth: '250px',
              marginTop: '24px',
              opacity: showAddToHomeScreen ? '' : '0.4'
            }}
            onClick={this.addToHomeScreenClick}
            disabled={showAddToHomeScreen ? false : true}
          >
            Add to Home screen
          </Button>
        </Grid>
        <Grid item>
          <Button
            size={resizeScreen ? 'small' : 'medium'}
            style={{
              color: 'white',
              backgroundColor: '#FF4136',
              minWidth: '250PX',
              marginTop: '24px',
              opacity: showEnableNotifications && auth.superUser ? '' : '0.4'
            }}
            onClick={this.enableNotificationsClick}
            disabled={showEnableNotifications && auth.superUser ? false : true}
          >
            {notificationsButtonText}
          </Button>
        </Grid>
        <Grid item>
          <Button
            size={resizeScreen ? 'small' : 'medium'}
            style={{
              color: 'white',
              backgroundColor: '#FF4136',
              minWidth: '250px',
              marginTop: '24px',
              opacity: showEnableLocation ? '' : '0.4'
            }}
            onClick={this.enableLocationClick}
            disabled={showEnableLocation ? false : true}
          >
            {locationButtonText}
          </Button>
        </Grid>
      </Grid>
    );
  };

  submitClick = event => {
    event.preventDefault();
    this.setState({ getUserSettings: true });
    this.props.updateProfilePic(this.state.value);
  };

  render() {
    const { classes, auth } = this.props;
    const { uploadPhoto, getUserSettings } = this.state;

    if (!auth) return null;

    return (
      <div className={classes.pageFill}>
        <Grid>
          <Grid item style={{ textAlign: 'center' }}>
            {this.avatarSelection()}
          </Grid>
          <Grid item style={{ textAlign: 'center', marginTop: '24px' }}>
            <Loader
              show={getUserSettings && uploadPhoto ? true : false}
              message={
                this.props.resizeScreen ? this.spinnerSmall : this.spinner
              }
              backgroundStyle={{ backgroundColor: '' }}
            />
          </Grid>
          {this.renderEnableButtons()}
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
  { ...actions, showMessage, removeDeferredPrompt }
)(withStyles(styles)(UserProfilePage));
