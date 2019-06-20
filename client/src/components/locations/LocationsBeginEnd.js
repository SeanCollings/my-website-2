import React, { Component } from 'react';
import { connect } from 'react-redux';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
// import DropDownIcon from '@material-ui/icons/ArrowDropDownCircleOutlined';
import BackIcon from '@material-ui/icons/ArrowBack';

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
  state = { locationsStart: false, onlineUsers: 0, geoId: null };

  componentWillUnmount() {
    if ('geolocation' in navigator) {
      navigator.geolocation.clearWatch(this.state.geoId);
      this.props.setPosition(null);
    }
    this._isMounted = false;
  }

  getLocation = () => {
    if ('geolocation' in navigator) {
      if (!this.state.locationsStart) {
        let geoId = navigator.geolocation.watchPosition(position => {
          let location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          this.props.setPosition(location);
          // this.setState((prevState, props) => {
          // let newState = { ...prevState };
          // newState.center = location;
          // newState.locations[`${prevState.current_user}`] = location;
          // return newState;
          // });
          // axios.post("http://localhost:3128/update-location", {
          //   username: this.state.current_user,
          //   location: location
          // }).then(res => {
          //   if (res.status === 200) {
          //     console.log("new location updated successfully");
          //   }
          // });
        });

        this.setState({ geoId });
      } else {
        navigator.geolocation.clearWatch(this.state.geoId);
        this.props.setPosition(null);
      }
    }
  };

  toggleLocations = () => {
    const {
      otherPlayersLength
      // groupId, auth
    } = this.props;

    // Pusher goes here

    // console.log(otherPlayersLength);
    const onlineUsers = !this.state.locationsStart ? otherPlayersLength + 1 : 0;

    this.setState({
      ...this.state,
      locationsStart: !this.state.locationsStart,
      onlineUsers
    });

    this.getLocation();
  };

  render() {
    const { topHeight, classes } = this.props;
    const { locationsStart, onlineUsers } = this.state;

    return (
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="center"
        style={{ height: topHeight }}
      >
        <BackIcon
          onClick={() => this.props.returnToGroups()}
          style={{ paddingLeft: '24px', color: '#dedede' }}
        />
        <Button
          className={classes.button}
          style={{
            color: 'white',
            // backgroundColor: locationsStart ? '#FF4136' : '#3D9970'
            backgroundColor: 'transparent',
            border: '1px solid white'
          }}
          onClick={() => this.toggleLocations()}
        >
          {locationsStart ? 'Stop' : 'Start'}
        </Button>
        <Typography className={classes.text}>Online: {onlineUsers}</Typography>
        {/* <DropDownIcon style={{color: 'white'}}/> */}
      </Grid>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps)(withStyles(styles)(LocationsBeginEnd));
