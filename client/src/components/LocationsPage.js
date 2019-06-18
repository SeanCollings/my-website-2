import React, { Component } from 'react';
import { connect } from 'react-redux';

import LocationSelected from './locations/LocationSelected';
import LocationGroups from './locations/LocationGroups';
import CreateLocationsGroup from './locations/CreateLocationsGroup';
import WhoopsieDoodle from '../components/components/WhoopsieDoodle';

import Grid from '@material-ui/core/Grid';

class LocationsPage extends Component {
  state = { locationSelected: false, createGroup: false, editGroup: false };

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { app } = this.props;
    const { locationSelected, createEditGroup, editGroup } = this.state;

    if (app.locationState !== 'granted')
      return <WhoopsieDoodle toEnable="Location" />;

    const locationPOI = { lat: -33.917825, lng: 18.42408 };

    return (
      <div>
        {!locationSelected ? (
          <Grid
            style={{
              paddingTop: '12px',
              marginLeft: '24px',
              marginRight: '24px'
            }}
          >
            <CreateLocationsGroup
              createEditGroup={createEditGroup}
              editgroup={editGroup}
              createGroupClicked={() =>
                this.setState({ createEditGroup: !createEditGroup })
              }
            />
            {createEditGroup ? (
              <div>Test</div>
            ) : (
              <div>
                <LocationGroups
                  selectedGroup={selectedGroup =>
                    console.log('SelectedGroup:', selectedGroup)
                  }
                />
              </div>
            )}
          </Grid>
        ) : (
          <LocationSelected locationPOI={locationPOI} />
        )}
      </div>
    );
  }
}

function mapStateToProps({ app }) {
  return { app };
}

export default connect(mapStateToProps)(LocationsPage);
