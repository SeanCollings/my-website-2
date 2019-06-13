import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  enableNotifications: {
    marginTop: '12px',
    maxWidth: '600px',
    padding: '24px',
    marginLeft: '10px',
    marginRight: '10px',
    borderRadius: '5px',
    backgroundColor: 'white'
  }
});

class WhoopsieDoodle extends Component {
  render() {
    const { classes, toEnable } = this.props;

    return (
      <Grid item className={classes.enableNotifications}>
        <Typography paragraph>Whoopsie Doodle...</Typography>
        <Typography paragraph>
          Please{' '}
          <span
            onClick={() => this.props.history.push('/settings')}
            style={{ color: '#0074D9' }}
          >
            <b>Enable {toEnable}</b>
          </span>{' '}
          under settings in order to access this page.
        </Typography>
        <Typography paragraph>
          Enabling notifications or your location will allow you to communicate
          further with other members of this app either individually or through
          groups.
        </Typography>
      </Grid>
    );
  }
}

export default withRouter(withStyles(styles)(WhoopsieDoodle));
