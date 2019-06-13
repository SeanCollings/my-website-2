import React, { Component } from 'react';

import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from 'react-google-maps';

class LocationsMap extends Component {
  render() {
    return (
      <GoogleMap
        ref="map"
        defaultZoom={15}
        center={{ lat: -33.917825, lng: 18.42408 }}
      >
        <Marker position={{ lat: -33.917825, lng: 18.42408 }} />
      </GoogleMap>
    );
  }
}

export default withScriptjs(withGoogleMap(LocationsMap));
