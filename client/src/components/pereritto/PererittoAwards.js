import React, { Component } from 'react';
import { connect } from 'react-redux';

import './PererittoAwards.css';

// import { Typography } from '@material-ui/core';
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
    awards: [
      { image: trophy, title: '1', canFall: true },
      { image: coffeeSmall, title: '2', canFall: true },
      { image: diceSmall, title: '3', canFall: false },
      { image: habaneroSmall, title: '4', canFall: false },
      { image: medalmall, title: '5', canFall: false },
      { image: silverSmall, title: '6', canFall: true },
      { image: starSmall, title: '7', canFall: false }
    ]
  };

  renderShelves = () => {
    const { classes } = this.props;
    const { awards } = this.state;
    const awardsPerShelf = 3;
    let numberOfShelves = Math.ceil(awards.length / awardsPerShelf);
    numberOfShelves = numberOfShelves < 2 ? 2 : numberOfShelves;
    const shelfArray = [];

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
              onClick={() => console.log(awards[j].title)}
            />
          );
        } else {
          break;
        }
      }

      shelfArray.push(
        <div className="shelf" key={i}>
          <div className="back" />
          <div className="base" />
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
    return (
      <div
        style={{
          width: '300px',
          paddingTop: '20%',
          maxWidth: '90%'
        }}
      >
        <div className="cabinet">
          <div className="cabinet-top" />
          {this.renderShelves()}
        </div>
      </div>
    );
  }
}

function mapStateToProps({ resizeScreen }) {
  return {
    resizeScreen
  };
}

export default connect(mapStateToProps)(withStyles(styles)(PererittoAwards));
