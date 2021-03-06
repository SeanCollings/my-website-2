import React, { Component } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Loader from 'react-loader-advanced';
import MiniLoader from 'react-loader-spinner';
// import { ScaleLoader } from 'halogenium';
import * as actions from '../actions';
import {
  showLoader,
  hideLoader,
  getReleaseCreation,
  notificationState,
  locationState,
  getAppSettings,
  updateHeading
} from '../actions/appActions';

import HomePage from './HomePage';
import ContactPage from './ContactPage';
import ProfilePage from './ProfilePage';
import ProjectsPage from './ProjectsPage';
import CredentialPage from './CredentialPage';
import PererittoPage from './PererittoPage';
import MaintenancePage from './MaintenancePage';
import UserProfilePage from './UserProfilePage';
import SettingsPage from './SettingsPage';
import NotificationsPage from './NotificationsPage';
import LocationsPage from './LocationsPage';
import PereryvPage from './PereryvPage';
import DicePage from './dice/DicePage';
import QuizzesPage from './QuizzesPage';

import {
  PERERITTO_PATH,
  MAINTENANCE_PATH,
  DICE_PATH
} from '../utils/constants';
import Header from './components/Header';
import Footer from './components/footer';
import SnackBar from './components/SnackBar';
import loadingMessages from '../utils/loadingMessages';
// import MobileView from './components/MobileView.1';

import { Typography, Toolbar } from '@material-ui/core';
import { verifyAuth } from '../utils/utility';
import { LOCAL_TOKEN } from '../actions/types';

class App extends Component {
  state = {
    pereritto: false,
    render: true,
    welcomeMessage: '',
    settingsCalled: false
  };

  componentDidMount() {
    const welcomeMessage =
      loadingMessages[Math.floor(Math.random() * loadingMessages.length)];

    this.props.getAppSettings();
    this.props.showLoader(welcomeMessage);
    this.setState({ welcomeMessage });
    this.props.fetchUser();

    this.locationState();

    setTimeout(
      function() {
        this.setState({ render: true });
      }.bind(this),
      2000
    );
  }

  componentDidUpdate() {
    const { auth, app, settings } = this.props;
    const { settingsCalled, render } = this.state;

    if (auth !== null && app.open && render) {
      this.props.hideLoader();
      if (verifyAuth(auth)) {
        this.props.getReleaseCreation();
      }
    }

    if (
      verifyAuth(auth) &&
      !localStorage.getItem(LOCAL_TOKEN) &&
      !settings &&
      !settingsCalled
    ) {
      this.setState({ settingsCalled: true });
      this.props.getUserSettings();
    }
    if (
      verifyAuth(auth) &&
      localStorage.getItem(LOCAL_TOKEN) &&
      !settings &&
      !settingsCalled
    ) {
      this.setState({ settingsCalled: true });
      this.props.getUserSettings();
    }
  }

  renderPereritto() {
    // if (this.props.pererittoUser) {
    return (
      <Route
        path={PERERITTO_PATH}
        render={props => (
          <PererittoPage
            {...props}
            superUser={this.props.superUser}
            pereritto={this.state.pereritto}
          />
        )}
      />
    );
    // }

    // return;
  }

  renderUserProfile() {
    const { auth } = this.props;

    if (!auth) {
      return (
        <Route
          path="/aboutme"
          exact
          render={props => <ProfilePage {...props} />}
        />
      );
    }

    const username = `${auth.givenName.toLowerCase()}${auth.familyName.toLowerCase()}`;

    return (
      <Route
        path={`/profile/${username}`}
        render={props => <UserProfilePage {...props} />}
      />
    );
  }

  renderMaintance() {
    if (this.props.superUser) {
      return (
        <Route
          path={MAINTENANCE_PATH}
          render={props => <MaintenancePage {...props} />}
        />
      );
    }

    return;
  }

  renderSettings() {
    const { auth } = this.props;
    if (verifyAuth(auth)) {
      return (
        <Route path="/settings" render={props => <SettingsPage {...props} />} />
      );
    }

    return;
  }

  renderMessaging() {
    const { auth } = this.props;
    if (verifyAuth(auth)) {
      return (
        <Route
          path="/notifications"
          render={props => <NotificationsPage {...props} />}
        />
      );
    }

    return;
  }

  renderLocations() {
    const { auth } = this.props;
    if (verifyAuth(auth)) {
      return (
        <Route
          path="/locations"
          render={props => <LocationsPage {...props} />}
        />
      );
    }

    return;
  }

  renderPereryv() {
    const { auth } = this.props;
    if (verifyAuth(auth) && this.props.pereryvUser) {
      return (
        <Route path="/pervytrev" render={props => <PereryvPage {...props} />} />
      );
    }
    return;
  }

  renderDice() {
    const { app, updateHeading, location } = this.props;

    if (location.pathname === '/dice' && !app.headingName) {
      updateHeading({
        heading: 'Roll Dice',
        previousPage: '/pereritto'
      });
    }
    return <Route path="/dice" render={props => <DicePage {...props} />} />;
  }

  renderQuizzes() {
    const { auth, app, updateHeading, location } = this.props;

    if (verifyAuth(auth)) {
      if (location.pathname.includes('/quizzes/') && !app.headingName) {
        updateHeading({
          heading: 'Create Quiz',
          previousPage: '/quizzes'
        });
      }

      return (
        <Route path="/quizzes" render={props => <QuizzesPage {...props} />} />
      );
    }
    return;
  }

  checkRedirect() {
    if (this.props.pererittoUser !== null) {
      return <Redirect from="/" to="/home" />;
    }

    if (this.props.superUser !== null) {
      return <Redirect from="/" to="/home" />;
    }

    if (this.props.auth === false) {
      return <Redirect to="/home" />;
    }

    if (this.props.auth === null) {
      return;
    }

    return;
  }

  checkRoute() {
    if (this.props.location.pathname === PERERITTO_PATH) {
      return {
        minHeight: '100vh',
        backgroundColor: 'white',
        backgroundRepeat: 'no-repeat',
        backgroundImage:
          'linear-gradient(135deg, #C70039 10%, #FF4136 50%, #FFC300)'
      };
    }

    if (this.props.location.pathname === MAINTENANCE_PATH) {
      return {
        minHeight: '100vh',
        backgroundColor: '#0074D9',
        backgroundRepeat: 'no-repeat',
        // backgroundImage: 'linear-gradient(#0074D9, white 50%)'
        backgroundImage: 'linear-gradient(155deg, #154360,#2980B9, #D4E6F1)'
      };
    }

    if (this.props.location.pathname === DICE_PATH) {
      return {
        minHeight: '100vh',
        backgroundColor: '#900c3f'
      };
    }

    return {
      minHeight: '100vh',
      backgroundColor: '#900C3F',
      // backgroundSize: 'auto 100vh',
      backgroundRepeat: 'no-repeat',
      // backgroundImage: 'linear-gradient(#900C3F, #FF5733)'
      // backgroundImage: 'linear-gradient(155deg, #581845, #900C3F, #FF5733)'
      backgroundImage: 'linear-gradient(155deg, #581845, #900C3F, #bf2323)'
    };
  }

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

  locationState = () => {
    const { app } = this.props;
    if ('geolocation' in navigator && 'permissions' in navigator) {
      navigator.permissions.query({ name: 'geolocation' }).then(status => {
        if (app && !app.locationState) {
          this.props.locationState(status.state);
        }
      });
    }
  };

  render() {
    const colour = '#FFC300'; //'#424242'
    const spinner = (
      <span>
        {/* <ScaleLoader color={colour} size="33px" margin="2px" /> */}
        <div
          style={{
            // marginTop: '7px',
            position: 'absolute',
            right: 'calc(50% - 15px)',
            transform: 'rotate(180deg)'
          }}
        >
          <div
            style={{
              marginTop: '7px',
              position: 'absolute',
              right: 'calc(50% - 3px)'
              // transform: 'rotate(180deg)'
            }}
          >
            <MiniLoader
              type="RevolvingDot"
              color={colour}
              height={20}
              width={20}
            />
          </div>
          {/* <div style={{ transform: 'rotateY(180deg)' }}> */}
          <div style={{ transform: 'rotate(280deg)' }}>
            <MiniLoader
              type="RevolvingDot"
              color={colour}
              height={43}
              width={43}
            />
          </div>
          {/* </div> */}
        </div>
        <MiniLoader type="RevolvingDot" color={colour} height={60} width={60} />
        <Typography style={{ color: colour }}>
          {this.state.welcomeMessage}
        </Typography>
      </span>
    );

    if (this.props.app.open) {
      return (
        <Loader
          show
          message={spinner}
          style={{ minHeight: '100vh' }}
          backgroundStyle={{
            backgroundColor: '#B8860B',
            backgroundImage: 'linear-gradient(#900C3F, #FF5733)'
          }}
        />
      );
    }

    this.notificationState();

    return (
      <Loader contentStyle={this.checkRoute()} show={false}>
        <Header
          pererittoUser={this.props.pererittoUser}
          superUser={this.props.superUser}
          currentRoute={this.props.location.pathname}
        />
        <Toolbar />
        <Switch>
          <Route
            path="/aboutme"
            exact
            render={props => <ProfilePage {...props} />}
          />
          <Route path="/contact" render={props => <ContactPage {...props} />} />
          <Route
            path="/projects"
            render={props => <ProjectsPage {...props} />}
          />
          {this.renderPereritto()}
          {this.renderMaintance()}
          {this.props.auth !== false ? null : (
            <Route
              path="/login"
              render={props => <CredentialPage {...props} />}
            />
          )}
          {this.renderSettings()}
          {this.renderMessaging()}
          {this.renderUserProfile()}
          {this.renderLocations()}
          {this.renderPereryv()}
          {this.renderDice()}
          {this.renderQuizzes()}
          <Route path="/home" render={props => <HomePage {...props} />} />
          {this.checkRedirect()}
        </Switch>
        <SnackBar />
        <Footer pathName={this.props.location.pathname} />
        {/* <MobileView /> */}
      </Loader>
    );
  }
}

function mapStateToProps({ auth, winners, app, settings }) {
  return {
    auth,
    pererittoUser: auth ? auth.pererittoUser : null,
    superUser: auth ? auth.superUser : null,
    pereryvUser: auth ? auth.pereryvUser : null,
    winners,
    app,
    settings
  };
}

export default withRouter(
  connect(mapStateToProps, {
    ...actions,
    showLoader,
    hideLoader,
    getReleaseCreation,
    notificationState,
    locationState,
    getAppSettings,
    updateHeading
  })(App)
);
