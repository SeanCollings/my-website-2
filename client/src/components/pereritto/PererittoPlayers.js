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
            backgroundColor: player.lastWinner ? 'rgb(210, 105, 3, 0.5)' : '',
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
          <ListItemSecondaryAction>
            <ListItemText primary={player.count} />
          </ListItemSecondaryAction>
        </ListItem>
      );
    });
  }

  render() {
    const { classes, resizeScreen } = this.props;

    return (
      <div style={{ paddingTop: '24px', width: resizeScreen ? '' : '600px' }}>
        <List className={classes.root}>{this.renderPlayers()} </List>
      </div>
    );
  }
}

function mapStateToProps({ auth, pererittoUsers, resizeScreen }) {
  return {
    pererittoUsers,
    superUser: auth.superUser,
    resizeScreen
  };
}

export default connect(
  mapStateToProps,
  actions
)(withStyles(styles)(PererittoPlayers));
