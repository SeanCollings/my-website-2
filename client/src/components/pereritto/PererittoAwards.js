import React, { Component } from 'react';
import { connect } from 'react-redux';

import './PererittoAwards.css';

import { Typography } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import { withStyles } from '@material-ui/core/styles';

import trophy from '../../images/trophy.png';
import coffeeSmall from '../../images/coffee_small.png';
import diceSmall from '../../images/dice_small.png';
import habaneroSmall from '../../images/habanero_small.png';
import medalmall from '../../images/medal_small.png';
import silverSmall from '../../images/silver_small.png';
import starSmall from '../../images/star_small.png';

const styles = theme => ({
  root: {},
  award: {
    height: '50px',
    width: '50px',
    borderRadius: 0,
    zIndex: '2',
    top: '35px',
    display: 'inline-block'
  }
});

class PererittoAwards extends Component {
  state = {
    awardMessage: '. Wall of Flame .',
    shelvesRendered: false,
    awards: [
      { image: trophy, title: 'Current Winner', canFall: true },
      { image: coffeeSmall, title: 'Current 2nd Place', canFall: true },
      { image: diceSmall, title: 'Current 3nd Place', canFall: false },
      { image: habaneroSmall, title: 'Current Last Winner', canFall: false },
      { image: medalmall, title: '3 in a row!', canFall: false },
      { image: silverSmall, title: 'Winner 2018!', canFall: true },
      { image: starSmall, title: 'Player 2019', canFall: false }
    ]
  };

  renderShelves = () => {
    const { classes } = this.props;
    const { awards } = this.state;

    const awardsPerShelf = 3;
    const shelfArray = [];
    const originalMessage = '. Wall of Flame .';

    let numberOfShelves = Math.ceil(awards.length / awardsPerShelf);
    numberOfShelves = numberOfShelves < 2 ? 2 : numberOfShelves;

    for (let i = 0; i < numberOfShelves; i++) {
      const awardArray = [];

      for (
        let j = i * awardsPerShelf;
        j < i * awardsPerShelf + awardsPerShelf;
        j++
      ) {
        if (awards[j]) {
          const fall = Math.random() < 0.01;
          awardArray.push(
            <Avatar
              key={`${i}${j}`}
              style={{
                transform: fall && awards[j].canFall ? 'rotate(75deg)' : '',
                marginTop: fall && awards[j].canFall ? '4px' : ''
              }}
              className={classes.award}
              alt={awards[j].title}
              src={awards[j].image}
              onClick={() => this.setState({ awardMessage: awards[j].title })}
            />
          );
        } else {
          break;
        }
      }

      shelfArray.push(
        <div className="shelf" key={i}>
          <div
            className="back"
            onClick={() => this.setState({ awardMessage: originalMessage })}
          />
          <div
            className="base"
            onClick={() => this.setState({ awardMessage: originalMessage })}
          />
          <div className="front" />
          <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
            {awardArray.map(award => award)}
          </div>
        </div>
      );
    }

    return shelfArray;
  };

  render() {
    const { auth } = this.props;
    const { awardMessage } = this.state;
    return auth && auth.superUser ? (
      <div
        style={{
          width: '300px',
          maxWidth: '90%',
          marginTop: '-34px'
        }}
      >
        <div className="plaque-border">
          <div className="plaque-interior">
            <Typography
              style={{
                top: '25px',
                position: 'relative',
                transform: 'rotateX(20deg)',
                color: '#3e0c00'
              }}
              className="plaque-text"
            >
              {awardMessage}
            </Typography>
          </div>
        </div>
        <div className="cabinet">
          <div className="cabinet-top" />
          {this.renderShelves()}
        </div>
      </div>
    ) : (
      <Typography>Awards Coming Soon...</Typography>
    );
  }
}

function mapStateToProps({ resizeScreen, auth }) {
  return {
    resizeScreen,
    auth
  };
}

export default connect(mapStateToProps)(withStyles(styles)(PererittoAwards));
