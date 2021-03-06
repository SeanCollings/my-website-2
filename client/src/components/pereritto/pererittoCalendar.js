import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';

import PererittoAttendance from './PererittoAttendance';
import { memoize } from '../components/charts/chartUtils';
import './PererittoCalendar.css';
import DatePicker from '../components/DatePicker';
import {
  Button,
  Grid,
  Typography,
  List,
  ListItem,
  Avatar
} from '@material-ui/core';
import CalendarIcon from '@material-ui/icons/DateRange';

const SELECT_A_DATE = 'Select a date to see who was there...';
const CURRENT_YEAR = new Date().getFullYear();

const memoizedPlayers = memoize(pererittoUsers => {
  return pererittoUsers
    .map((user, i) => {
      const name = user.name;
      const colour = user.colour;
      const id = user._id;
      return { name, colour, id, position: i };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
});

class PererittoCalendar extends Component {
  state = {
    showMoreMonths: false,
    presentPlayers: {},
    showPlayerMessage: true,
    playersClicked: [],
    playersUnclicked: [],
    selectedPlayer: null,
    viewAllAttendance: false
  };

  componentDidUpdate(props, oldState) {
    if (oldState.presentPlayers.players && this.state.presentPlayers.players) {
      const oldPlayers = oldState.presentPlayers.players;
      const newPlayers = this.state.presentPlayers.players;
      if (oldPlayers.length !== newPlayers.length)
        this.setState({
          ...this.state,
          playersClicked: [],
          playersUnclicked: []
        });
    } else if (
      oldState.presentPlayers.players &&
      !this.state.presentPlayers.players
    ) {
      this.setState({
        ...this.state,
        playersClicked: [],
        playersUnclicked: []
      });
    }
  }

  displayPresentPlayers = (playerList, display, selectedPlayer) => {
    if (display) {
      this.setState({
        ...this.state,
        presentPlayers: playerList,
        showPlayerMessage: true,
        selectedPlayer
      });
    } else {
      this.setState({
        ...this.state,
        presentPlayers: {},
        showPlayerMessage: false,
        selectedPlayer: null
      });
    }
  };

  updatePlayersClicked = playerid => {
    const { playersClicked, playersUnclicked } = this.state;
    const newState = [...playersClicked];
    const newStateUnclicked = [...playersUnclicked];

    const index = newState.indexOf(playerid);
    if (index > -1) {
      newState.splice(index, 1);
      newStateUnclicked.push(playerid);
    } else {
      newState.push(playerid);
      const indexUnclicked = newStateUnclicked.indexOf(playerid);

      if (indexUnclicked > -1) newStateUnclicked.splice(indexUnclicked, 1);
    }

    this.setState({
      ...this.state,
      playersClicked: newState,
      playersUnclicked: newStateUnclicked
    });
  };

  getAllPlayers = memoize((pererittoUsers, totalAppearance) => {
    return pererittoUsers.map(user => {
      const name = user.name;
      const colour = user.colour;
      const retired = user.retired;
      const id = user._id;
      const total = totalAppearance[id] ? totalAppearance[id] : 0;

      return { name, colour, retired, id, total };
    });
  });

  getCurrentYearWinners = (winners, selectedYear) =>
    winners.winners
      .filter(winner => winner.year === selectedYear)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

  renderPresentPlayers = () => {
    const { pererittoUsers, winners } = this.props;
    const {
      presentPlayers,
      showPlayerMessage,
      playersClicked,
      playersUnclicked,
      selectedPlayer
    } = this.state;

    if (!showPlayerMessage) return null;
    if (
      !presentPlayers.players ||
      !presentPlayers.selectedDate ||
      presentPlayers.players.length < 1
    )
      return <Typography>{SELECT_A_DATE}</Typography>;

    const totalAppearance = {};
    const selectedYear = new Date(presentPlayers.selectedDate).getFullYear();
    const currentYearWinners = this.getCurrentYearWinners(
      winners,
      selectedYear
    );

    currentYearWinners.forEach(winner => {
      const presentPlayersDate = winner.presentPlayers;

      if (presentPlayersDate) {
        presentPlayersDate.forEach(playerId => {
          if (!totalAppearance[playerId]) {
            totalAppearance[playerId] = 1;
          } else {
            totalAppearance[playerId] += 1;
          }
        });
      }
    });

    const allPlayers = this.getAllPlayers(pererittoUsers, totalAppearance);

    const playersToDisplay = allPlayers.filter(player =>
      presentPlayers.players.includes(player.id)
    );

    return playersToDisplay.map(player => {
      const selected = playersClicked.includes(player.id);
      const unselected = playersUnclicked.includes(player.id);
      const initial = player.name.charAt(0).toUpperCase();
      const isPlayerSelected = selectedPlayer === player.id;

      return (
        <ListItem
          key={player.id}
          style={{
            padding: '2px 0',
            justifyContent: 'center'
          }}
        >
          <Avatar
            className={`${selected ? 'avatar_pop' : ''} ${
              unselected ? 'avatar_reset' : ''
            }`}
            style={{
              backgroundColor: player.colour,
              width: '1.5rem',
              height: '1.5rem',
              border: `1px solid ${isPlayerSelected ? '#909090' : '#AAAAAA'}`,
              margin: '0 8px',
              fontSize: '14px',
              // filter: isPlayerSelected ? '' : 'brightness(0.9)',
              fontWeight: isPlayerSelected ? 500 : 400
            }}
          >
            {initial}
          </Avatar>
          <div style={{ position: 'relative' }}>
            <Button
              onClick={() => this.updatePlayersClicked(player.id)}
              className={`${selected ? 'move_button' : ''} ${
                unselected ? 'button_close' : ''
              }`}
              style={{
                background: player.colour,
                border: `1px solid ${isPlayerSelected ? '#909090' : '#AAAAAA'}`,
                width: '110px',
                color: '#EAEAEA',
                padding: '0px',
                textTransform: 'none',
                fontWeight: isPlayerSelected ? 500 : 100,
                marginRight: '8px',
                height: '1.5rem',
                lineHeight: '1.5',
                zIndex: 1
              }}
            >
              {`${player.name}`}
            </Button>
            <div
              onClick={() => this.updatePlayersClicked(player.id)}
              style={{
                position: 'absolute',
                zIndex: 0,
                top: '2px',
                left: '2px',
                height: '18px',
                width: '100px',
                borderRadius: '4px',
                border: '1px solid #AFAFAF',
                background: '#BDBDBD',
                paddingLeft: '4px',
                color: '#737373',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              {`Total: ${player.total}`}
            </div>
          </div>
          {/* {presentPlayers.toString().replace(/,/g, ', ')} */}
        </ListItem>
      );
    });
  };

  render() {
    const { showMoreMonths, presentPlayers, viewAllAttendance } = this.state;
    const { resizeScreen, winners, pererittoUsers } = this.props;
    const selectedYearsArray = [];

    if (winners && winners.winners) {
      winners.winners.forEach(winner => {
        selectedYearsArray.push(winner);
      });
    }

    return (
      <div style={{ position: 'relative', textAlign: 'center' }}>
        <div style={{ paddingTop: '8px' }} />
        {viewAllAttendance && (
          <PererittoAttendance
            hideAllAttendance={() =>
              this.setState({ viewAllAttendance: false })
            }
            allPlayers={memoizedPlayers(pererittoUsers)}
            mobile={resizeScreen}
            currentYearWinners={this.getCurrentYearWinners(
              winners,
              CURRENT_YEAR
            )}
          />
        )}
        {!viewAllAttendance && (
          <Fragment>
            <Grid
              item
              style={{
                textAlign: 'center',
                margin: 'auto',
                position: 'relative',
                width: '273px',
                marginBottom: '8px'
              }}
            >
              {resizeScreen && (
                <Button
                  style={{
                    color: '#FFC300',
                    border: '1px solid'
                  }}
                  size="small"
                  onClick={() =>
                    this.setState({ showMoreMonths: !showMoreMonths })
                  }
                >
                  {showMoreMonths ? 'View 1 month' : 'View 6 months'}
                </Button>
              )}
              {resizeScreen && (
                <CalendarIcon
                  onClick={() => this.setState({ viewAllAttendance: true })}
                  style={{
                    right: '0px',
                    position: 'absolute',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    padding: '4px',
                    cursor: 'pointer',
                    color: '#64021c',
                    border: '1px solid #64021c66',
                    borderRadius: '4px'
                  }}
                />
              )}
              {!resizeScreen && (
                <Button
                  onClick={() => this.setState({ viewAllAttendance: true })}
                  style={{
                    color: '#FFC300',
                    border: '1px solid'
                  }}
                  size="small"
                >
                  View All Attendance
                </Button>
              )}
            </Grid>
            <DatePicker
              data={selectedYearsArray}
              preventSelection={true}
              showMoreMonths={showMoreMonths}
              showPlayers={true}
              presentPlayerNames={this.displayPresentPlayers}
            />
            <List
              style={{
                margin: '8px auto 24px',
                maxWidth: !presentPlayers.players ? '260px' : '160px',
                padding: !presentPlayers.players ? '0px' : '8px 0 8px',
                background: !presentPlayers.players ? '' : '#DEDEDE',
                borderRadius: '4px'
              }}
            >
              {this.renderPresentPlayers()}
            </List>
          </Fragment>
        )}
      </div>
    );
  }
}

function mapStateToProps({ auth, pererittoUsers, resizeScreen, winners }) {
  return {
    pererittoUsers,
    superUser: auth.superUser,
    resizeScreen,
    winners
  };
}

export default connect(mapStateToProps, actions)(PererittoCalendar);
