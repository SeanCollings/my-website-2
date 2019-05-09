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
    width: '100%',
    maxWidth: 360
  }
});

class PererittoPlayers extends Component {
  componentDidMount() {
    this.props.getPererittoUsers();
  }

  renderPlayers() {
    const { pererittoUsers } = this.props;

    if (pererittoUsers === null) {
      return null;
    }

    return pererittoUsers.map(player => {
      const firstLetter = player.name.charAt(0).toUpperCase();

      return (
        <ListItem
          key={player.name}
          style={{
            backgroundColor: player.lastWinner ? 'rgb(255, 170, 0, 0.2)' : ''
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
          <ListItemSecondaryAction>
            <ListItemText primary={player.count} />
          </ListItemSecondaryAction>
        </ListItem>
      );
    });
  }

  render() {
    const { classes } = this.props;

    return <List className={classes.root}>{this.renderPlayers()} </List>;
  }
}

function mapStateToProps({ auth, pererittoUsers }) {
  return {
    pererittoUsers,
    superUser: auth.superUser
  };
}

export default connect(
  mapStateToProps,
  actions
)(withStyles(styles)(PererittoPlayers));
