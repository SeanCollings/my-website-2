import React, { Component } from 'react';
import { connect } from 'react-redux';

import LocationsMap from './locations/LocationsMap';

class LocationsPage extends Component {
  render() {
    const { resizeScreen } = this.props;
    const heightFactor = resizeScreen ? '56px' : '64px';

    return (
      <LocationsMap
        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyByWkAe9UopNpFK6TPEEJ4ak4fMtS7IZD8&amp;v=3.exp&amp;libraries=geometry,drawing,places,visualization"
        loadingElement={<div style={{ height: `100vh` }} />}
        containerElement={<div style={{ height: '100%' }} />}
        mapElement={<div style={{ height: `calc(100vh - ${heightFactor})` }} />}
      />
    );
  }
}

function mapStateToProps({ resizeScreen }) {
  return { resizeScreen };
}

export default connect(mapStateToProps)(LocationsPage);
