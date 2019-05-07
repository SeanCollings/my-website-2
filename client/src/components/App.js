import React, { Component } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Loader from 'react-loader-advanced';
import { ScaleLoader } from 'halogenium';
import * as actions from '../actions';

import HomePage from './HomePage';
import ContactPage from './ContactPage';
import ProfilePage from './ProfilePage';
import ProjectsPage from './ProjectsPage';
import CredentialPage from './CredentialPage';
import PererittoPage from './PererittoPage';

import Header from './components/Header';
import Footer from './components/footer';
import { PERERITTO_PATH } from '../utils/constants';
import loadingMessages from '../utils/loadingMessages';

import { Typography } from '@material-ui/core';

class App extends Component {
  state = { pereritto: false, render: false };

  componentDidMount() {
    // this.props.fetchUser();
    // this.props.verifyUser('pereritto');

    setTimeout(
      function() {
        this.setState({ render: true });
        // this.props.fetchUser();
        this.props.fetchUser();
      }.bind(this),
      2000
    );
  }

  renderPage() {
    if (this.props.pererittoUser) {
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

  checkRedirect() {
    if (this.props.pererittoUser !== null) {
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
        minHeight: '98vh',
        backgroundColor: 'white',
        backgroundImage: 'linear-gradient(#FF4136, white 50%)',
        backgroundSize: 'auto 98vh',
        backgroundRepeat: 'no-repeat'
      };
    }

    return {
      minHeight: '98vh',
      backgroundColor: 'white',
      // backgroundImage: 'linear-gradient(#424242, white 50%, #444444 90%)'
      backgroundImage: 'linear-gradient(#424242, white 50%)',
      backgroundSize: 'auto 98vh',
      backgroundRepeat: 'no-repeat'
    };
  }

  render() {
    const spinner = (
      <span>
        <ScaleLoader color="#424242" size="33px" margin="2px" />
        <Typography style={{ color: '#424242' }}>
          {loadingMessages[Math.floor(Math.random() * loadingMessages.length)]}
        </Typography>
      </span>
    );

    if (this.props.auth === null && !this.state.render) {
      return <Loader show message={spinner} style={{ minHeight: '98vh' }} />;
    }

    return (
      <Loader
        contentStyle={this.checkRoute()}
        show={false}
        // message={spinner}
        // messageStyle={{ color: 'darkGrey' }}
        contentBlur={1}
        backgroundStyle={{ backgroundColor: 'none' }}
        style={{ minHeight: '98vh' }}
      >
        <Header pererittoUser={this.props.pererittoUser} />
        <Switch>
          <Route path="/profile" render={props => <ProfilePage {...props} />} />
          <Route path="/contact" render={props => <ContactPage {...props} />} />
          <Route
            path="/projects"
            render={props => <ProjectsPage {...props} />}
          />
          {this.renderPage()}
          {this.props.auth !== false ? null : (
            <Route
              path="/login"
              render={props => <CredentialPage {...props} />}
            />
          )}
          <Route path="/home" render={props => <HomePage {...props} />} />
          {this.checkRedirect()}
        </Switch>
        <Footer />
      </Loader>
    );
  }
}

function mapStateToProps({ auth }) {
  return {
    auth,
    pererittoUser: auth ? auth.pererittoUser : null,
    superUser: auth ? auth.superUser : null
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    actions
  )(App)
);
