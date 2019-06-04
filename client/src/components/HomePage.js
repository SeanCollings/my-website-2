import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';

import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

// import Header from './components/Header';
// import Loader from './loaderCircular';
// import Loader from './components/loaderLinear';
import Paper from './components/paper';
import MediaCard from './components/MediaCard';
// import Footer from './components/footer';

import { urlBase64ToUint8Array } from '../utils/utility';
import notificationImage from '../images/fry.png';
import notificationImageSmall from '../images/fry_small.png';
import notificationIcon from '../images/icons/icon-96x96.png';
import notificationBadge from '../images/icons/bat.png';

const styles = theme => ({
  margin: {
    marginTop: '30px'
  },
  pageFill: {
    paddingBottom: '2.5rem'
  }
});

class HomePage extends Component {
  state = { loaded: false, mediaCards: [], name: '' };

  componentDidUpdate() {
    const { subscriptions } = this.props;

    if (subscriptions && subscriptions.subscription === 'OK') {
      console.log(
        'In HomePage - subscription was OK',
        subscriptions.subscription
      );
      this.displayConfirmNotification();
      this.props.setSubscriptionNull();
    }
  }

  addMediaCard() {
    const numCards = this.state.mediaCards.length;
    const newMediaCards = [];
    newMediaCards.push(numCards);
    this.setState({ mediaCards: [...this.state.mediaCards, newMediaCards] });
  }

  removeMediaCard() {
    if (this.state.mediaCards.length > 0) {
      let removeMediaCards = this.state.mediaCards;
      removeMediaCards.pop();
      this.setState({ removeMediaCards });
    }
  }

  displayCards() {
    return this.state.mediaCards.map(card => {
      return <MediaCard key={card} />;
    });
  }

  renderName() {
    const { auth } = this.props;
    if (auth) {
      return `Welcome, ${auth.givenName}`;
    }

    return 'Welcome';
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
            var vapidPublicKey =
              'BHgha8FLKBDBXtfJIJuDZbiLYtluV0mgg7l0QXhTraSt203FJAAAQpW4E018QCuWztW_qZcb_J3sKjd-RB_-nYw';
            var convertedVapidPublicKey = urlBase64ToUint8Array(vapidPublicKey);

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

      //   const swreg = await navigator.serviceWorker.ready;
      //   const sub = await swreg.pushManager.getSubscription();

      //   if (sub === null) {
      //     // Create a new subscription
      //     const vapidPublicKey =
      //       'BHgha8FLKBDBXtfJIJuDZbiLYtluV0mgg7l0QXhTraSt203FJAAAQpW4E018QCuWztW_qZcb_J3sKjd-RB_-nYw';
      //     const convertedVapidPublicKey = urlBase64ToUint8Array(vapidPublicKey);
      //     const newSub = await swreg.pushManager.subscribe({
      //       userVisibleOnly: true,
      //       applicationServerKey: convertedVapidPublicKey
      //     });

      //     this.props.updateSubscriptions(newSub);
      //   } else {
      //     // We have a subscription
      //   }

      //   // this.displayConfirmNotification();
    } catch (err) {
      console.log(err);
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

  sendSplash = () => {
    console.log('Sending Splash');
    this.props.testNotification();
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.pageFill}>
        {/* <Header /> */}
        {/* <Loader loaded={this.state.loaded} /> */}
        <Paper
          // title={this.renderName()}
          content="Please, have a look around"
        />
        <div
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex',
            paddingTop: '10px'
          }}
        >
          <Button
            onClick={() => {
              this.addMediaCard();
            }}
            style={{
              backgroundColor: '#DEDEDE',
              // backgroundColor: '#FF4136',
              color: '#424242',
              marginRight: '5%',
              width: '30%'
            }}
          >
            Add Card
          </Button>
          <Button
            onClick={() => {
              this.removeMediaCard();
            }}
            style={{
              backgroundColor: '#DEDEDE',
              // color: '#FF4136',
              color: '#424242',
              width: '30%'
            }}
          >
            Remove
          </Button>
          <Button
            onClick={this.enableNotificationsClick}
            style={{
              backgroundColor: '#DEDEDE',
              // color: '#FF4136',
              color: '#424242',
              width: '30%'
            }}
          >
            Notification
          </Button>
        </div>
        {this.displayCards()}
        <Button
          onClick={this.sendSplash}
          style={{
            backgroundColor: '#0074D9',
            // color: '#FF4136',
            color: 'white',
            width: '30%'
          }}
        >
          Send Splash
        </Button>
        <div
          style={this.state.mediaCards.length > 0 ? { height: '20px' } : {}}
        />
        {/* <Footer /> */}
      </div>
    );
  }
}

function mapStateToProps({ auth, subscriptions }) {
  return { auth, subscriptions };
}

export default connect(
  mapStateToProps,
  actions
)(withStyles(styles)(HomePage));
