import React, { Component } from 'react';

import { withScriptjs, withGoogleMap, GoogleMap } from 'react-google-maps';

class LocationsMap extends Component {
  render() {
    return (
      <GoogleMap
        ref="map"
        defaultZoom={12}
        center={{ lat: -33.924869, lng: 18.424055 }}
      >
        {/* {markers} */}
      </GoogleMap>
    );
  }
}

export default withScriptjs(withGoogleMap(LocationsMap));
