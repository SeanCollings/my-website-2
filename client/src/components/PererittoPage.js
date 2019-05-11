import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';

// import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
// import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Paper from './components/paper';
import TabContainer from './components/tabContainer';
import PererittoPlayers from './pereritto/PererittoPlayers';
import UpdatePererittoPlayer from './pereritto/UpdatePererittoPlayer';

const styles = theme => ({
  pageFill: {
    paddingBottom: '2.5rem',
    maxWidth: '100%'
    // backgroundColor: '#FF4136'
  },
  buttonColour: {
    backgroundColor: '#FF4136',
    color: 'white',
    width: '25%',
    marginLeft: '10px'
  },
  // root: {
  //   width: '100%',
  //   maxWidth: 360
  // },
  tabBar: {
    flexGrow: 1
  },
  centered: {
    display: 'flex',
    justifyContent: 'center'
  },
  indicator: {
    backgroundColor: '#C70039'
  }
});

class ProjectsPage extends Component {
  state = {
    value: 0
  };

  componentDidMount() {
    this.props.getPererittoUsers();
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
            classes={{ indicator: classes.indicator }}
          >
            <Tab label="Players" />
            <Tab label="Calendar" />
            <Tab label="Update" disabled={!this.props.superUser} />
          </Tabs>
          <div className={classes.centered}>
            {value === 0 && (
              <TabContainer>
                <PererittoPlayers />
              </TabContainer>
            )}
            {value === 1 && (
              <TabContainer>[Pretend this is a calendar]</TabContainer>
            )}
            {value === 2 && (
              <TabContainer children={<UpdatePererittoPlayer />} />
            )}
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
