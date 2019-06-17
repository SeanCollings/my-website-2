/* global google */
import React, { Component } from 'react';

import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  // DirectionsRenderer,
  Polyline
} from 'react-google-maps';
import { MAP_OPTIONS } from './mapOptions';

// import Avatar from '@material-ui/core/Avatar';
// import PlaceIcon from '@material-ui/icons/Place';
// import PersonIcon from '@material-ui/icons/PersonPin';
import PlaceIcon from '../../images/icons/icon-96x96.png';
// import PinIcon from '../../images/icons/pin-icon.png';
// import PlaceIcon2 from '../../images/custom-icon.png';

class LocationsMap extends Component {
  state = {
    center: { lat: -33.917825, lng: 18.42408 },
    locations: {},
    users_online: [],
    current_user: '',
    zoomLevel: 15,
    directions: null,
    otherPlayerDirections: null
  };

  componentDidMount() {}

  componentDidUpdate() {
    const { otherPlayers } = this.props;
    // console.log('MAP:', this.map);
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

    if (markers > 1) this.map.fitBounds(bounds);

    const destination = this.props.locationPOI;
    const origin = this.props.currentPlayer;

    if (origin && destination) {
      const directionsService = new google.maps.DirectionsService();
      // const directionsDisplay = new google.maps.DirectionsRenderer();

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
            // this.setState({
            //   directions: result
            // });
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

    if (otherPlayers) {
      const directionsArr = [];
      otherPlayers.forEach(player => {
        const directionsService = new google.maps.DirectionsService();

        directionsService.route(
          {
            origin: player,
            destination: destination,
            travelMode: google.maps.TravelMode.WALKING
          },
          (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
              const overViewCoords = result.routes[0].overview_path;
              directionsArr.push(overViewCoords);
              // console.log('directionsArr', directionsArr);
              this.setState({ otherPlayerDirections: directionsArr });
            }
          }
        );
      });
      // this.setState({
      //   directions: directionsArr
      // });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleZoomChanged = () => {
    // const zoomLevel = this.map.getZoom();
    // console.log('ZOOM:', zoomLevel);
  };

  render() {
    const { locationPOI, otherPlayers, currentPlayer } = this.props;
    const { zoomLevel, directions, otherPlayerDirections } = this.state;

    const icon = { url: PlaceIcon, scaledSize: { width: 24, height: 24 } };
    // const position = { lat: -33.917825, lng: 18.42408 };
    // console.log('LocationsMap:', this.props.markerPosition);

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
      >
        <Marker
          position={locationPOI}
          // options={{ icon }}
        />
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
              icon
            }}
          />
        )}
        {otherPlayers
          ? otherPlayers.map(marker => {
              return (
                <Marker
                  key={`${marker.lat}${marker.long}`}
                  position={marker}
                  options={{
                    icon
                  }}
                  style={{
                    transform: 'translate(-50%, -100%)'
                  }}
                />
              );
            })
          : null}
        {currentPlayer && directions && (
          // <DirectionsRenderer
          //   directions={directions}
          //   options={{
          //     suppressMarkers: true,
          //     polylineOptions: {
          //       strokeWeight: 4,
          //       strokeOpacity: 0.8,
          //       strokeColor: '#fce392'
          //     }
          //   }}
          // />
          <Polyline
            path={directions}
            geodesic={false}
            options={{
              strokeColor: '#ff2e2b',
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

export default withScriptjs(withGoogleMap(LocationsMap));
