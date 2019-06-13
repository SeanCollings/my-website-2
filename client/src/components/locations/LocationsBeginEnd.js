import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
// import DropDownIcon from '@material-ui/icons/ArrowDropDownCircleOutlined';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  button: {
    marginLeft: '24px',
    minWidth: '100px'
  },
  text: {
    color: '#dedede',
    marginLeft: '12px'
  }
});

class LocationsBeginEnd extends Component {
  state = { locationsStart: false, onlineUsers: 0 };

  startLocations = () => {
    const onlineUsers = !this.state.locationsStart ? 1 : 0;

    this.setState({
      ...this.state,
      locationsStart: !this.state.locationsStart,
      onlineUsers
    });
  };

  render() {
    const { height, classes } = this.props;
    const { locationsStart, onlineUsers } = this.state;

    return (
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="center"
        style={{ height }}
      >
        <Button
          className={classes.button}
          style={{
            color: 'white',
            // backgroundColor: locationsStart ? '#FF4136' : '#3D9970'
            backgroundColor: 'transparent',
            border: '1px solid white'
          }}
          onClick={() => this.startLocations()}
        >
          {locationsStart ? 'Leave' : 'Start'}
        </Button>
        <Typography className={classes.text}>Online: {onlineUsers}</Typography>
        {/* <DropDownIcon style={{color: 'white'}}/> */}
      </Grid>
    );
  }
}

export default withStyles(styles)(LocationsBeginEnd);
