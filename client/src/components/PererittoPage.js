import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';

// import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Avatar from '@material-ui/core/Avatar';
// import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Paper from './components/paper';
import TabContainer from './components/tabContainer';

const styles = theme => ({
  pageFill: {
    paddingBottom: '2.5rem'
    // backgroundColor: '#FF4136'
  },
  buttonColour: {
    backgroundColor: '#FF4136',
    color: 'white',
    width: '25%',
    marginLeft: '10px'
  },
  superUser: {
    backgroundColor: '#2ECC40',
    width: '25%',
    marginLeft: '10px'
  },
  root: {
    width: '100%',
    maxWidth: 360
  },
  tabBar: {
    flexGrow: 1
  },
  centered: {
    display: 'flex',
    justifyContent: 'center'
  }
});

// const players = { Trevor: 10, Jarrod: 8, Matt: 6, Vaughn: 2, Sean: 1 };

class ProjectsPage extends Component {
  state = {
    value: 0
  };

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
      const backgroundColour = Math.floor(Math.random() * 16777215).toString(
        16
      );

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
                backgroundColor:
                  player.colour !== '' ? player.colour : `#${backgroundColour}`
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

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <div className={classes.pageFill}>
        <Paper title="Pereritto Winners" content="Habanero Roulette" />
        <div className={classes.tabBar}>
          <Tabs
            value={value}
            onChange={this.handleChange}
            centered
            style={{ backgroundColor: '' }}
          >
            <Tab label="Players" />
            <Tab label="Calendar" />
            <Tab label="Update" disabled={!this.props.superUser} />
          </Tabs>
          <div className={classes.centered}>
            {value === 0 && (
              <TabContainer>
                <List className={classes.root}>{this.renderPlayers()} </List>
              </TabContainer>
            )}
            {value === 1 && <TabContainer>Calendar</TabContainer>}
            {value === 2 && <TabContainer>Update the list</TabContainer>}
          </div>
        </div>
      </div>
    );
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
)(withStyles(styles)(ProjectsPage));
