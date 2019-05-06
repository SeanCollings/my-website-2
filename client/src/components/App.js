import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Loader from 'react-loader-advanced';
import { ScaleLoader } from 'halogenium';
import * as actions from '../actions';

import HomePage from './HomePage';
import ContactPage from './ContactPage';
import ProfilePage from './ProfilePage';
import ProjectsPage from './ProjectsPage';
import CredentialPage from './CredentialPage';
import Header from './components/Header';
import Footer from './components/footer';

class App extends Component {
  componentDidMount() {
    this.props.fetchUser();
  }

  render() {
    const spinner = (
      <span>
        <ScaleLoader color="#424242" size="33px" margin="2px" />
      </span>
    );

    return (
      <BrowserRouter>
        <Loader
          contentStyle={{ minHeight: '100vh' }}
          show={this.props.auth !== null ? false : true}
          message={spinner}
          messageStyle={{ color: 'darkGrey' }}
          contentBlur={1}
          backgroundStyle={{ backgroundColor: 'none' }}
          style={{ minHeight: '100vh' }}
        >
          <Header />
          <Switch>
            <Route
              path="/profile"
              render={props => <ProfilePage {...props} />}
            />
            <Route
              path="/contact"
              render={props => <ContactPage {...props} />}
            />
            <Route
              path="/projects"
              render={props => <ProjectsPage {...props} />}
            />
            {this.props.auth ? null : (
              <Route
                path="/login"
                render={props => <CredentialPage {...props} />}
              />
            )}
            <Route path="/home" render={props => <HomePage {...props} />} />
            <Redirect from="/" to="/home" />
          </Switch>
          <Footer />
        </Loader>
      </BrowserRouter>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(
  mapStateToProps,
  actions
)(App);
