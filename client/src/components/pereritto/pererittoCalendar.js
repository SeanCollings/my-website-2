import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';

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

const SELECT_A_DATE = 'Select a date to see who was there...';

class PererittoCalendar extends Component {
  state = {
    showMoreMonths: false,
    presentPlayers: {},
    showPlayerMessage: true,
    playersClicked: [],
    playersUnclicked: [],
    selectedPlayer: null
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
    const currentYearWinners = winners.winners.filter(
      winner => winner.year === selectedYear
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

    const allPlayers = pererittoUsers.map(user => {
      const name = user.name;
      const colour = user.colour;
      const retired = user.retired;
      const id = user._id;
      const total = totalAppearance[id] ? totalAppearance[id] : 0;

      return { name, colour, retired, id, total };
    });

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
            className={`${selected ? 'avatar_pop' : ''}`}
            style={{
              backgroundColor: player.colour,
              width: '24px',
              height: '24px',
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
                height: '22px',
                lineHeight: '22px',
                zIndex: 1
                // filter: isPlayerSelected ? '' : 'brightness(0.9)'
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
    const { showMoreMonths, presentPlayers } = this.state;
    const { resizeScreen, winners } = this.props;
    const selectedYearsArray = [];

    if (winners && winners.winners) {
      winners.winners.forEach(winner => {
        selectedYearsArray.push(winner);
      });
    }

    return (
      <div style={{ position: 'relative' }}>
        <div style={{ paddingTop: resizeScreen ? '8px' : '24px' }} />
        <Grid item style={{ textAlign: 'center' }}>
          <Button
            style={{
              display: resizeScreen ? '' : 'none',
              color: '#FFC300',
              marginBottom: '8px',
              border: '1px solid'
            }}
            size="small"
            onClick={() => this.setState({ showMoreMonths: !showMoreMonths })}
          >
            {showMoreMonths ? 'View 1 month' : 'View 6 months'}
          </Button>
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
            margin: '8px auto',
            maxWidth: !presentPlayers.players ? '260px' : '160px',
            padding: !presentPlayers.players ? '0px' : '8px 0 8px',
            background: !presentPlayers.players ? '' : '#DEDEDE',
            borderRadius: '4px',
            filter: !presentPlayers.players
              ? ''
              : 'drop-shadow(1px 1px 2px #444444)'
          }}
        >
          {this.renderPresentPlayers()}
        </List>
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
