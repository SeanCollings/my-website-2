import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import { notificationState, getPublicVapidKey } from '../../actions/appActions';
import { urlBase64ToUint8Array } from '../../utils/utility';

import Button from '@material-ui/core/Button';

import notificationImage from '../../images/fry.png';
import notificationImageSmall from '../../images/fry_small.png';
import notificationIcon from '../../images/icons/icon-96x96.png';
import notificationBadge from '../../images/icons/bat.png';

class SetupNotifications extends Component {
  state = {
    showEnableNotifications: false,
    notificationsButtonText: 'Enable Notifications',
    notificationTypeObtained: false
  };

  componentDidMount() {
    this.checkComponentState();
    if (!this.props.app.publicVapidKey) this.props.getPublicVapidKey();
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
    const { app } = this.props;
    const { notificationTypeObtained } = this.state;

    if (app.notificationState && !notificationTypeObtained) {
      if (app.notificationState === 'prompt') {
        this.setState({ showEnableNotifications: true });
      } else if (app.notificationState === 'denied') {
        this.setState({ notificationsButtonText: 'Notifications Denied' });
      } else {
        this.setState({ notificationsButtonText: 'Notifications Enabled' });
      }
      this.setState({ notificationTypeObtained: true });
    }
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
        data: {
          url: '/notifications'
        },
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
    if (
      'Notification' in window &&
      'serviceWorker' in navigator &&
      'permissions' in navigator
    ) {
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

        this.props.notificationState(result);
      });
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

  render() {
    const { resizeScreen, app } = this.props;
    const { showEnableNotifications, notificationsButtonText } = this.state;

    if (!app.publicVapidKey) return null;

    return (
      <Button
        size={resizeScreen ? 'small' : 'medium'}
        style={{
          color: 'white',
          backgroundColor: '#FF4136',
          minWidth: '250PX',
          marginTop: '24px',
          opacity: showEnableNotifications ? '' : '0.4'
        }}
        onClick={() => this.enableNotificationsClick()}
        disabled={showEnableNotifications ? false : true}
      >
        {notificationsButtonText}
      </Button>
    );
  }
}

function mapStateToProps({ auth, resizeScreen, snackBar, subscriptions, app }) {
  return { auth, resizeScreen, snackBar, subscriptions, app };
}

export default connect(
  mapStateToProps,
  { ...actions, notificationState, getPublicVapidKey }
)(SetupNotifications);
