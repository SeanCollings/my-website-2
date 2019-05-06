import React, { Component } from 'react';

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
  state = { loaded: false, mediaCards: [] };

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

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.pageFill}>
        {/* <Header /> */}
        {/* <Loader loaded={this.state.loaded} /> */}
        <Paper title="Welcome" content="Please, have a look around" />
        <div
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex'
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
              marginRight: '10px',
              width: '50%'
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
              width: '50%'
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

export default withStyles(styles)(HomePage);
