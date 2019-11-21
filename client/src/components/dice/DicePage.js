import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

import { toggleDice } from '../../actions/appActions';
// import Dice from './Dice';
import Dice2 from './Dice2';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {}
});

const MAX_LEFT = '12px';
const MAX_TOP = '14px';
const MAX_RIGHT = '84px';
const MAX_BOTTOM = '88px';
const MIN_PERCENT_TOP = 20;
const MIN_PERCENT_LEFT = 23;
const BORDER_HEIGHT = '40px';

const randomFace = () => Math.floor(Math.random() * (6 - 1 + 1)) + 1;
const randomRotate = () => Math.floor(Math.random() * 360);
const randomScale = () => Math.floor(Math.random() * 3);
const randomSpins = () => Math.floor(Math.random() * (2 - 1 + 1)) + 1;
const getNumFromPixel = pixels => Number(pixels.split('px')[0]);

class DicePage extends Component {
  state = {
    position: [MAX_TOP, MAX_LEFT],
    oldRandomFace: 0,
    randomFace: randomFace(),
    randomRotate: randomRotate(),
    randomScale: 1,
    animate: false,
    randomSpins: 2,
    updateScore: false,
    firstRoll: false
  };

  componentDidMount() {
    const diceBounds = document.getElementById('dice').getBoundingClientRect();
    const position = [this.randomTop(), this.randomLeft()];
    this.setState({ ...this.state, diceBounds, position });

    const dice = document.querySelector('.cube');
    dice.addEventListener('transitionend', () => {
      const bounds = this.testOutOfBounds();
      if (Object.values(bounds).some(bound => bound)) {
        this.quickPositionDice(bounds);
      }

      this.setState({ updateScore: true });
    });
  }

  randomTop = () => {
    const height = document.getElementById('dice').clientHeight;
    const percentTop = Math.floor(
      Math.random() * (99 - MIN_PERCENT_TOP + 1) + MIN_PERCENT_TOP
    );
    const newPosition =
      getNumFromPixel(MAX_TOP) +
      (Math.floor((percentTop / 100) * height) - getNumFromPixel(MAX_BOTTOM));

    return `${newPosition}px`;
  };
  randomLeft = () => {
    const width = document.getElementById('dice').clientWidth;
    const percentLeft = Math.floor(
      Math.random() * (99 - MIN_PERCENT_LEFT + 1) + MIN_PERCENT_LEFT
    );
    const newPosition =
      getNumFromPixel(MAX_LEFT) +
      (Math.floor((percentLeft / 100) * width) - getNumFromPixel(MAX_RIGHT));

    return `${newPosition}px`;
  };

  evenRoll = () => {};
  oddRoll = () => {};

  animateDie = () => {
    // const evenRoll = this.evenRoll();
    // const oddRoll = this.oddRoll();
    return null;
  };

  rollDice = () => {
    const { firstRoll } = this.state;
    const newPositon = [this.randomTop(), this.randomLeft()];

    const dice = document.querySelector('.cube');
    dice.classList.remove('shimmy-1');
    dice.classList.remove('shimmy-2');
    if (!dice.classList.contains('odd-roll')) {
      dice.classList.add('odd-roll');
      dice.classList.remove('even-roll');
    } else {
      dice.classList.add('even-roll');
      dice.classList.remove('odd-roll');
    }

    // dice.dataset.roll = `show-${randomFace()}`;
    // console.log(dice.classList);
    // const animate = this.animateDie();
    // console.log('animate', animate);
    // this.setState({ ...this.state });
    this.setState({
      ...this.state,
      position: newPositon,
      oldRandomFace: !firstRoll ? 0 : this.state.randomFace,
      randomFace: randomFace(),
      randomRotate: randomRotate(),
      randomScale: randomScale(),
      randomSpins: randomSpins(),
      updateScore: false,
      firstRoll: true
    });
  };

  testOutOfBounds = () => {
    const outOfBounds = { left: null, top: null, right: null, bottom: null };
    const dice = document.getElementById('dice');
    const cube1 = document.getElementById('cube-1');

    if (!dice || !cube1) return null;

    const front = document.getElementById('front');
    const back = document.getElementById('back');
    const right = document.getElementById('right');
    const left = document.getElementById('left');
    const top = document.getElementById('top');
    const bottom = document.getElementById('bottom');

    const diceBounds = dice.getBoundingClientRect();
    const frontBounds = front.getBoundingClientRect();
    const backBounds = back.getBoundingClientRect();
    const rightBounds = right.getBoundingClientRect();
    const leftBounds = left.getBoundingClientRect();
    const topBounds = top.getBoundingClientRect();
    const bottomBounds = bottom.getBoundingClientRect();

    outOfBounds.left = this.testLessThanBounds(
      diceBounds.left,
      frontBounds.left,
      backBounds.left,
      rightBounds.left,
      leftBounds.left,
      topBounds.left,
      bottomBounds.left
    );
    outOfBounds.top = this.testLessThanBounds(
      diceBounds.top,
      frontBounds.top,
      backBounds.top,
      rightBounds.top,
      leftBounds.top,
      topBounds.top,
      bottomBounds.top
    );
    outOfBounds.right = this.testMoreThanBounds(
      diceBounds.right,
      frontBounds.right,
      backBounds.right,
      rightBounds.right,
      leftBounds.right,
      topBounds.right,
      bottomBounds.right
    );
    outOfBounds.bottom = this.testMoreThanBounds(
      diceBounds.bottom,
      frontBounds.bottom,
      backBounds.bottom,
      rightBounds.bottom,
      leftBounds.bottom,
      topBounds.bottom,
      bottomBounds.bottom
    );

    return outOfBounds;
  };

  testLessThanBounds = (dice, front, back, right, left, top, bottom) => {
    return (
      front <= dice ||
      back <= dice ||
      right <= dice ||
      left <= dice ||
      top <= dice ||
      bottom <= dice
    );
  };

  testMoreThanBounds = (dice, front, back, right, left, top, bottom) => {
    return (
      front >= dice ||
      back >= dice ||
      right >= dice ||
      left >= dice ||
      top >= dice ||
      bottom >= dice
    );
  };

  quickPositionDice = (bounds, firstMount) => {
    const position = firstMount ? firstMount : this.state.position;
    let newPositon = [...position];

    if (bounds.left) newPositon[1] = `${getNumFromPixel(position[1]) + 2}px`;
    if (bounds.top) newPositon[0] = `${getNumFromPixel(position[0]) + 2}px`;
    if (bounds.right) newPositon[1] = `${getNumFromPixel(position[1]) - 2}px`;
    if (bounds.bottom) newPositon[0] = `${getNumFromPixel(position[0]) - 2}px`;

    console.log('newPositon', newPositon);

    if (!firstMount) {
      const dice = document.querySelector('.cube');
      if (!dice.classList.contains('shimmy-1')) {
        dice.classList.add('shimmy-1');
        dice.classList.remove('shimmy-2');
      } else {
        dice.classList.add('shimmy-2');
        dice.classList.remove('shimmy-1');
      }
    }
    this.setState({ position: newPositon });
  };

  diceMounted = () => {
    const position = [this.randomTop(), this.randomLeft()];
    console.log('position', position);
    // this.setState({ ...this.state, position });
    const bounds = this.testOutOfBounds();
    if (Object.values(bounds).some(bound => bound)) {
      this.quickPositionDice(bounds, position);
    }
  };

  render() {
    const { resizeScreen } = this.props;
    const {
      position,
      oldRandomFace,
      randomFace,
      randomRotate,
      animate,
      randomSpins,
      updateScore
    } = this.state;

    const totalHeight = `calc(100vh + (-50px - ${
      resizeScreen ? '56px' : '64px'
    }))`;

    return (
      <div
        style={{
          background: 'aliceblue',
          maxHeight: '100vh',
          height: totalHeight,
          maxWidth: '1400px',
          margin: 'auto'
        }}
      >
        <Grid container justify="center" alignItems="center">
          <div
            style={{
              height: BORDER_HEIGHT,
              background: '#761141',
              width: '100%',
              border: '2px solid aliceblue'
            }}
          >
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
              style={{ height: '100%' }}
            >
              <NavLink
                to="/pereritto"
                style={{
                  textDecoration: 'none',
                  left: '0',
                  position: 'absolute'
                }}
              >
                <Button
                  onClick={this.props.toggleDice}
                  style={{ color: '#dedede', width: '100%' }}
                >
                  Return
                </Button>
              </NavLink>
              <Typography
                style={{
                  right: '0',
                  position: 'absolute',
                  marginRight: '12px',
                  color: '#dedede'
                }}
              >
                Score: {updateScore ? randomFace : oldRandomFace}
              </Typography>
            </Grid>
          </div>
          <div
            id="dice"
            className="dice"
            style={{
              width: '100%',
              // background: 'red',
              margin: '5px',
              height: `calc(${totalHeight} - (2 * ${BORDER_HEIGHT} + 10px))`,
              border: '1px dotted #baddfd80'
            }}
          >
            <Dice2
              cube={'1'}
              position={position}
              randomFace={randomFace}
              randomRotate={randomRotate}
              diceMounted={this.diceMounted}
              animate={animate}
              randomSpins={randomSpins}
            />
          </div>
          <div
            style={{
              height: BORDER_HEIGHT,
              background: '#c70039',
              width: '100%',
              border: '2px solid aliceblue'
            }}
          >
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
              style={{ height: '100%' }}
            >
              <Button
                onClick={this.rollDice}
                style={{ color: '#dedede', width: '100%' }}
              >
                Roll
              </Button>
            </Grid>
          </div>
        </Grid>
      </div>
    );
  }
}

const maptStateToProps = ({ resizeScreen }) => {
  return { resizeScreen };
};

export default connect(maptStateToProps, { toggleDice })(
  withStyles(styles)(DicePage)
);
