import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import { toggleDice } from '../../actions/appActions';
import Dice2 from './Dice2';
import AddPlayerModal from '../modals/AddPlayersModal';
import RulesModal from '../modals/RulesModal';
import ConfirmActionModal from '../modals/ConfirmActionModal';
import ConfirmUndoRollModal from '../modals/ConfirmActionModal';
import { testOutOfBounds } from './diceUtils';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import HelpIcon from '@material-ui/icons/HelpOutline';

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

const clearObjectValues = object => {
  const newObject = { ...object };
  Object.keys(newObject).forEach(key => {
    newObject[key] = null;
  });
  return newObject;
};

const someValuesNull = object =>
  Object.values(object).some(value => value === null);

const getHighestScore = playersScoreMap => {
  let highScore = 0;

  Object.values(playersScoreMap).forEach(value => {
    let realValue = value;
    if (value === 3) realValue = 6;
    if (value === 5) realValue = 10;

    if (realValue > highScore) highScore = realValue;
  });

  if (highScore === 10) return 5;
  else return highScore;
};

const ShowCurrentRoll = playersScoreMap => {
  if (!Object.keys(playersScoreMap).length) return null;

  const color = '#457ba2';
  const nextRollColor = '#a51e1e';
  // const highScoreColor = '#027b17';
  let playerHighlighted = false;
  let highScore = 0;

  const allPlayersRolled = !someValuesNull(playersScoreMap);
  if (allPlayersRolled) highScore = getHighestScore(playersScoreMap);

  return (
    <div
      style={{
        position: 'absolute',
        userSelect: 'none',
        left: 0,
        bottom: 0,
        paddingLeft: '4px'
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(min-content, max-content) 40px',
          gridColumnGap: '8px'
        }}
      >
        {Object.keys(playersScoreMap).map((key, i) => {
          const highlight = !playerHighlighted && !playersScoreMap[key];
          const roll3 = playersScoreMap[key] === 3 ? ' [6]' : '';
          const roll5 = playersScoreMap[key] === 5 ? ' [10]' : '';
          const roll = `${playersScoreMap[key]}${roll3}${roll5}`;

          const isHighScore =
            playersScoreMap[key] === highScore ||
            (playersScoreMap[key] === 3 && highScore === 6);

          const style = {
            color: highlight ? nextRollColor : color,
            fontWeight: isHighScore || highlight ? 'bold' : 'normal'
          };

          const buttonStyle = {
            ...style,
            padding: '0px 0px 0px 4px',
            justifyContent: 'left',
            textTransform: 'capitalize'
          };

          if (!playersScoreMap[key]) playerHighlighted = true;

          return (
            <Fragment key={key}>
              {/* <Typography style={style} onTouchStart={() => console.log(key)}>
                {key}
              </Typography> */}
              <Button
                className="name-highlight"
                style={buttonStyle}
                onTouchStart={() => console.log(key)}
              >
                {key}
              </Button>
              <Button
                style={buttonStyle}
                onTouchStart={() => console.log(key)}
                disableRipple
              >
                {playersScoreMap[key] && allPlayersRolled ? `${roll}` : ``}
              </Button>
              {/* <Typography style={style}>
                {playersScoreMap[key] ? `${roll}` : `-`}
              </Typography> */}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};

/*const ShowTotalScore = (playersScoreMap, totalPlayersScore) => {
  if (!Object.keys(playersScoreMap).length) return null;

  return (
    <div
      style={{
        position: 'absolute',
        padding: '4px',
        userSelect: 'none',
        right: 0,
        bottom: 0,
        marginRight: '4px'
      }}
    >
      <Typography style={{ fontWeight: 'bold' }}>Leader: name</Typography>
    </div>
  );
};*/

class DicePage extends Component {
  state = {
    position: [MAX_TOP, MAX_LEFT],
    oldRandomFace: 0,
    randomFace: randomFace(),
    randomRotate: randomRotate(),
    randomScale: 1,
    randomSpins: 2,
    updateScore: false,
    currentRoundRoll: 0,
    firstRoll: false,
    fadeDice: false,
    newGame: false,
    showRules: false,
    showModal: false,
    showConfirmationModal: false,
    showUndoModal: false,
    playerAdded: false,
    players: [],
    playersScoreMap: {},
    totalPlayersScore: {}
  };

  componentDidMount() {
    const diceBounds = document.getElementById('dice').getBoundingClientRect();
    const position = [this.randomTop(), this.randomLeft()];
    this.setState({ ...this.state, diceBounds, position });

    window.oncontextmenu = () => false;

    const cube = document.querySelector('.cube');
    cube.addEventListener('transitionend', () => {
      const bounds = testOutOfBounds();
      if (Object.values(bounds).some(bound => bound)) {
        this.quickPositionDice(bounds);
      }

      const playersScoreMap = { ...this.state.playersScoreMap };

      if (this.state.playerAdded) {
        playersScoreMap[
          this.state.players[this.state.currentRoundRoll - 1]
        ] = this.state.randomFace;
      }

      this.setState({
        ...this.state,
        updateScore: true,
        playersScoreMap
      });
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

  rollDice = () => {
    const { firstRoll, currentRoundRoll, players, playerAdded } = this.state;
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

    let currentRoll = currentRoundRoll;
    if (playerAdded) {
      if (currentRoll === players.length) currentRoll = 1;
      else currentRoll++;
    }

    this.setState({
      ...this.state,
      position: newPositon,
      oldRandomFace: !firstRoll ? 0 : this.state.randomFace,
      randomFace: randomFace(),
      randomRotate: randomRotate(),
      randomScale: randomScale(),
      randomSpins: randomSpins(),
      updateScore: false,
      firstRoll: true,
      currentRoundRoll: currentRoll
    });
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
    const bounds = testOutOfBounds();
    if (Object.values(bounds).some(bound => bound)) {
      this.quickPositionDice(bounds, position);
    }
  };

  startNewRoundClick = () => {
    const clearedRoundScores = { ...this.state.playersScoreMap };

    this.setState({
      ...this.state,
      currentRoundRoll: 0,
      playersScoreMap: clearObjectValues(clearedRoundScores)
    });
  };

  restartGameClick = () => {
    const { playerAdded } = this.state;

    if (playerAdded) {
      this.setState({ showConfirmationModal: true });
    }
  };

  newGameClicked = () => {
    setTimeout(() => {
      const textField = document.getElementById('add-player');

      if (textField) {
        document.getElementById('add-player').focus();
        document.getElementById('add-player').select();
      }
    }, 0);

    this.setState({ ...this.state, newGame: true, showModal: true });
  };

  addPlayerClicked = playerName => {
    const { players } = this.state;
    const newPlayers = [...players];
    const playersScoreMap = {};

    newPlayers.push(playerName);
    newPlayers.forEach(player => (playersScoreMap[player] = null));

    this.setState({
      ...this.state,
      playerAdded: true,
      players: newPlayers,
      playersScoreMap
    });
  };

  render() {
    const { resizeScreen } = this.props;
    const {
      position,
      oldRandomFace,
      randomFace,
      randomRotate,
      randomSpins,
      updateScore,
      fadeDice,
      newGame,
      playerAdded,
      players,
      playersScoreMap,
      showModal,
      showRules,
      currentRoundRoll,
      showConfirmationModal,
      showUndoModal
    } = this.state;

    const totalHeight = `calc(100vh + (-50px - ${
      resizeScreen ? '56px' : '64px'
    }))`;

    const startNewRound = playerAdded && currentRoundRoll === players.length;

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
              <div
                style={{
                  left: '0',
                  position: 'absolute',
                  marginLeft: '8px'
                }}
              >
                <Grid
                  container
                  direction="row"
                  justify="flex-start"
                  alignItems="center"
                >
                  <Button
                    onClick={() => this.setState({ showRules: true })}
                    style={{
                      color: '#dedede',
                      marginLeft: '-8px'
                    }}
                  >
                    <HelpIcon
                      style={{
                        color: '#dedede',
                        fontSize: 'large',
                        paddingBottom: '2px',
                        marginRight: '4px'
                      }}
                    />
                    Rules
                  </Button>
                </Grid>
              </div>
              <Button
                onClick={
                  playerAdded ? this.restartGameClick : this.newGameClicked
                }
                style={{
                  color: '#dedede',
                  background: '#c70039'
                  // position: 'absolute'
                }}
              >
                {/* {playerAdded ? 'Start' : 'New Game'} */}
                New Game
              </Button>
              <Typography
                style={{
                  right: '0',
                  position: 'absolute',
                  marginRight: '12px',
                  color: '#dedede',
                  fontSize: 'large',
                  display: playerAdded ? 'none' : ''
                }}
              >
                Score: {updateScore ? randomFace : oldRandomFace}
              </Typography>
            </Grid>
          </div>
          <div
            id="dice"
            className="dice"
            onTouchStart={() => newGame && this.setState({ fadeDice: true })}
            onTouchEnd={() => this.setState({ fadeDice: false })}
            style={{
              width: '100%',
              // background: 'red',
              margin: '5px',
              height: `calc(${totalHeight} - (2 * ${BORDER_HEIGHT} + 10px))`,
              border: '1px dotted #baddfd80'
              // opacity: fadeDice ? '0.2' : '1'
            }}
          >
            {playerAdded && ShowCurrentRoll(playersScoreMap)}
            {/* {ShowTotalScore(playersScoreMap, totalPlayersScore)} */}
            <div
              style={{
                position: 'absolute',
                opacity: fadeDice ? '0.2' : '1'
              }}
            >
              <Dice2
                cube={'1'}
                position={position}
                randomFace={randomFace}
                randomRotate={randomRotate}
                diceMounted={this.diceMounted}
                randomSpins={randomSpins}
              />
            </div>
          </div>
          <div
            style={{
              height: BORDER_HEIGHT,
              background: '#c70039',
              width: playerAdded ? 'calc(80% - 8px)' : '100%',
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
                disabled={playerAdded && startNewRound}
                style={{
                  color: '#dedede',
                  width: '100%',
                  opacity: !startNewRound ? '1' : '0.4'
                }}
              >
                Roll
              </Button>
            </Grid>
          </div>
          <div
            style={{
              height: BORDER_HEIGHT,
              background: '#154360',
              width: '20%',
              border: '2px solid aliceblue',
              display: playerAdded ? '' : 'none'
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
                onClick={this.startNewRoundClick}
                disabled={!startNewRound}
                style={{
                  color: '#dedede',
                  width: '100%',
                  opacity: startNewRound ? '1' : '0.4'
                }}
              >
                Clear
              </Button>
            </Grid>
          </div>
        </Grid>
        <AddPlayerModal
          title="Start a New Game?"
          message={`Add players to the board to keep score. Total players: ${players.length}/8`}
          showModal={showModal}
          playerAdded={playerAdded}
          addClick={playerName => this.addPlayerClicked(playerName)}
          cancelClick={() =>
            this.setState({
              showModal: false,
              newGame: playerAdded ? true : false
            })
          }
        />
        <RulesModal
          showModal={showRules}
          doneClick={() => this.setState({ showRules: false })}
        />
        <ConfirmActionModal
          showModal={playerAdded && showConfirmationModal}
          title={'Start a new game'}
          message={`Are you sure you want to abandon the current game and start again?`}
          confirmClick={() =>
            this.setState({
              ...this.state,
              showConfirmationModal: false,
              showModal: true,
              players: [],
              playersScoreMap: {},
              playerAdded: false,
              currentRoundRoll: 0
            })
          }
          cancelClick={() =>
            this.setState({
              ...this.state,
              showConfirmationModal: false
            })
          }
        />
        <ConfirmUndoRollModal
          showModal={showUndoModal}
          title={'Undo Roll'}
          message={`Are you sure you want to undo the current round's rolls up to and including this player?`}
          confirmClick={() =>
            this.setState({
              showUndoModal: false
            })
          }
          cancelClick={() =>
            this.setState({
              ...this.state,
              showUndoModal: false
            })
          }
        />
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
