import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import { notificationState, getPublicVapidKey } from '../../actions/appActions';
import { urlBase64ToUint8Array } from '../../utils/utility';
import Loader from 'react-loader-advanced';
import MiniLoader from 'react-loader-spinner';

import ConfirmActionModal from '../modals/ConfirmActionModal';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import InfoIcon from '@material-ui/icons/InfoOutlined';

import notificationImage from '../../images/fry.png';
import notificationImageSmall from '../../images/fry_small.png';
import notificationIcon from '../../images/icons/icon-96x96.png';
import notificationBadge from '../../images/icons/bat.png';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  enableButtons: {
    minWidth: '240px',
    marginTop: '24px'
  },
  infoIcon: {
    paddingLeft: '10px',
    position: 'relative',
    top: '26px',
    color: 'white'
  }
});

class SetupNotifications extends Component {
  state = {
    showEnableNotifications: false,
    notificationsButtonText: 'Enable Notifications',
    notificationTypeObtained: false,
    updating: false,
    showModal: false
  };

  componentDidMount() {
    this.checkComponentState();
    if (!this.props.app.publicVapidKey) this.props.getPublicVapidKey();
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.snackBar.open && this.state.updating) {
      this.props.fetchUser();
      this.setState({ updating: false });
    }

    return true;
  }

  componentDidUpdate() {
    const { subscriptions } = this.props;

    if (subscriptions && subscriptions.subscription === 'OK') {
      this.displayConfirmNotification();
      this.props.setSubscriptionNull();
      this.props.userAllowsNotifications();
    }

    this.checkComponentState();
  }

  checkComponentState() {
    const { app, auth } = this.props;
    const { notificationTypeObtained } = this.state;

    if (app.notificationState && !notificationTypeObtained) {
      if (app.notificationState === 'prompt') {
        this.setState({ showEnableNotifications: true });
      } else if (app.notificationState === 'denied') {
        this.setState({ notificationsButtonText: 'Notifications Denied' });
      } else {
        if (auth.allowNotifications) {
          this.setState({
            ...this.state,
            notificationsButtonText: 'Disable Notifications',
            showEnableNotifications: true
          });
        } else {
          this.setState({
            ...this.state,
            notificationsButtonText: 'Enable Notifications',
            showEnableNotifications: true
          });
        }
      }
      this.setState({ notificationTypeObtained: true });
    }
  }

  displayConfirmNotification = () => {
    if ('serviceWorker' in navigator) {
      var options = {
        body:
          'You have subscribed to the Pure Seanography notification service',
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
        data: {
          url: '/notifications'
        }
        // actions: [
        //   {
        //     action: 'confirm',
        //     title: 'Okay',
        //     icon: notificationIcon
        //   },
        //   {
        //     action: 'cancel',
        //     title: 'Cancel',
        //     icon: notificationIcon
        //   }
        // ]
      };

      navigator.serviceWorker.ready.then(function(swreg) {
        swreg.showNotification('Successfully subscribed', options);
      });
    }
  };

  configurePushSub = async () => {
    if (!('serviceWorker' in navigator)) {
      return;
    }
    try {
      let reg;
      navigator.serviceWorker.ready
        .then(swreg => {
          reg = swreg;
          return swreg.pushManager.getSubscription();
        })
        .then(sub => {
          console.log('Checking the sub', sub);
          if (sub === null) {
            // Create new subscription
            const vapidPublicKey = this.props.app.publicVapidKey;
            const convertedVapidPublicKey = urlBase64ToUint8Array(
              vapidPublicKey
            );

            return reg.pushManager
              .subscribe({
                userVisibleOnly: true,
                applicationServerKey: convertedVapidPublicKey
              })
              .then(newSub => {
                this.props.updateSubscriptions(newSub);
                this.props.userAllowsNotifications();
                this.setState({ updating: false });
              });
          } else {
            // We have a subscription
            console.log('User already subscribed');
          }
        })
        .catch(err => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  };

  enableNotificationsClick = () => {
    const { auth } = this.props;

    if (
      'Notification' in window &&
      'serviceWorker' in navigator &&
      'permissions' in navigator
    ) {
      this.setState({ updating: true });
      Notification.requestPermission(result => {
        console.log('User Choice', result);
        if (result !== 'granted') {
          console.log('No notification permission granted!');
          this.setState({
            ...this.state,
            showEnableNotifications: false,
            notificationsButtonText: 'Notifications Denied',
            updating: false
          });
        } else {
          console.log('Notifications granted!');
          this.setState({
            ...this.state,
            // showEnableNotifications: false,
            notificationsButtonText: 'Disable Notifications'
          });

          if (!auth.allowNotifications) {
            navigator.serviceWorker.ready
              .then(swreg => {
                return swreg.pushManager.getSubscription();
              })
              .then(sub => {
                console.log('Can we auto unsubscribe', sub);
                if (sub !== null) {
                  return sub.unsubscribe().then(success => {
                    if (success) {
                      this.props.disableNotifications(false);
                      this.configurePushSub();
                    }
                  });
                } else {
                  this.configurePushSub();
                  console.log('User cannot be found');
                }
              })
              .catch(err => {
                console.log(err);
              });

            // this.disableNotificationsClick();
          } else {
            this.configurePushSub();
          }
        }

        this.props.notificationState(result);
      });
    }
  };

  setNotificationsToDisabled = () => {
    this.setState({
      ...this.state,
      notificationsButtonText: 'Enable Notifications',
      updating: true
    });
    this.props.disableNotifications(true);
  };

  disableNotificationsClick = () => {
    this.setState({ showModal: false });

    if (!('serviceWorker' in navigator)) {
      return;
    }
    try {
      navigator.serviceWorker.ready
        .then(swreg => {
          return swreg.pushManager.getSubscription();
        })
        .then(sub => {
          console.log('Can we unsubscribe', sub);
          if (sub !== null) {
            return sub.unsubscribe().then(success => {
              if (success) {
                this.setNotificationsToDisabled();
              }
            });
          } else {
            console.log('User cannot be found');
            this.setNotificationsToDisabled();
          }
        })
        .catch(err => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  };

  notificationState = () => {
    const { app } = this.props;
    if (
      'Notification' in window &&
      'serviceWorker' in navigator &&
      'permissions' in navigator
    ) {
      navigator.permissions.query({ name: 'notifications' }).then(status => {
        if (app && !app.notificationState) {
          this.props.notificationState(status.state);
        }
      });
    }
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

  render() {
    const { resizeScreen, app, classes, auth } = this.props;
    const {
      showEnableNotifications,
      notificationsButtonText,
      updating,
      showModal
    } = this.state;

    if (!app.publicVapidKey) return null;

    return (
      <Grid item style={{ display: 'inline-flex' }}>
        <Loader
          show={updating ? true : false}
          message={resizeScreen ? this.spinnerSmall : this.spinner}
          backgroundStyle={{ backgroundColor: 'transparent' }}
          messageStyle={{ paddingTop: '24px' }}
        >
          <Button
            className={classes.enableButtons}
            size={resizeScreen ? 'small' : 'medium'}
            style={{
              color: 'white',
              backgroundColor: '#FF4136',
              opacity: showEnableNotifications && !updating ? '' : '0.4'
            }}
            onClick={() =>
              !auth.allowNotifications || app.notificationState === 'prompt'
                ? this.enableNotificationsClick()
                : this.setState({ showModal: true })
            }
            disabled={showEnableNotifications && !updating ? false : true}
          >
            {notificationsButtonText}
          </Button>
          <ConfirmActionModal
            showModal={showModal}
            title={'Warning!'}
            message={'Are you sure you want to disable notifications?'}
            confirmClick={() => this.disableNotificationsClick()}
            cancelClick={() => this.setState({ showModal: false })}
          />
        </Loader>
        <InfoIcon
          className={classes.infoIcon}
          style={{ opacity: showEnableNotifications ? '' : '0.4' }}
        />
      </Grid>
    );
  }
}

function mapStateToProps({ auth, resizeScreen, snackBar, subscriptions, app }) {
  return { auth, resizeScreen, snackBar, subscriptions, app };
}

export default connect(
  mapStateToProps,
  { ...actions, notificationState, getPublicVapidKey }
)(withStyles(styles)(SetupNotifications));
