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

const styles = theme => ({
  root: {
    minWidth: '100%',
    maxWidth: '600px',
    backgroundImage: 'linear-gradient(#FFA07A, #FFDAB9 60%)',
    borderRadius: '35px'
  }
});

class PererittoPlayers extends Component {
  componentDidMount() {
    this.props.getPererittoUsers();
    this.props.getWinners();
  }

  renderPlayers = (playerTally, lastWinDate) => {
    console.log('FINALLLLLLL');
    return Object.keys(playerTally).map((key, index) => {
      const firstLetter = key.charAt(0).toUpperCase();

      return (
        <ListItem
          key={key}
          style={{
            backgroundColor:
              playerTally[key].lastWinDate === lastWinDate
                ? 'rgb(210, 105, 3, 0.5)'
                : '',
            borderRadius: '50px'
          }}
        >
          <ListItemAvatar>
            <Avatar
              style={{
                backgroundColor: playerTally[key].colour
              }}
            >
              {firstLetter}
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={key} style={{ paddingRight: '120px' }} />
          <ListItemSecondaryAction>
            <ListItemText primary={playerTally[key].count} />
          </ListItemSecondaryAction>
        </ListItem>
      );
    });
  };

  renderPlayerList = (playerTally, lastWinDate) => {
    const { classes } = this.props;

    console.log('playerTally UNORDERED', playerTally);
    let orderedTally = {};

    console.log('orderedTally NICE!!!!!', orderedTally);

    return (
      <List className={classes.root}>
        {this.renderPlayers(playerTally, lastWinDate)}
      </List>
    );
  };

  buildPlayerTally = () => {
    const { pererittoUsers, winners } = this.props;
    const playerTally = [];
    let OverallWinDate = new Date(0);

    if (pererittoUsers === null || winners === null) {
      return null;
    }

    pererittoUsers.map(user => {
      return (playerTally[user.name] = {
        name: user.name,
        count: 0,
        colour: user.colour,
        lastWinDate: OverallWinDate
      });
    });

    if (winners !== null) {
      winners.map(winner => {
        let playerWinDate = new Date(winner.date);
        if (playerWinDate > OverallWinDate) OverallWinDate = playerWinDate;

        if (playerTally[winner._winner.name].lastWinDate < playerWinDate) {
          playerTally[winner._winner.name].lastWinDate = playerWinDate;
        }

        return (playerTally[winner._winner.name].count += 1);
      });
    }

    return this.renderPlayerList(playerTally, OverallWinDate);
  };

  render() {
    const { resizeScreen } = this.props;

    return (
      <div style={{ paddingTop: '24px', width: resizeScreen ? '' : '600px' }}>
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
