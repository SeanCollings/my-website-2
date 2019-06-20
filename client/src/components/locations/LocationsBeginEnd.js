import React, { Component } from 'react';
import { connect } from 'react-redux';
// import Pusher from 'pusher-js';
// import axios from 'axios';
import { getPusherCreds } from '../../actions/locationActions';

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
  state = {
    locationsStart: false,
    onlineUsers: 0,
    geoId: null,
    pusher: null,
    presenceChannel: null,
    random: null
  };

  componentDidMount() {
    if (!this.props.locations.pusherCreds) this.props.getPusherCreds();
  }

  componentWillUnmount() {
    // if ('geolocation' in navigator) {
    //   navigator.geolocation.clearWatch(this.state.geoId);
    //   this.props.setPosition(null);
    // }
    this.endConnection();
    this._isMounted = false;
  }

  endConnection = () => {
    // const { geoId } = this.state;
    // console.log('Are we ending?', geoId);
    // console.log('pusher', this.state.pusher);
    // if (this.state.pusher) {
    //   const groupName = `presence-${this.props.groupId}`;
    //   this.state.pusher.unsubscribe(groupName);
    // }

    if ('geolocation' in navigator) {
      // console.log('Clear this geoId:', geoId);
      navigator.geolocation.clearWatch(1);
      this.props.setPosition(null);
    }
  };

  getLocation = (userId, username, groupId) => {
    if ('geolocation' in navigator) {
      const random = Math.random();
      console.log('random', random);
      this.setState({ random });

      let geoId;
      if (!this.state.locationsStart) {
        const options = {
          enableHighAccuracy: false,
          timeout: 60000,
          maximumAge: 5000
        };

        geoId = navigator.geolocation.watchPosition(
          position => {
            let location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

            console.log('New location:', location);
            this.props.setPosition(location);
            // axios.post('/api/update_location', {
            //   groupId,
            //   userId: random,
            //   username,
            //   location
            // });
          },
          error => {
            console.log(error);
          },
          options
        );

        this.setState({ geoId });
      } else {
        navigator.geolocation.clearWatch(this.state.geoId);
        this.props.setPosition(null);
      }
    }
  };

  toggleLocations = () => {
    const {
      otherPlayersLength,
      groupId,
      auth
      // , locations
    } = this.props;
    const { locationsStart } = this.state;

    // Pusher goes here
    // if (!locationsStart) {
    //   const pusher = new Pusher(locations.pusherCreds.pusherKey, {
    //     authEndpoint: '/api/pusher_auth',
    //     cluster: locations.pusherCreds.cluster,
    //     encrypted: true
    //   });

    //   const groupName = `presence-${groupId}`;
    //   const presenceChannel = pusher.subscribe(groupName);
    //   this.setState({ ...this.state, pusher, presenceChannel });

    //   presenceChannel.bind('pusher:subscription_succeeded', members => {
    //     // this.setState({
    //     //   users_online: members.members,
    //     //   current_user: members.myID
    //     // });
    //     console.log('members', members);
    //   });

    //   presenceChannel.bind('location-update', body => {
    //     // this.setState((prevState, props) => {
    //     //   const newState = { ...prevState }
    //     //   newState.locations[`${body.username}`] = body.location;
    //     //   return newState;
    //     // });
    //     console.log('body', body);
    //   });

    //   presenceChannel.bind('pusher:member_removed', member => {
    //     // this.setState((prevState, props) => {
    //     //   const newState = { ...prevState };
    //     //   // remove member location once they go offline
    //     //   delete newState.locations[`${member.id}`];
    //     //   // delete member from the list of online users
    //     //   delete newState.users_online[`${member.id}`];
    //     //   return newState;
    //     // })
    //     console.log('Member left:', member);
    //   });

    //   presenceChannel.bind('pusher:member_added', member => {
    //     console.log('New member joined:', member);
    //   });

    const username = `${auth.givenName} ${auth.familyName}`;
    this.getLocation(auth._id, username, groupId);
    // } else {
    //   this.endConnection();
    // }

    // console.log(otherPlayersLength);
    const onlineUsers = !this.state.locationsStart ? otherPlayersLength + 1 : 0;

    this.setState({
      ...this.state,
      locationsStart: !locationsStart,
      onlineUsers
    });

    this.props.locationStarted(true);
  };

  render() {
    const { topHeight, classes, locations } = this.props;
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
            border: '1px solid white',
            opacity: locations.pusherCreds ? '1' : '0.5'
          }}
          onClick={() => this.toggleLocations()}
          disabled={locations.pusherCreds ? false : true}
        >
          {locationsStart ? 'Stop' : 'Start'}
        </Button>
        <Typography className={classes.text}>Online: {onlineUsers}</Typography>
        {/* <DropDownIcon style={{color: 'white'}}/> */}
      </Grid>
    );
  }
}

function mapStateToProps({ auth, locations }) {
  return { auth, locations };
}

export default connect(
  mapStateToProps,
  { getPusherCreds }
)(withStyles(styles)(LocationsBeginEnd));
