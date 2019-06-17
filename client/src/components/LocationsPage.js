import React, { Component } from 'react';
import { connect } from 'react-redux';

import LocationsMap from './locations/LocationsMap';
import LocationsBeginEnd from './locations/LocationsBeginEnd';
import WhoopsieDoodle from '../components/components/WhoopsieDoodle';

class LocationsPage extends Component {
  state = {
    currentPlayer: null,
    otherPlayers: [
      // { lat: -33.941897, lng: 18.375396 },
      { lat: -33.943376, lng: 18.459384, name: 'Jarrod' },
      { lat: -33.930353, lng: 18.423266, name: 'Matthew' }
    ],
    showOtherPlayers: false
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  setPosition = position => {
    console.log('Position:', position);

    if (position && position.lat !== -33.8911836)
      position = { lat: -33.8911836, lng: 18.5107103 };
    this.setState({
      ...this.state,
      currentPlayer: position ? { lat: position.lat, lng: position.lng } : null,
      showOtherPlayers: position ? true : false
    });
  };

  render() {
    const { resizeScreen, app } = this.props;
    const { currentPlayer, otherPlayers, showOtherPlayers } = this.state;
    const heightFactor = resizeScreen ? '56px' : '64px';
    const beginEndHeight = '56px';

    if (app.locationState !== 'granted')
      return <WhoopsieDoodle toEnable="Location" />;

    const locationPOI = { lat: -33.917825, lng: 18.42408 };

    return (
      <div>
        <LocationsBeginEnd
          height={beginEndHeight}
          setPosition={this.setPosition}
          otherPlayersLength={otherPlayers.length}
        />
        <LocationsMap
          currentPlayer={currentPlayer ? currentPlayer : null}
          locationPOI={locationPOI}
          otherPlayers={showOtherPlayers ? otherPlayers : null}
          // googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyByWkAe9UopNpFK6TPEEJ4ak4fMtS7IZD8&amp;v=3.exp&amp;libraries=geometry,drawing,places,visualization"
          googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyDD0nkesefYmPhscdaz0EO9XK_MwD5i9QE&amp;v=3.exp&amp;libraries=geometry,drawing,places,visualization"
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

function mapStateToProps({ resizeScreen, app, auth }) {
  return { resizeScreen, app, auth };
}

export default connect(mapStateToProps)(LocationsPage);
