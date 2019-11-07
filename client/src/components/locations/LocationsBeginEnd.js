import React, { Component } from 'react';
import { connect } from 'react-redux';
import Pusher from 'pusher-js';
import axios from 'axios';
import NoSleep from 'nosleep.js';
import * as locationActions from '../../actions/locationActions';
import { updateHeading } from '../../actions/appActions';

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

const noSleep = new NoSleep();

class LocationsBeginEnd extends Component {
  state = {
    pusher: null,
    random: null,
    blurred: false
  };

  componentDidMount() {
    if (!this.props.locations.pusherCreds) this.props.getPusherCreds();

    window.onblur = () => {
      const { groupId, auth, locations } = this.props;
      // const { blurred } = this.state;

      const username = `${auth.givenName} ${auth.familyName}`;
      console.log('Blurred?', this.state.blurred);
      if (locations.locationsStarted && locations.onlineMembers) {
        // if (!blurred) {
        this.postLocationToMembers(
          groupId,
          locations.random,
          username,
          locations.lastKnownLocation,
          false
        );
        // this.setState({ blurred: true });
        // } else {
        // this.postLocationToMembers(
        //   groupId,
        //   locations.random,
        //   username,
        //   locations.lastKnownLocation,
        //   false
        // );
        // this.setState({ blurred: false });
        // }
      }
    };
  }

  componentWillUnmount() {
    this.props.updateHeading(null);
    this.endConnection(true);
    // this._isMounted = false;
  }

  endConnection = unmountComponent => {
    const { geoId, pusher } = this.props.locations;

    if (pusher) {
      pusher.disconnect();
    }

    if ('geolocation' in navigator) {
      navigator.geolocation.clearWatch(geoId);
      this.props.setPosition(null);
    }
    this.props.totalOnline(0);
    this.props.locationsInitialised(false);
    this.props.onlineMembersLocations(null);
    this.props.locationsStarted(false);

    noSleep.disable();

    if (unmountComponent) this._isMounted = false;
  };

  getLocation = (userId, username, groupId, random) => {
    const { locations } = this.props;

    if ('geolocation' in navigator) {
      const options = {
        enableHighAccuracy: false,
        timeout: 60000,
        maximumAge: 5000
      };

      // In case user stopped and then started but currentPosition unchanged,
      // set position as lastKnownLocation
      if (locations.lastKnownLocation)
        this.props.setPosition(locations.lastKnownLocation);

      const geoId = navigator.geolocation.watchPosition(
        position => {
          // Get updated locations
          const { totalOnline, lastKnownLocation } = this.props.locations;

          // Set decimal place to 4 for 11m accuracy
          // Set decimal place to 5 for 1.11m accuracy
          // Set decimal place to 6 for 0.11m accuracy
          // Set decimal place to 7 for 11mm accuracy
          let currentLocation = {
            lat: parseFloat(position.coords.latitude.toFixed(6)),
            lng: parseFloat(position.coords.longitude.toFixed(6))
          };

          // console.log('Position Watched');

          if (
            !lastKnownLocation ||
            (lastKnownLocation &&
              currentLocation.lat !== lastKnownLocation.lat &&
              currentLocation.lng !== lastKnownLocation.lng)
          ) {
            this.props.setPosition(currentLocation);
            this.props.lastKnownLocation(currentLocation);

            if (totalOnline > 1) {
              this.postLocationToMembers(
                groupId,
                random,
                username,
                currentLocation,
                false
              );
            }
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
  };

  postLocationToMembers = (groupId, userId, username, location, blurred) => {
    axios.post('/api/update_location', {
      groupId,
      userId,
      username,
      location,
      blurred
    });
  };

  toggleLocations = () => {
    const { groupId, auth, locations } = this.props;

    // Pusher goes here
    if (!locations.locationsStarted) {
      // TODO - remove once pusher dev finished
      // Set random id's to test same user on multiple devices
      const random = Math.random();
      console.log('random', random);
      this.setState({ random });

      this.props.setRandomUsername(random);

      const pusher = new Pusher(locations.pusherCreds.pusherKey, {
        authEndpoint: `/api/pusher_auth?random=${random}`,
        cluster: locations.pusherCreds.cluster,
        encrypted: true
      });

      const groupName = `presence-${groupId}`;
      const presenceChannel = pusher.subscribe(groupName);
      this.props.setPusher(pusher);

      presenceChannel.bind('pusher:subscription_succeeded', members => {
        const { random, lastKnownLocation } = this.props.locations;
        this.props.totalOnline(members.count);

        if (members.count > 1 && lastKnownLocation) {
          this.postLocationToMembers(
            groupId,
            random,
            username,
            lastKnownLocation,
            false
          );
        }
      });

      presenceChannel.bind('location-update', body => {
        const { onlineMembers, random } = this.props.locations;
        const { userId, username, location, blurred } = body;

        const membersArray = [];
        const udpatedMember = { userId, username, location, blurred };

        // Prevent current user being added to list of other online users
        if (userId.toString() !== random.toString())
          membersArray.push(udpatedMember);

        if (onlineMembers) {
          onlineMembers.forEach(member => {
            if (
              member.userId !== udpatedMember.userId &&
              member.userId !== random
            ) {
              membersArray.push(member);
            }
          });
        }

        this.props.onlineMembersUpdated(true);
        this.props.onlineMembersLocations(membersArray);
      });

      presenceChannel.bind('pusher:member_removed', member => {
        const { totalOnline, onlineMembers } = this.props.locations;
        const { id, info } = member;

        this.props.totalOnline(totalOnline - 1);
        this.props.memberGoneOffline(info.username);

        if (onlineMembers) {
          let membersArray = [];
          onlineMembers.forEach(member => {
            if (member.userId.toString() !== id) {
              membersArray.push(member);
            }
          });

          if (membersArray.length === 0) membersArray = null;

          this.props.onlineMembersUpdated(true);
          this.props.onlineMembersLocations(membersArray);
        }
      });

      presenceChannel.bind('pusher:member_added', member => {
        const { random, totalOnline, lastKnownLocation } = this.props.locations;

        this.props.totalOnline(totalOnline + 1);
        this.props.newMemberOnline(member.info.username);

        if (lastKnownLocation) {
          this.postLocationToMembers(
            groupId,
            random,
            username,
            lastKnownLocation,
            false
          );
        }
      });

      const username = `${auth.givenName} ${auth.familyName}`;
      this.getLocation(auth._id, username, groupId, random);
      this.props.locationsStarted(true);

      // Prevent screen from turning off when locations started
      // to allow geolocation api to keep getting new locations
      noSleep.enable();
    } else {
      this.endConnection(false);
    }
  };

  render() {
    const { topHeight, classes, locations } = this.props;

    return (
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="center"
        style={{ height: topHeight }}
      >
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
          {locations.locationsStarted ? 'Stop' : 'Start'}
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
  { ...locationActions, updateHeading }
)(withStyles(styles)(LocationsBeginEnd));
