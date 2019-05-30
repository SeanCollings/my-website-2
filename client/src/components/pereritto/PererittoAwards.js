import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';

import './PererittoAwards.css';

import { Typography } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import { withStyles } from '@material-ui/core/styles';

// import trophy from '../../images/trophy.png';
// import coffeeSmall from '../../images/coffee_small.png';
// import diceSmall from '../../images/dice_small.png';
// import habaneroSmall from '../../images/habanero_small.png';
// import medalmall from '../../images/medal_small.png';
// import silverSmall from '../../images/silver_small.png';
// import starSmall from '../../images/star_small.png';

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
    shelvesRendered: false
  };

  componentDidMount() {
    if (!this.props.awards.allAwards) {
      // console.log('GET called');
      this.props.getUserAwards();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.awards !== this.props.awards) return true;
    if (this.state.awardMessage !== nextState.awardMessage) return true;

    return false;
  }

  renderShelves = () => {
    const { classes, awards } = this.props;
    const { allAwards } = awards;
    // console.log('AWARDS:', allAwards);

    const awardsPerShelf = 3;
    const shelfArray = [];
    const originalMessage = '. Wall of Flame .';
    let numberOfShelves = 2;

    for (let i = 0; i < numberOfShelves; i++) {
      const awardArray = [];

      if (allAwards) {
        numberOfShelves = Math.ceil(allAwards.length / awardsPerShelf);
        numberOfShelves = numberOfShelves < 2 ? 2 : numberOfShelves;

        for (
          let j = i * awardsPerShelf;
          j < i * awardsPerShelf + awardsPerShelf;
          j++
        ) {
          if (allAwards[j]) {
            const topple = Math.random() < 0.01;
            const fallFloor = Math.random() < 0.005;
            const direction = Math.random() < 0.7 ? '' : '-';
            const pixelsTofall = 50 + 102 * (numberOfShelves - i - 1);
            let distance = null;

            if (allAwards[j]._award.canFall) {
              if (fallFloor) distance = `${pixelsTofall}px`;
              else if (topple) distance = '4px';
            }
            awardArray.push(
              <Avatar
                key={`${i}${j}`}
                style={{
                  transform:
                    allAwards[j]._award.canFall && (fallFloor || topple)
                      ? `rotate(${direction}${
                          allAwards[j]._award.fallAngle
                        }deg)`
                      : '',
                  marginTop: distance ? distance : '',
                  filter:
                    allAwards[j].year !== new Date().getFullYear()
                      ? 'sepia(5%) grayscale(50%)'
                      : ''
                }}
                className={classes.award}
                alt={allAwards[j].title}
                src={allAwards[j]._award.image}
                onClick={() =>
                  this.setState({
                    awardMessage: `${allAwards[j].title} - ${allAwards[j].year}`
                  })
                }
              />
            );
          } else {
            break;
          }
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
    const { awardMessage } = this.state;
    return (
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
    );
  }
}

function mapStateToProps({ resizeScreen, auth, awards }) {
  return {
    resizeScreen,
    auth,
    awards
  };
}

export default connect(
  mapStateToProps,
  actions
)(withStyles(styles)(PererittoAwards));