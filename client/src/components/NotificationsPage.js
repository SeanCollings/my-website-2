import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import Slider from 'react-slick';

import Notifications from './notifications/Notifications';
import NotificationAdmin from './notifications/NotificationAdmin';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  pageFill: {
    paddingBottom: '2.5rem',
    maxWidth: '100%'
    // backgroundColor: '#FF4136'
  },
  tabBar: {
    flexGrow: 1
  },
  indicator: {
    backgroundColor: 'bisque'
  },
  enableNotifications: {
    marginTop: '12px',
    maxWidth: '600px',
    padding: '24px',
    marginLeft: '10px',
    marginRight: '10px',
    borderRadius: '5px',
    backgroundColor: 'white'
  },
  centered: {
    textAlign: '-webkit-center'
  }
});

class NotificationsPage extends Component {
  state = { value: 0, allGroups: null };

  componentDidMount() {
    const { notifications, app } = this.props;

    if (app.notificationState === 'granted' && !notifications.groups) {
      this.props.getNotificationGroups();
    }
  }

  handleChange = (event, value) => {
    this.slider.slickGoTo(value);
    this.setState({ value });
  };

  render() {
    const { classes, resizeScreen, auth, app } = this.props;
    const { value } = this.state;

    const settings = {
      dots: false,
      arrows: false,
      infinite: false,
      speed: 100
    };

    if (
      app.notificationState !== 'granted' ||
      (auth && auth.allowNotifications && !auth.allowNotifications)
    )
      return (
        <Grid item className={classes.enableNotifications}>
          <Typography paragraph>Whoopsie Doodle...</Typography>
          <Typography paragraph>
            Please <b>Enable Notifications</b> under settings in order to access
            this page.
          </Typography>
          <Typography paragraph>
            Enabling notifications will allow you to communicate with other
            members of this app either individually, or via group messaging.
          </Typography>
        </Grid>
      );

    return (
      <div className={classes.pageFill}>
        <div className={classes.tabBar}>
          <Tabs
            value={value}
            onChange={this.handleChange}
            centered
            style={{ backgroundColor: '', color: 'bisque' }}
            classes={{ indicator: classes.indicator }}
          >
            <Tab label="Notifications" />
            <Tab label="Admin" />
          </Tabs>
          {!resizeScreen ? (
            <div
              className={classes.centered}
              style={{ display: resizeScreen ? 'none' : '' }}
            >
              {value === 0 && <Notifications />}
              {value === 1 && <NotificationAdmin />}
            </div>
          ) : null}
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
              <Notifications />
              <NotificationAdmin />
            </Slider>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ resizeScreen, auth, app, notifications }) {
  return { auth, resizeScreen, app, notifications };
}

export default connect(
  mapStateToProps,
  actions
)(withStyles(styles)(NotificationsPage));
