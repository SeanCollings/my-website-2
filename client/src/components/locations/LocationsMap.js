import React, { Component } from 'react';

import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from 'react-google-maps';
import { MAP_OPTIONS } from './mapOptions';

// import PlaceIcon from '@material-ui/icons/Place';
// import PlaceIcon from '../../images/icons/icon-96x96.png';

class LocationsMap extends Component {
  render() {
    // const icon = { url: PlaceIcon, scaledSize: { width: 32, height: 32 } };
    const position = { lat: -33.917825, lng: 18.42408 };

    return (
      <GoogleMap
        ref="map"
        zoom={15}
        defaultCenter={{ lat: -33.917825, lng: 18.42408 }}
        defaultOptions={{ disableAutoPan: true }}
        options={MAP_OPTIONS}
      >
        <Marker
          position={position}
          options={
            {
              /*icon*/
            }
          }
        />
      </GoogleMap>
    );
  }
}

export default withScriptjs(withGoogleMap(LocationsMap));
