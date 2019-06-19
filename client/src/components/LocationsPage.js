import React, { Component } from 'react';
import { connect } from 'react-redux';

import LocationSelected from './locations/LocationSelected';
import LocationGroups from './locations/LocationGroups';
import CreateUpdateButtons from './locations/CreateUpdateButtons';
import CreateUpateGroups from './locations/CreateUpdateGroups';
import WhoopsieDoodle from '../components/components/WhoopsieDoodle';

import Grid from '@material-ui/core/Grid';

class LocationsPage extends Component {
  state = {
    locationSelected: false,
    createGroup: false,
    editGroup: false,
    mapDisplayed: false,
    hideLocationSelection: false,
    savePosition: false,
    creatingUpdatingGroup: false
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  cancelCreateClicked = () => {
    const { mapDisplayed, createEditGroup } = this.state;

    if (mapDisplayed) {
      this.setState({ mapDisplayed: false });
    } else {
      this.setState({
        ...this.state,
        createEditGroup: !createEditGroup,
        mapDisplayed: false
      });
    }
  };

  confirmCreateClicked = () => {
    const { createEditGroup, mapDisplayed } = this.state;

    if (!createEditGroup) {
      this.setState({
        ...this.state,
        createEditGroup: true,
        creatingUpdatingGroup: false
      });
    } else {
      if (mapDisplayed) {
        this.setState({
          ...this.state,
          mapDisplayed: false,
          savePosition: true
        });
      } else {
        this.setState({ creatingUpdatingGroup: true });
      }
    }
  };

  render() {
    const { app, resizeScreen } = this.props;
    const {
      locationSelected,
      createEditGroup,
      editGroup,
      mapDisplayed,
      savePosition,
      creatingUpdatingGroup
    } = this.state;
    const topHeight = '56px';
    const heightFactor = resizeScreen ? '56px' : '64px';

    if (app.locationState !== 'granted')
      return <WhoopsieDoodle toEnable="Location" />;

    const locationPOI = { lat: -33.917825, lng: 18.42408 };

    return (
      <div>
        {!locationSelected ? (
          <Grid
            item
            style={{
              marginLeft: !mapDisplayed ? '24px' : '',
              marginRight: !mapDisplayed ? '24px' : ''
            }}
          >
            <Grid
              container
              alignItems="center"
              justify="center"
              style={{
                height: topHeight
              }}
            >
              <CreateUpdateButtons
                createEditGroup={createEditGroup}
                editgroup={editGroup}
                cancelCreateClicked={() => this.cancelCreateClicked()}
                confirmCreateClicked={() => this.confirmCreateClicked()}
                mapDisplayed={mapDisplayed}
              />
            </Grid>
            {createEditGroup ? (
              <CreateUpateGroups
                topHeight={topHeight}
                heightFactor={heightFactor}
                mapDisplayed={() =>
                  this.setState({
                    ...this.state,
                    mapDisplayed: true,
                    hideLocationSelection: false
                  })
                }
                hideMap={mapDisplayed}
                savePosition={savePosition}
                positionSaved={() => this.setState({ savePosition: false })}
                creatingUpdatingGroup={creatingUpdatingGroup}
                createUpdateComplete={() =>
                  this.setState({
                    creatingUpdatingGroup: false
                  })
                }
                showAllGroups={() => this.cancelCreateClicked()}
              />
            ) : (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <LocationGroups
                  selectedGroup={selectedGroup =>
                    console.log('SelectedGroup:', selectedGroup)
                  }
                />
              </div>
            )}
          </Grid>
        ) : (
          <LocationSelected
            height={topHeight}
            heightFactor={heightFactor}
            locationPOI={locationPOI}
          />
        )}
      </div>
    );
  }
}

function mapStateToProps({ app, resizeScreen }) {
  return { app, resizeScreen };
}

export default connect(mapStateToProps)(LocationsPage);
