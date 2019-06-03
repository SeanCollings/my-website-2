import React, { Component } from 'react';
import { connect } from 'react-redux';

import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

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
      return `Welcome, ${auth.givenName}`;
    }

    return 'Welcome';
  }

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
        </div>
        {this.displayCards()}
        <div
          style={this.state.mediaCards.length > 0 ? { height: '20px' } : {}}
        />
        {/* <Footer /> */}
      </div>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps)(withStyles(styles)(HomePage));
