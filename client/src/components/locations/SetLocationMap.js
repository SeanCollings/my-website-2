import React, { Component } from 'react';

import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from 'react-google-maps';

class SetLocationMap extends Component {
  state = { zoomLevel: 15, center: null, markerLocation: null };

  componentDidMount() {
    const { selectedPosition } = this.props;

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        this.setState({
          ...this.state,
          center: selectedPosition ? selectedPosition : location,
          markerLocation: selectedPosition ? selectedPosition : location
        });

        if (!selectedPosition) this.props.markerPosition(location);
      });
    }
  }

  mapClicked = e => {
    // console.log('lat:', e.latLng.lat(), ' lng: ', e.latLng.lng());
    const markerLocation = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    this.setState({
      markerLocation
    });

    this.props.markerPosition(markerLocation);
  };

  render() {
    const { zoomLevel, center, markerLocation } = this.state;

    return (
      <GoogleMap
        id="map"
        ref={ref => {
          this.map = ref;
        }}
        defaultZoom={zoomLevel}
        center={center ? center : { lat: -33.924885, lng: 18.424128 }}
        onClick={e => this.mapClicked(e)}
      >
        {center && (
          <Marker position={markerLocation ? markerLocation : center} />
        )}
      </GoogleMap>
    );
  }
}

export default withScriptjs(withGoogleMap(SetLocationMap));
