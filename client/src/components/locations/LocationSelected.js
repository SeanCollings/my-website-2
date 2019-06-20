import React, { Component } from 'react';
import { connect } from 'react-redux';

import LocationsMap from './LocationsMap';
import LocationsBeginEnd from './LocationsBeginEnd';

class LocationsSelected extends Component {
  state = {
    currentPlayer: null,
    otherPlayers: [
      // { lat: -33.941897, lng: 18.375396 },
      { lat: -33.943376, lng: 18.459384, name: 'Jarrod' },
      { lat: -33.930353, lng: 18.423266, name: 'Matthew' }
    ],
    showOtherPlayers: false,
    pusher: null,
    locationStarted: false
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  setPosition = position => {
    console.log('Position:', position);

    this.setState({
      ...this.state,
      currentPlayer: position ? { lat: position.lat, lng: position.lng } : null
      // showOtherPlayers: position ? true : false
    });
  };

  render() {
    const { locationPOI, topHeight, heightFactor, groupId } = this.props;
    const { currentPlayer, otherPlayers, showOtherPlayers } = this.state;

    return (
      <div>
        <LocationsBeginEnd
          topHeight={topHeight}
          setPosition={this.setPosition}
          otherPlayersLength={otherPlayers ? otherPlayers.length : 0}
          returnToGroups={() => this.props.returnToGroups()}
          groupId={groupId}
          locationStarted={locationStarted =>
            this.setState({ locationStarted })
          }
        />
        <LocationsMap
          currentPlayer={currentPlayer ? currentPlayer : null}
          locationPOI={locationPOI}
          otherPlayers={showOtherPlayers ? otherPlayers : null}
          googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyDD0nkesefYmPhscdaz0EO9XK_MwD5i9QE&amp;v=3.exp&amp;libraries=geometry,drawing,places,visualization"
          loadingElement={<div style={{ height: `100vh` }} />}
          containerElement={<div style={{ height: '100%' }} />}
          mapElement={
            <div
              style={{
                height: `calc(100vh - ${heightFactor} - ${topHeight})`
              }}
            />
          }
        />
      </div>
    );
  }
}

export default connect(null)(LocationsSelected);
