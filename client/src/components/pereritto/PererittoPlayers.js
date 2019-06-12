import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';

import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Avatar from '@material-ui/core/Avatar';
import { Grid } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
// import RefreshIcon from '@material-ui/icons/RefreshRounded';

import trophy from '../../images/trophy.png';

const styles = theme => ({
  root: {
    minWidth: '100%',
    backgroundImage: 'linear-gradient(#FFA07A, #FFDAB9 60%)',
    borderRadius: '35px'
  },
  trophy: {
    height: 'auto',
    width: '35px',
    borderRadius: 0,
    marginRight: '5px',
    marginLeft: '-40px',
    filter:
      'brightness(42%) sepia(90%) hue-rotate(330deg) saturate(670%) contrast(0.8)'
  },
  cssUnderline: {
    borderBottomColor: '#DEDEDE',
    '&:before': {
      borderColor: ''
    },
    '&:after': {
      borderBottomColor: '#ffa07a'
    }
  }
});

class PererittoPlayers extends Component {
  state = { playedYears: null, selectedYear: null, loadedYears: [] };

  componentDidMount() {
    const { winners } = this.props;
    if (winners.winnerYears) {
      this.setupWinnerYears(winners.winnerYears, true);
    }
  }

  componentDidUpdate() {
    const { winners } = this.props;
    const { playedYears } = this.state;

    if (winners && winners.winnerYears && playedYears === null) {
      this.setupWinnerYears(winners.winnerYears, false);
    }
  }

  setupWinnerYears = (winnerYears, multipleYears) => {
    const arr = [];
    Object.keys(winnerYears).map(key => {
      return arr.push(winnerYears[key]);
    });

    const sortedYears = arr.sort((a, b) => {
      return b - a;
    });

    this.setState({ playedYears: sortedYears });
    this.setState({ selectedYear: sortedYears[0] });

    if (multipleYears)
      this.setState({ loadedYears: this.props.winners.selectedYears });
    else this.setState({ loadedYears: [sortedYears[0]] });
  };

  renderPlayers = (playerTally, lastWinDate) => {
    const { classes } = this.props;

    return playerTally.map(player => {
      const firstLetter = player.name.charAt(0).toUpperCase();

      return (
        <ListItem
          key={player._id}
          style={{
            backgroundColor:
              player.lastWinDate === lastWinDate &&
              player.lastWinDate.toString() !== new Date(0).toString()
                ? 'rgb(210, 105, 3, 0.5)'
                : '',
            borderRadius: '50px'
          }}
        >
          <ListItemAvatar>
            <Avatar
              style={{
                backgroundColor: player.colour
              }}
            >
              {firstLetter}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={player.name}
            style={{ paddingRight: '120px' }}
          />
          <ListItemAvatar style={{ display: player.winner ? '' : 'none' }}>
            <Avatar className={classes.trophy} alt="winner" src={trophy} />
          </ListItemAvatar>
          <ListItemSecondaryAction>
            <ListItemText primary={player.count} />
          </ListItemSecondaryAction>
        </ListItem>
      );
    });
  };

  renderPlayerList = (playerTally, lastWinDate) => {
    const { classes } = this.props;

    if (playerTally) {
      playerTally.sort(function(a, b) {
        return b.count - a.count;
      });

      const maxCount = playerTally[0].count;

      playerTally = playerTally.map(player => {
        return {
          ...player,
          winner: player.count > 0 && player.count === maxCount
        };
      });

      return (
        <List
          className={classes.root}
          style={{ maxWidth: this.props.resizeScreen ? '280px' : '600px' }}
        >
          {this.renderPlayers(playerTally, lastWinDate)}
        </List>
      );
    }

    return null;
  };

  buildPlayerTally = () => {
    const { pererittoUsers, winners } = this.props;
    const { selectedYear } = this.state;
    const playerTally = {};
    let OverallWinDate = new Date(0);

    if (pererittoUsers === null) {
      return null;
    }

    pererittoUsers.map(user => {
      return (playerTally[user._id] = {
        _id: user._id,
        name: user.name,
        count: 0,
        colour: user.colour,
        lastWinDate: OverallWinDate
      });
    });

    if (winners.winners) {
      winners.winners.map(winner => {
        if (winner.year === selectedYear) {
          let playerWinDate = new Date(winner.date);
          if (playerWinDate > OverallWinDate) OverallWinDate = playerWinDate;

          if (playerTally[winner._winner._id]) {
            if (playerTally[winner._winner._id].lastWinDate < playerWinDate) {
              playerTally[winner._winner._id].lastWinDate = playerWinDate;
            }

            playerTally[winner._winner._id].count += 1;
          }
        }

        return null;
      });
    }

    let concatPlayerList = [];
    Object.keys(playerTally).forEach(key => {
      concatPlayerList = concatPlayerList.concat(playerTally[key]);
    });

    return this.renderPlayerList(concatPlayerList, OverallWinDate);
  };

  handleChange = event => {
    const year = event.target.value;

    if (!this.state.loadedYears.includes(year)) {
      // this.props.getWinners(year);
      this.setState({ loadedYears: [...this.state.loadedYears, year] });
    }

    this.setState({ selectedYear: year });
  };

  renderDates() {
    const { playedYears } = this.state;

    if (playedYears !== null) {
      return playedYears.map(year => {
        return (
          <MenuItem key={year} value={year}>
            {year}
          </MenuItem>
        );
      });
    }

    return null;
  }

  render() {
    const { resizeScreen, classes } = this.props;
    const { selectedYear } = this.state;

    return (
      <div
        style={{
          width: resizeScreen ? '' : '600px',
          display: 'table'
        }}
      >
        <Grid item style={{ textAlign: 'center', paddingBottom: '10px' }}>
          <Select
            className={classes.cssUnderline}
            value={selectedYear ? this.state.selectedYear : ''}
            onChange={this.handleChange}
            MenuProps={{
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'left'
              },
              transformOrigin: {
                vertical: 'top',
                horizontal: 'left'
              },
              getContentAnchorEl: null,
              PaperProps: {
                style: {
                  backgroundColor: '#DEDEDE',
                  maxHeight: 300
                }
              }
            }}
            SelectDisplayProps={{ style: { borderBottom: 'red' } }}
          >
            {this.renderDates()}
          </Select>
          {/* <RefreshIcon /> */}
        </Grid>
        {this.buildPlayerTally()}
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

export default connect(
  mapStateToProps,
  actions
)(withStyles(styles)(PererittoPlayers));
