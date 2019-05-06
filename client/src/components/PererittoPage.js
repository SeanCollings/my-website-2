import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import FolderIcon from '@material-ui/icons/Folder';

import Paper from './components/paper';

const styles = theme => ({
  pageFill: {
    paddingBottom: '2.5rem'
    // backgroundColor: '#FF4136'
  },
  buttonColour: {
    backgroundColor: '#FF4136',
    color: 'white',
    marginLeft: '10px',
    marginRight: '10px'
  },
  superUser: {
    backgroundColor: '#2ECC40',
    marginLeft: '10px',
    marginRight: '10px'
  }
});

const players = { Trevor: 10, Jarrod: 8, Matt: 6, Vaughn: 2, Sean: 1 };

class ProjectsPage extends Component {
  renderPlayers(player) {
    return (
      <ListItem key={player}>
        <ListItemAvatar>
          <Avatar>
            <FolderIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={player} />
      </ListItem>
    );
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.pageFill}>
        <Paper title="Pereritto Winners" content="Habanero Roulette" />
        <Button className={classes.buttonColour}>Players</Button>
        <Button className={classes.buttonColour}>Calendar</Button>
        <Button
          className={classes.superUser}
          style={
            this.props !== null
              ? this.props.superUser
                ? {}
                : { display: 'none' }
              : { display: 'none' }
          }
        >
          Edit
        </Button>
        <List>
          {Object.keys(players).map((player, index) =>
            this.renderPlayers(player)
          )}
        </List>
      </div>
    );
  }
}

export default withStyles(styles)(ProjectsPage);
