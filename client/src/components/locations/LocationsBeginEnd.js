import React, { Component } from 'react';
import { connect } from 'react-redux';
import Pusher from 'pusher-js';
import axios from 'axios';
import {
  getPusherCreds,
  setPusher,
  setGeoId,
  onlineMembersLocations,
  totalOnline,
  setRandomUserName,
  locationsInitialised,
  lastKnownLocation
} from '../../actions/locationActions';

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
    pusher: null,
    presenceChannel: null,
    random: null
  };

  componentDidMount() {
    if (!this.props.locations.pusherCreds) this.props.getPusherCreds();
  }

  componentWillUnmount() {
    this.endConnection();
    this._isMounted = false;
  }

  endConnection = () => {
    const { geoId, pusher } = this.props.locations;

    if (pusher) {
      const groupName = `presence-${this.props.groupId}`;
      pusher.unsubscribe(groupName);
    }

    if ('geolocation' in navigator) {
      navigator.geolocation.clearWatch(geoId);
      this.props.setPosition(null);
    }

    this.props.totalOnline(0);
    this.props.locationsInitialised(false);
    this.props.onlineMembersLocations(null);
  };

  getLocation = (userId, username, groupId, random) => {
    if ('geolocation' in navigator) {
      if (!this.state.locationsStart) {
        const options = {
          enableHighAccuracy: false,
          timeout: 60000,
          maximumAge: 10000
        };

        // console.log('Trying to get watchPosition');
        const geoId = navigator.geolocation.watchPosition(
          position => {
            let location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            const { currentPlayer } = this.props;
            // console.log('watchPosition', location);
            if (
              !currentPlayer ||
              (currentPlayer &&
                location.lat !== currentPlayer.lat &&
                location.lng !== currentPlayer.lng)
            ) {
              this.props.setPosition(location);
              this.props.lastKnownLocation(location);
              axios.post('/api/update_location', {
                groupId,
                userId: random,
                username,
                location
              });
            }
          },
          error => {
            console.log(error);
          },
          options
        );

        this.props.setGeoId(geoId);
      } else {
        navigator.geolocation.clearWatch(this.props.locations.geoId);
        this.props.setPosition(null);
      }
    }
  };

  toggleLocations = () => {
    const { groupId, auth, locations } = this.props;
    const { locationsStart } = this.state;

    // Pusher goes here
    if (!locationsStart) {
      this.setState({ onlineUsers: 1 });

      const random = Math.random();
      console.log('random', random);
      this.setState({ random });

      this.props.setRandomUserName(random);

      const pusher = new Pusher(locations.pusherCreds.pusherKey, {
        authEndpoint: `/api/pusher_auth?random=${random}`,
        cluster: locations.pusherCreds.cluster,
        encrypted: true
      });

      const groupName = `presence-${groupId}`;
      const presenceChannel = pusher.subscribe(groupName);
      this.props.setPusher(pusher);

      presenceChannel.bind('pusher:subscription_succeeded', members => {
        this.props.totalOnline(members.count);
        // console.log('members', members);
      });

      presenceChannel.bind('location-update', body => {
        const { onlineMembers, random } = this.props.locations;
        const { userId, location } = body;

        const membersArray = [];
        const newMember = { userId, location };

        // Prevent current user being added to list of other online users
        if (userId.toString() !== random.toString())
          membersArray.push(newMember);
        // Update online users list
        if (onlineMembers) {
          onlineMembers.forEach(member => {
            if (
              member.userId !== newMember.userId &&
              member.userId !== random
            ) {
              membersArray.push(member);
            }
          });
        }

        console.log('Updated membersArray:', membersArray);
        this.props.onlineMembersLocations(membersArray);
      });

      presenceChannel.bind('pusher:member_removed', member => {
        const { totalOnline, onlineMembers } = this.props.locations;
        const { id } = member;

        this.props.totalOnline(totalOnline - 1);
        console.log('Member left:', member);
        if (onlineMembers) {
          let membersArray = [];
          onlineMembers.forEach(member => {
            if (member.userId.toString() !== id) {
              membersArray.push(member);
            }
          });

          if (membersArray.length === 0) membersArray = null;

          this.props.onlineMembersLocations(membersArray);
        }
      });

      presenceChannel.bind('pusher:member_added', member => {
        const { totalOnline, lastKnownLocation } = this.props.locations;

        this.props.totalOnline(totalOnline + 1);

        if (lastKnownLocation) {
          axios.post('/api/update_location', {
            groupId,
            userId: this.props.locations.random,
            username,
            location: lastKnownLocation
          });
        }

        console.log('New member joined:', member);
      });

      const username = `${auth.givenName} ${auth.familyName}`;
      this.getLocation(auth._id, username, groupId, random);
    } else {
      this.endConnection();
    }

    this.setState({
      ...this.state,
      locationsStart: !locationsStart
    });

    this.props.locationStarted(true);
  };

  render() {
    const { topHeight, classes, locations } = this.props;
    const { locationsStart } = this.state;

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
            backgroundColor: 'transparent',
            border: '1px solid white',
            opacity: locations.pusherCreds ? '1' : '0.5'
          }}
          onClick={() => this.toggleLocations()}
          disabled={locations.pusherCreds ? false : true}
        >
          {locationsStart ? 'Stop' : 'Start'}
        </Button>
        <Typography className={classes.text}>
          Online: {locations.totalOnline}
        </Typography>
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
  {
    getPusherCreds,
    setPusher,
    setGeoId,
    onlineMembersLocations,
    totalOnline,
    setRandomUserName,
    locationsInitialised,
    lastKnownLocation
  }
)(withStyles(styles)(LocationsBeginEnd));
