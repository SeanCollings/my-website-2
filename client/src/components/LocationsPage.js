import React, { Component } from 'react';
import { connect } from 'react-redux';

import LocationsMap from './locations/LocationsMap';
import LocationsBeginEnd from './locations/LocationsBeginEnd';
import WhoopsieDoodle from '../components/components/WhoopsieDoodle';

class LocationsPage extends Component {
  render() {
    const { resizeScreen, app } = this.props;
    const heightFactor = resizeScreen ? '56px' : '64px';
    const beginEndHeight = '56px';

    if (app.locationState === 'granted')
      return <WhoopsieDoodle toEnable="Location" />;

    return (
      <div>
        <LocationsBeginEnd height={beginEndHeight} />
        <LocationsMap
          googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyByWkAe9UopNpFK6TPEEJ4ak4fMtS7IZD8&amp;v=3.exp&amp;libraries=geometry,drawing,places,visualization"
          loadingElement={<div style={{ height: `100vh` }} />}
          containerElement={<div style={{ height: '100%' }} />}
          mapElement={
            <div
              style={{
                height: `calc(100vh - ${heightFactor} - ${beginEndHeight})`
              }}
            />
          }
        />
      </div>
    );
  }
}

function mapStateToProps({ resizeScreen, app }) {
  return { resizeScreen, app };
}

export default connect(mapStateToProps)(LocationsPage);
