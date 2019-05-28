import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import Slider from 'react-slick';
import MiniLoader from 'react-loader-spinner';

// import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
// import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Typography } from '@material-ui/core';

// import Paper from './components/paper';
import TabContainer from './components/tabContainer';
import PererittoPlayers from './pereritto/PererittoPlayers';
import UpdatePererittoPlayer from './pereritto/UpdatePererittoPlayer';
import PererittoCalendar from './pereritto/pererittoCalendar';
import PererittoAwards from './pereritto/PererittoAwards';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

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
    backgroundColor: '#ffa07a'
  }
});

class ProjectsPage extends Component {
  state = {
    value: 0
    // valueTab: 0
  };

  componentDidMount() {
    const { pererittoUsers, winners } = this.props;

    if (!pererittoUsers) this.props.getPererittoUsers();
    if (!winners.winners) this.props.getWinners(new Date().getFullYear());
    if (!winners.winnerYears) this.props.getWinnerYears();
  }

  componentWillUnmount() {
    // this.props.clearWinners();
  }

  handleChange = (event, value) => {
    this.slider.slickGoTo(value);
    this.setState({ value });
  };

  render() {
    const { classes, superUser, resizeScreen } = this.props;
    const { value } = this.state;

    if (!this.props.pererittoUsers) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            textAlign: 'center',
            minHeight: '80vh'
          }}
        >
          <MiniLoader
            type="Ball-Triangle"
            color="#FFC300"
            height={30}
            width={30}
          />
          <Typography
            style={{
              color: '#FFC300'
            }}
          >
            Loading players...
          </Typography>
        </div>
      );
    }

    const settings = {
      dots: false,
      arrows: false,
      infinite: false,
      speed: 100
    };

    return (
      <div className={classes.pageFill}>
        {/* <Paper title="Pereritto Winners" content="Habanero Roulette" /> */}
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
            <Tab label="Awards" />
            <Tab
              label="Update"
              style={{ display: superUser ? '' : 'none' }}
              disabled={!superUser}
            />
          </Tabs>
          <div
            className={classes.centered}
            style={{ display: resizeScreen ? 'none' : '' }}
          >
            {value === 0 && <PererittoPlayers />}
            {value === 1 && <TabContainer children={<PererittoCalendar />} />}
            {value === 2 && <PererittoAwards />}
            {value === 3 && (
              <TabContainer children={<UpdatePererittoPlayer />} />
            )}
          </div>
          <div
            style={{
              textAlign: '-webkit-center',
              display: resizeScreen ? '' : 'none'
            }}
          >
            <Slider
              ref={c => (this.slider = c)}
              {...settings}
              // beforeChange={(current, next) => this.setState({ value: next })}
              afterChange={current => this.setState({ value: current })}
            >
              <PererittoPlayers />
              <TabContainer children={<PererittoCalendar />} />
              <PererittoAwards />
              {superUser && (
                <TabContainer children={<UpdatePererittoPlayer />} />
              )}
            </Slider>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ auth, pererittoUsers, resizeScreen, winners }) {
  return {
    pererittoUsers,
    superUser: auth ? auth.superUser : false,
    resizeScreen,
    winners
  };
}

export default connect(
  mapStateToProps,
  actions
)(withStyles(styles)(ProjectsPage));
