import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { NavLink } from 'react-router-dom';
// import SetupNotifications from './settings/SetupNotifications';

import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
// import Header from './components/Header';
// import Loader from './loaderCircular';
// import Loader from './components/loaderLinear';
import Paper from './components/paper';
import MediaCard from './components/MediaCard';
// import Footer from './components/footer';

const styles = theme => ({
  margin: {
    marginTop: '30px'
  },
  pageFill: {
    paddingBottom: '2.5rem'
  },
  content: {
    padding: '12px 12px 0px 12px',
    maxWidth: '400px',
    color: '#dedede',
    margin: 'auto',
    textAlign: 'center'
  },
  textColor: {
    color: '#dedede'
  }
});

class HomePage extends Component {
  state = { loaded: false, mediaCards: [], name: '' };

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
      return `Welcome back, ${auth.givenName}`;
    }

    return 'Welcome';
  }

  renderButtons() {
    const { pereryvUser } = this.props;
    return (
      <Grid
        container
        direction="column"
        alignItems="center"
        justify="center"
        style={{ marginTop: '20px' }}
      >
        <NavLink to="/pereritto" style={{ textDecoration: 'none' }}>
          <Button
            style={{
              background: '#c70039',
              color: '#dedede'
            }}
          >
            Pereritto
          </Button>
        </NavLink>
        <div style={{ marginBottom: '25px' }} />
        <NavLink to="/notifications" style={{ textDecoration: 'none' }}>
          <Button
            style={{
              background: 'transaparent',
              border: '1px solid #ffc300',
              color: '#ffc300'
            }}
          >
            Notifications
          </Button>
        </NavLink>
        <div style={{ marginBottom: '25px' }} />
        <NavLink to="/locations" style={{ textDecoration: 'none' }}>
          <Button
            style={{
              background: 'transaparent',
              border: '1px solid #ffc300',
              color: '#ffc300'
            }}
          >
            Locations
          </Button>
        </NavLink>
        <div style={{ marginBottom: '25px' }} />
        {pereryvUser && (
          <NavLink to="/pervytrev" style={{ textDecoration: 'none' }}>
            <Button
              style={{
                background: 'transaparent',
                border: '1px solid #ffc300',
                color: '#ffc300'
              }}
            >
              Pervytrev
            </Button>
          </NavLink>
        )}
        <div style={{ marginBottom: '25px' }} />
        <NavLink to="/quizzes" style={{ textDecoration: 'none' }}>
          <Button
            style={{
              background: '#0055dd',
              border: '1px solid #ffc300',
              color: '#ffc300'
            }}
          >
            Quizzes
          </Button>
        </NavLink>
      </Grid>
    );
  }

  render() {
    const { classes, auth } = this.props;

    return (
      <div className={classes.pageFill}>
        {/* <Header /> */}
        {/* <Loader loaded={this.state.loaded} /> */}
        <Paper
          // title={this.renderName()}
          // content="Please, have a look around"
          content={this.renderName()}
        />
        <Paper content={auth ? 'Where to today?' : ''} />
        <div
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            display: 'none',
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
        </div>
        {!auth && (
          <div className={classes.content}>
            <Typography paragraph className={classes.textColor}>
              The fun all begins with Pereritto.
            </Typography>
            <Typography paragraph className={classes.textColor}>
              No need to login to view the weekly winners of the infamous
              Habanero Roulette. Head straight to the Pereritto page to see who
              the lucky loser is.
            </Typography>
            <Typography paragraph className={classes.textColor}>
              If you do feel like signing in, there are a few other fun
              tiddly-bits on display. [Notifications] allows users to notifiy
              other users, strangely enough, and [Locations] allows users to see
              the real-time location of other users in the same group (unless
              they have a Nokia 8).
            </Typography>
            <Typography paragraph className={classes.textColor}>
              Only Google OAuth works at the moment to log in. The other 'enter
              your credentials' area is just for good looking.
            </Typography>
            <Typography paragraph className={classes.textColor}>
              PS: This app is designed mobile-first, so some of the desktop
              views may not be styled correctly just yet...
            </Typography>
          </div>
        )}
        {auth && this.renderButtons()}
        {this.displayCards()}
        {/* <SetupNotifications /> */}
        <div
          style={this.state.mediaCards.length > 0 ? { height: '20px' } : {}}
        />
        {/* <Footer /> */}
      </div>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth, pereryvUser: auth ? auth.pereryvUser : null };
}

export default connect(mapStateToProps, actions)(withStyles(styles)(HomePage));
