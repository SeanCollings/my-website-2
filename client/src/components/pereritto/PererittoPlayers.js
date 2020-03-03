import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';

import { memoize } from '../components/charts/chartUtils';
import PieChart from '../components/charts/PieChart';
import RadialChart from '../components/charts/RadialChart';
import StackedBarChart from '../components/charts/StackedBarChart';

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
import Typography from '@material-ui/core/Typography';
import FloristIcon from '@material-ui/icons/LocalFloristRounded';
import RightIcon from '@material-ui/icons/ArrowForward';
import LeftIcon from '@material-ui/icons/ArrowBack';
// import RefreshIcon from '@material-ui/icons/RefreshRounded';

import trophy from '../../images/trophy.png';

const styles = theme => ({
  root: {
    minWidth: '100%',
    backgroundImage: 'linear-gradient(#FFA07A, #FFDAB9 60%)',
    borderRadius: '35px'
  },
  retired: {
    marginTop: '20px',
    minWidth: '100%',
    backgroundImage: 'linear-gradient(#bdbdbd, #dedede 60%)',
    borderRadius: '35px 20px'
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
  },
  leftButton: {
    position: 'absolute',
    left: '0',
    color: '#EAEAEA',
    cursor: 'pointer'
    // top: '50%',
    // transform: 'translateY(-50%)',
  },
  rightButton: {
    position: 'absolute',
    right: '0',
    color: '#EAEAEA',
    cursor: 'pointer'
    // top: '50%',
    // transform: 'translateY(-50%)',
  }
});
const YEAR_2020 = 2020;
const SCOVILLE_SCALE = 'The Scoville Scale';
const DAUNTLESS_DISTRIBUTION = 'The Dauntless Distribution';
const WIN_VS_ATTENDANCE = 'The Win vs Atten Dance';

const CHART_SELECTIONS = [
  SCOVILLE_SCALE,
  DAUNTLESS_DISTRIBUTION,
  WIN_VS_ATTENDANCE
];

class PererittoPlayers extends Component {
  state = {
    playedYears: null,
    selectedYear: null,
    loadedYears: [],
    retiredPlayers: [],
    selectedChartIndex: 0,
    selectedChart: CHART_SELECTIONS[0]
  };

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
      let retiredPlayer = false;
      if (player.retired) {
        retiredPlayer =
          new Date(player.retiredDate).getFullYear() ===
          this.state.selectedYear;
      }

      if (retiredPlayer && player.count === 0) return null;

      if (this.state.selectedYear && player.count === 0) {
        if (player.createdYear > this.state.selectedYear) {
          return null;
        }
      }
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
                backgroundColor: player.colour,
                opacity: retiredPlayer ? '0.7' : '1'
              }}
            >
              {firstLetter}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={`${player.name}`}
            style={{
              paddingRight: '120px',
              opacity: retiredPlayer ? '0.7' : '1',
              whiteSpace: 'nowrap',
              overflow: 'hidden'
            }}
          />
          <ListItemAvatar style={{ display: player.winner ? '' : 'none' }}>
            <Avatar className={classes.trophy} alt="winner" src={trophy} />
          </ListItemAvatar>
          <ListItemSecondaryAction>
            <ListItemText
              primary={player.count}
              style={{ opacity: retiredPlayer ? '0.7' : '1' }}
            />
          </ListItemSecondaryAction>
        </ListItem>
      );
    });
  };

  renderPlayerList = (playerTally, lastWinDate) => {
    const { classes } = this.props;

    if (playerTally && playerTally.length > 0) {
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

  mapPlayerTally = users => {
    const playerTally = {};

    users.forEach(user => {
      const createdYear = new Date(
        parseInt(user._id.substring(0, 8), 16) * 1000
      ).getFullYear();

      return (playerTally[user._id] = {
        _id: user._id,
        name: user.name,
        count: 0,
        colour: user.colour,
        lastWinDate: new Date(0),
        retired: user.retired,
        retiredDates: user.retiredDates,
        returnedDates: user.returnedDates,
        createdYear
      });
    });

    return playerTally;
  };

  countWinners = (winners, players) => {
    const { selectedYear } = this.state;
    let overallWinDate = new Date(0);

    if (winners.winners) {
      winners.winners.map(winner => {
        if (winner.year === selectedYear) {
          let playerWinDate = new Date(winner.date);
          if (playerWinDate > overallWinDate) overallWinDate = playerWinDate;

          if (players[winner._winner._id]) {
            if (players[winner._winner._id].lastWinDate < playerWinDate) {
              players[winner._winner._id].lastWinDate = playerWinDate;
            }

            players[winner._winner._id].count += 1;
          }
        }
        return null;
      });
      return overallWinDate;
    }
  };

  getMaxDatefromArray = arr => {
    if (arr.length === 1) return arr[0];
    return arr.reduce((a, b) => (a > b ? a : b));
  };

  getRetiredPlayers = player => {
    const { selectedYear } = this.state;
    const currentYear = new Date().getFullYear().toString();
    const retiredDates = player.retiredDates;
    const returnedDates = player.returnedDates;
    const retiredYears = [];
    const returnedYears = [];
    const allRetiredDates = {};
    const allReturnedDates = {};

    if (selectedYear === currentYear && player.retired) {
      return true;
    }

    if (retiredDates.length > 0) {
      for (let i = 0; i < retiredDates.length; i++) {
        retiredYears.push(retiredDates[i].year);
        allRetiredDates[retiredDates[i].year] = [...retiredDates[i].dates];
      }
    }
    if (returnedDates.length > 0) {
      for (let i = 0; i < returnedDates.length; i++) {
        returnedYears.push(returnedDates[i].year);
        allReturnedDates[returnedDates[i].year] = [...returnedDates[i].dates];
      }
    }

    if (selectedYear && retiredYears.includes(selectedYear.toString())) {
      if (returnedYears.includes(selectedYear.toString())) {
        const maxRetiredDate = this.getMaxDatefromArray(
          allRetiredDates[selectedYear]
        );
        const maxReturnedDate = this.getMaxDatefromArray(
          allReturnedDates[selectedYear]
        );

        if (maxReturnedDate > maxRetiredDate) return false;
      }
      return true;
    }

    return false;
  };

  playerRetiredInNewYear = player => {
    const { retiredDates, returnedDates } = player;

    if (!player.count > 0 && retiredDates && retiredDates.length > 0) {
      if (!returnedDates || returnedDates.length === 0) return true;

      const allRetiredDates = [];
      const allReturnedDates = [];
      retiredDates.forEach(date => {
        if (date.dates.length) {
          allRetiredDates.push(...[...date.dates]);
        }
      });
      returnedDates.forEach(date => {
        if (date.dates.length) {
          allReturnedDates.push(...[...date.dates]);
        }
      });

      const maxRetiredDate = allRetiredDates.reduce((a, b) => (a > b ? a : b));
      const maxReturnedDate = allReturnedDates.reduce((a, b) =>
        a > b ? a : b
      );

      return maxRetiredDate > maxReturnedDate;
    }
    return false;
  };

  buildPlayerTally = () => {
    const { pererittoUsers, winners } = this.props;

    if (pererittoUsers === null) return null;

    const playerTally = this.mapPlayerTally(pererittoUsers);
    const overallWinDate = this.countWinners(winners, playerTally);
    const activePlayers = Object.values(playerTally).filter(player => {
      return (
        !this.getRetiredPlayers(player) && !this.playerRetiredInNewYear(player)
      );
    });

    let concatPlayerList = [];
    Object.keys(activePlayers).forEach(key => {
      concatPlayerList = concatPlayerList
        .concat(activePlayers[key])
        .sort((a, b) => a.name.localeCompare(b.name));
    });

    return this.renderPlayerList(concatPlayerList, overallWinDate);
  };

  renderRetiredPlayers = () => {
    const { classes, pererittoUsers, winners } = this.props;
    const { selectedYear } = this.state;

    let overallWinDate = new Date(0);

    if (pererittoUsers === null) return null;

    const players = this.mapPlayerTally(pererittoUsers, overallWinDate);
    this.countWinners(winners, players, overallWinDate);

    const retiredPlayers = Object.values(players).filter(player => {
      return (
        this.getRetiredPlayers(player) &&
        Number(player.createdYear) <= Number(selectedYear) &&
        player.count > 0
      );
    });

    if (!retiredPlayers.length) return null;

    retiredPlayers.sort(function(a, b) {
      return b.count - a.count;
    });

    return (
      <List
        className={classes.retired}
        style={{
          maxWidth: this.props.resizeScreen ? '280px' : '600px'
        }}
      >
        <Grid container direction="row" justify="center" alignItems="center">
          <FloristIcon
            style={{ opacity: '0.2', transform: 'rotate(-12deg)' }}
          />
          <ListItemText
            disableTypography
            primary={
              <Typography style={{ color: '#5a5a5a' }}>
                Retired - Hurt
              </Typography>
            }
            style={{ borderBottom: '1px solid #bfbfbf', maxWidth: '85px' }}
          />
          <FloristIcon style={{ opacity: '0.2', transform: 'rotate(12deg)' }} />
        </Grid>
        {this.renderPlayers(retiredPlayers)}
      </List>
    );
  };

  handleChange = event => {
    const year = event.target.value;

    if (!this.state.loadedYears.includes(year)) {
      // this.props.getWinners(year);
      this.setState({ loadedYears: [...this.state.loadedYears, year] });
    }

    if (year < YEAR_2020) {
      this.setState({
        ...this.state,
        selectedYear: year,
        selectedChartIndex: 0,
        selectedChart: CHART_SELECTIONS[0]
      });
    } else {
      this.setState({ selectedYear: year });
    }
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

  toggleChart = toggleRight => {
    const { selectedChartIndex } = this.state;
    let newIndex = selectedChartIndex;

    if (toggleRight) {
      if (selectedChartIndex !== CHART_SELECTIONS.length - 1) newIndex++;
      else newIndex = 0;
    } else {
      if (selectedChartIndex !== 0) newIndex--;
      else newIndex = CHART_SELECTIONS.length - 1;
    }

    this.setState({
      ...this.state,
      selectedChartIndex: newIndex,
      selectedChart: CHART_SELECTIONS[newIndex]
    });
  };

  getCurrentYearWinners = memoize((winners, selectedYear) => {
    const currentYearWinners = winners.winners.filter(
      winner => winner.year === selectedYear
    );

    return currentYearWinners;
  });

  render() {
    const { resizeScreen, classes, winners, pererittoUsers } = this.props;
    const { selectedYear, selectedChart } = this.state;

    return (
      <div
        style={{
          width: resizeScreen ? '' : '600px',
          display: 'table',
          margin: 'auto'
        }}
      >
        <Grid
          item
          style={{
            textAlign: 'center',
            paddingBottom: '8px',
            marginTop: '8px'
          }}
        >
          <Select
            className={classes.cssUnderline}
            value={selectedYear ? selectedYear : ''}
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
                  maxHeight: '200px',
                  overflow: 'auto'
                }
              }
            }}
            SelectDisplayProps={{ style: { borderBottom: 'red' } }}
          >
            {this.renderDates()}
          </Select>
        </Grid>
        {this.buildPlayerTally()}
        {this.renderRetiredPlayers()}
        <div
          style={{
            margin: '18px auto 24px',
            position: 'relative',
            width: '260px'
          }}
        >
          {selectedYear >= YEAR_2020 && (
            <LeftIcon
              className={classes.leftButton}
              onClick={() => this.toggleChart(false)}
            />
          )}
          {selectedYear >= YEAR_2020 && (
            <RightIcon
              className={classes.rightButton}
              onClick={() => this.toggleChart(true)}
            />
          )}
          {selectedChart === SCOVILLE_SCALE && (
            <PieChart winners={winners} selectedYear={selectedYear} />
          )}
          {selectedChart === DAUNTLESS_DISTRIBUTION && (
            <RadialChart
              winners={winners}
              selectedYear={selectedYear}
              pererittoUsers={pererittoUsers}
            />
          )}
          {selectedChart === WIN_VS_ATTENDANCE && (
            <StackedBarChart
              winners={winners}
              selectedYear={selectedYear}
              pererittoUsers={pererittoUsers}
            />
          )}
          <Typography
            style={{
              marginTop: '12px',
              fontWeight: '100',
              color: '#EAEAEA',
              textAlign: 'center'
            }}
          >
            {selectedChart}
          </Typography>
        </div>
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
