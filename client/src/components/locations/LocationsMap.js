/* global google */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  Polyline
} from 'react-google-maps';
import { MAP_OPTIONS } from './mapOptions';
import { locationsInitialised } from '../../actions/locationActions';

// import Avatar from '@material-ui/core/Avatar';
// import PlaceIcon from '@material-ui/icons/Place';
// import PersonIcon from '@material-ui/icons/PersonPin';
// import PlaceIcon from '../../images/map/icon-96x96.png';
// import PinIcon from '../../images/icons/pin-icon.png';
// import PlaceIcon2 from '../../images/custom-icon.png';
import MarkerIcon from '../../images/map/custom-icon.png';
import PlayerIcon from '../../images/map/person-yellow-purple.png';
import PersonIcon from '../../images/map/person-off-yellow.png';

class LocationsMap extends Component {
  state = {
    center: { lat: -33.917825, lng: 18.42408 },
    locations: {},
    users_online: [],
    current_user: '',
    zoomLevel: 14,
    directions: null,
    otherPlayerDirections: null,
    showInfoBox: false
  };

  componentDidMount() {
    const { locationPOI } = this.props;

    if (locationPOI) this.setState({ center: locationPOI });
  }

  componentDidUpdate() {
    const { locations } = this.props;

    if (!locations.initialised) {
      const bounds = new window.google.maps.LatLngBounds();
      let markers = 0;
      this.map.props.children.forEach(child => {
        if (child) {
          if (child.type === Marker && child.props.position) {
            bounds.extend(
              new window.google.maps.LatLng(
                child.props.position.lat,
                child.props.position.lng
              )
            );
            markers++;
          }
          if (child.length > 0) {
            child.forEach(c => {
              if (c.type === Marker && c.props.position) {
                bounds.extend(
                  new window.google.maps.LatLng(
                    c.props.position.lat,
                    c.props.position.lng
                  )
                );
                markers++;
              }
            });
          }
        }
      });

      if (markers > 1) {
        this.map.fitBounds(bounds);
        this.props.locationsInitialised(true);
      }
    }

    const destination = this.props.locationPOI;
    const origin = this.props.currentPlayer;

    if (origin && destination) {
      const directionsService = new google.maps.DirectionsService();

      directionsService.route(
        {
          origin: origin,
          destination: destination,
          // travelMode: google.maps.TravelMode.DRIVING
          travelMode: google.maps.TravelMode.WALKING
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            const overViewCoords = result.routes[0].overview_path;
            this.setState({
              directions: overViewCoords
            });
          }
        }
      );

      // directionsDisplay.setMap(map);
      // directionsDisplay.setOptions( { suppressMarkers: true } );
      // const request = {
      //   origin: origin,
      //   destination: destination,
      //   travelMode: google.maps.DirectionsTravelMode.DRIVING
      // };
      // directionsService.route(request, (response, status) => {
      //   if (status === google.maps.DirectionsStatus.OK) {
      //     directionsDisplay.setDirections(response);
      //   }
      // });
    }

    if (locations.onlineMembers) {
      const directionsArr = [];
      locations.onlineMembers.forEach(player => {
        const directionsService = new google.maps.DirectionsService();

        directionsService.route(
          {
            origin: player.location,
            destination: destination,
            travelMode: google.maps.TravelMode.WALKING
          },
          (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
              const overViewCoords = result.routes[0].overview_path;
              directionsArr.push(overViewCoords);
              this.setState({ otherPlayerDirections: directionsArr });
            }
          }
        );
      });
    } else if (!locations.onlineMembers && locations.initialised) {
      // All members have left the group
      if (this.state.otherPlayerDirections)
        this.setState({ otherPlayerDirections: null });
    }
  }

  componentWillUnmount() {
    this.props.locationsInitialised(false);
    this._isMounted = false;
  }

  handleZoomChanged = () => {
    // const zoomLevel = this.map.getZoom();
    // console.log('ZOOM:', zoomLevel);
  };

  markerClicked = marker => {
    console.log('Username:', marker.username);

    this.setState({ showInfoBox: true });
  };

  render() {
    const { locationPOI, currentPlayer, locations } = this.props;
    const { zoomLevel, directions, otherPlayerDirections } = this.state;

    const iconCurrentPlayer = {
      url: PlayerIcon,
      scaledSize: { width: 24, height: 24 }
    };
    const iconOtherMembers = {
      url: PersonIcon,
      scaledSize: { width: 26, height: 26 }
    };
    const iconPOI = {
      url: MarkerIcon,
      scaledSize: { width: 42, height: 42 }
    };

    return (
      <GoogleMap
        id="map"
        ref={ref => {
          this.map = ref;
        }}
        zoom={zoomLevel}
        // zoom={15}
        // defaultCenter={{ lat: -33.917825, lng: 18.42408 }}
        center={this.state.center}
        // center={this.props.position}
        defaultOptions={{ disableAutoPan: true }}
        options={MAP_OPTIONS}
        onZoomChanged={() => this.handleZoomChanged()}
        onClick={() => this.setState({ showInfoBox: false })}
      >
        <Marker position={locationPOI} options={{ icon: iconPOI }} />
        {/* {currentPlayer && (<Marker
          // position={this.state.center}
          position={currentPlayer}
          options={{
            icon
          }}
        />)} */}
        {currentPlayer && (
          <Marker
            position={currentPlayer}
            options={{
              icon: iconCurrentPlayer
            }}
          />
        )}
        {locations.onlineMembers
          ? locations.onlineMembers.map(marker => {
              return (
                <Marker
                  key={`${marker.location.lat}${marker.location.lng}`}
                  position={marker.location}
                  options={{
                    icon: iconOtherMembers
                  }}
                  style={{
                    transform: 'translate(-50%, -100%)'
                  }}
                  onClick={() => this.markerClicked(marker)}
                />
              );
            })
          : null}
        {currentPlayer && directions && (
          <Polyline
            path={directions}
            geodesic={false}
            options={{
              // strokeColor: '#ff2e2b',
              strokeColor: '#FFC300',
              strokeOpacity: 0.8,
              strokeWeight: 4
            }}
          />
        )}
        {currentPlayer &&
          otherPlayerDirections &&
          otherPlayerDirections.length > 0 &&
          otherPlayerDirections.map((player, index) => {
            return (
              <Polyline
                key={index}
                path={player}
                geodesic={false}
                options={{
                  strokeColor: '#fce392',
                  strokeOpacity: 0.8,
                  strokeWeight: 4
                }}
              />
            );
          })}
      </GoogleMap>
    );
  }
}

function mapStateToProps({ locations }) {
  return { locations };
}

export default connect(
  mapStateToProps,
  { locationsInitialised }
)(withScriptjs(withGoogleMap(LocationsMap)));
