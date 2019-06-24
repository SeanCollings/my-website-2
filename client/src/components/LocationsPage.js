import React, { Component } from 'react';
import { connect } from 'react-redux';
import { locationGroupSelected } from '../actions/locationActions';

import LocationSelected from './locations/LocationSelected';
import LocationGroups from './locations/LocationGroups';
import CreateUpdateButtons from './locations/CreateUpdateButtons';
import CreateUpateGroups from './locations/CreateUpdateGroups';
import WhoopsieDoodle from '../components/components/WhoopsieDoodle';

import Grid from '@material-ui/core/Grid';

class LocationsPage extends Component {
  state = {
    selectedGroup: null,
    createGroup: false,
    editGroup: null,
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
        mapDisplayed: false,
        editGroup: null,
        creatingUpdatingGroup: false
      });
    }
  };

  confirmCreateUpdateClicked = () => {
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
        this.setState({ ...this.state, creatingUpdatingGroup: true });
      }
    }
  };

  groupSelected = selectedGroup => {
    this.setState({ selectedGroup });
    this.props.locationGroupSelected(selectedGroup.name);
  };

  returnToGroups = () => {
    this.setState({ selectedGroup: false });
    this.props.locationGroupSelected(null);
  };

  render() {
    const { app, resizeScreen } = this.props;
    const {
      selectedGroup,
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

    return (
      <div>
        {!selectedGroup ? (
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
                editGroup={editGroup}
                cancelCreateClicked={() => this.cancelCreateClicked()}
                confirmCreateUpdateClicked={() =>
                  this.confirmCreateUpdateClicked()
                }
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
                editGroup={editGroup}
              />
            ) : (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <LocationGroups
                  selectedGroup={selectedGroup =>
                    this.groupSelected(selectedGroup)
                  }
                  editGroup={selectedGroup =>
                    this.setState({
                      ...this.state,
                      editGroup: selectedGroup,
                      createEditGroup: true
                    })
                  }
                />
              </div>
            )}
          </Grid>
        ) : (
          <LocationSelected
            topHeight={topHeight}
            heightFactor={heightFactor}
            locationPOI={selectedGroup.location}
            returnToGroups={() => this.returnToGroups()}
            groupId={selectedGroup._id}
          />
        )}
      </div>
    );
  }
}

function mapStateToProps({ app, resizeScreen }) {
  return { app, resizeScreen };
}

export default connect(
  mapStateToProps,
  { locationGroupSelected }
)(LocationsPage);
