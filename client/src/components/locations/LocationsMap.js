/* global google */
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  Polyline,
  InfoWindow
} from 'react-google-maps';
import { MAP_OPTIONS } from './mapOptions';
import {
  locationsInitialised,
  onlineMembersUpdated
} from '../../actions/locationActions';
import { locationsEqual } from '../../utils/utility';

import MarkerIcon from '../../images/map/custom-icon.png';
import PlayerIcon from '../../images/map/person-yellow-purple.png';
import PersonIcon from '../../images/map/person-off-yellow.png';
import BlurredIcon from '../../images/map/person-blurred.png';

class LocationsMap extends Component {
  state = {
    center: { lat: -33.917825, lng: 18.42408 },
    zoomLevel: 14,
    directions: null,
    otherPlayerDirections: null,
    showInfoBox: null,
    onlineMembers: null,
    initialised: false,
    distance: null,
    duration: null
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
      if (
        !locationsEqual(origin, locations.lastKnownLocation) ||
        !this.state.initialised
      ) {
        const directionsService = new google.maps.DirectionsService();

        directionsService.route(
          {
            origin: origin,
            destination: destination,
            travelMode: google.maps.TravelMode.DRIVING
            // travelMode: google.maps.TravelMode.WALKING
          },
          (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
              // console.log('Distance:', result.routes[0].legs[0].distance.text);
              // console.log('Duration:', result.routes[0].legs[0].duration.text);
              const overViewCoords = result.routes[0].overview_path;
              const distance = result.routes[0].legs[0].distance.text;
              const duration = result.routes[0].legs[0].duration.text;
              this.setState({
                ...this.state,
                directions: overViewCoords,
                duration,
                distance
              });
            } else if (
              status === google.maps.DirectionsStatus.OVER_QUERY_LIMIT
            ) {
              console.log('MY STATUS', status);
            }
          }
        );
        if (!this.state.initialised) this.setState({ initialised: true });
      }
    }

    if (locations.onlineMembers) {
      const directionsArr = [];
      locations.onlineMembers.forEach(player => {
        if (locations.onlineMembersUpdated) {
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
                this.props.onlineMembersUpdated(false);
                this.setState({ otherPlayerDirections: directionsArr });
              } else if (
                status === google.maps.DirectionsStatus.OVER_QUERY_LIMIT
              ) {
                console.log('Query Limit Reached:', status);
              }
            }
          );
        }
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

  render() {
    const { locationPOI, currentPlayer, locations } = this.props;
    const {
      zoomLevel,
      directions,
      otherPlayerDirections,
      center,
      distance,
      duration
    } = this.state;

    const iconCurrentPlayer = {
      url: PlayerIcon,
      scaledSize: { width: 24, height: 24 }
    };
    const iconOtherMembers = {
      url: PersonIcon,
      scaledSize: { width: 25, height: 25 }
    };
    const iconBlurred = {
      url: BlurredIcon,
      scaledSize: { width: 25, height: 25 }
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
        center={center}
        defaultOptions={{ disableAutoPan: true }}
        options={MAP_OPTIONS}
        onZoomChanged={() => this.handleZoomChanged()}
        onClick={() => this.setState({ showInfoBox: null })}
      >
        <Marker position={locationPOI} options={{ icon: iconPOI }} />
        {currentPlayer && (
          <Marker
            position={currentPlayer}
            options={{
              icon: iconCurrentPlayer
            }}
            onClick={() => this.setState({ showInfoBox: 'player' })}
          >
            {this.state.showInfoBox === 'player' && (
              <InfoWindow
                onCloseClick={() => this.setState({ showInfoBox: null })}
              >
                <Fragment>
                  <div style={{ textAlign: 'center' }}>You</div>
                  <div style={{ display: distance && duration ? '' : 'none' }}>
                    {distance} / {duration}
                  </div>
                </Fragment>
              </InfoWindow>
            )}
          </Marker>
        )}
        {locations.onlineMembers
          ? locations.onlineMembers.map((marker, index) => {
              return (
                <Marker
                  key={index}
                  position={marker.location}
                  options={{
                    icon: marker.blurred ? iconBlurred : iconOtherMembers
                  }}
                  style={{
                    transform: 'translate(-50%, -100%)'
                  }}
                  onClick={() => this.setState({ showInfoBox: index })}
                >
                  {this.state.showInfoBox === index && (
                    <InfoWindow
                      onCloseClick={() => this.setState({ showInfoBox: null })}
                    >
                      <div>{marker.username}</div>
                    </InfoWindow>
                  )}
                </Marker>
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
  { locationsInitialised, onlineMembersUpdated }
)(withScriptjs(withGoogleMap(LocationsMap)));
