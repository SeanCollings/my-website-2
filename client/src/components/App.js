import React, { Component } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Loader from 'react-loader-advanced';
import MiniLoader from 'react-loader-spinner';
// import { ScaleLoader } from 'halogenium';
import * as actions from '../actions';
import { showLoader, hideLoader } from '../actions/appActions';

import HomePage from './HomePage';
import ContactPage from './ContactPage';
import ProfilePage from './ProfilePage';
import ProjectsPage from './ProjectsPage';
import CredentialPage from './CredentialPage';
import PererittoPage from './PererittoPage';
import MaintenancePage from './MaintenancePage';
import UserProfilePage from './UserProfilePage';

import { PERERITTO_PATH, MAINTENANCE_PATH } from '../utils/constants';
import Header from './components/Header';
import Footer from './components/footer';
import SnackBar from './components/SnackBar';
import loadingMessages from '../utils/loadingMessages';
// import MobileView from './components/MobileView.1';

import { Typography } from '@material-ui/core';

class App extends Component {
  state = { pereritto: false, render: false, welcomeMessage: '' };

  componentDidMount() {
    console.log('Start Loader');
    const welcomeMessage =
      loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
    this.props.showLoader(welcomeMessage);

    this.setState({ welcomeMessage });

    this.props.fetchUser();
    this.props.getUserSettings();

    setTimeout(
      function() {
        this.setState({ render: true });
      }.bind(this),
      2000
    );
  }

  componentDidUpdate() {
    if (this.props.auth && this.props.app.open) {
      console.log('STOP Loader! !');
      this.props.hideLoader();
    }
  }

  renderPereritto() {
    if (this.props.pererittoUser) {
      if (
        !this.props.winners &&
        this.props.location.pathname !== PERERITTO_PATH
      ) {
        this.props.getWinners();
      }

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
    }

    return;
  }

  renderUserProfile() {
    const { auth } = this.props;

    if (!auth) {
      return (
        <Route
          path="/profile"
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

    return {
      minHeight: '100vh',
      backgroundColor: '#900C3F',
      // backgroundSize: 'auto 100vh',
      backgroundRepeat: 'no-repeat',
      // backgroundImage: 'linear-gradient(#900C3F, #FF5733)'
      backgroundImage: 'linear-gradient(155deg, #581845, #900C3F, #FF5733)'
    };
  }

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
            <MiniLoader type="Oval" color={colour} height={20} width={20} />
          </div>
          <MiniLoader type="Oval" color={colour} height={43} width={43} />
        </div>
        <MiniLoader type="Oval" color={colour} height={60} width={60} />
        <Typography style={{ color: colour }}>
          {this.state.welcomeMessage}
        </Typography>
      </span>
    );

    if (!this.state.render) {
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

    return (
      <Loader contentStyle={this.checkRoute()} show={false}>
        <Header
          pererittoUser={this.props.pererittoUser}
          superUser={this.props.superUser}
        />
        <Switch>
          <Route
            path="/profile"
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
          {this.renderUserProfile()}
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

function mapStateToProps({ auth, winners, app }) {
  return {
    auth,
    pererittoUser: auth ? auth.pererittoUser : null,
    superUser: auth ? auth.superUser : null,
    winners,
    app
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    { ...actions, showLoader, hideLoader }
  )(App)
);
