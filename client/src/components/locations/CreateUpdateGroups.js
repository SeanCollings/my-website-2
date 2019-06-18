import React, { Component } from 'react';
import { connect } from 'react-redux';

import UploadIcon from '../components/UploadIcon';
import SetGroupLocation from './SetGroupLocation';
import SetLocationMap from './SetLocationMap';

// import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  page: {
    textAlign: 'center',
    backgroundColor: 'white',
    borderRadius: '15px',
    maxWidth: '800px',
    margin: 'auto'
    // marginTop: '12px'
  },
  textField: {
    width: 200
  }
});

class CreateUpateGroups extends Component {
  state = {
    errorGroupName: false,
    groupName: '',
    groupIcon: null,
    markerPosition: null
  };

  renderUsersList = () => {
    return <div>renderUsersList</div>;
  };

  renderNonSuperUserList = () => {
    return <div>renderNonSuperUserList</div>;
  };

  handleTextChange = event => {
    const error = event.target.value === 0;

    this.setState({
      ...this.state,
      groupName: event.target.value,
      errorGroupName: error
    });
  };

  showMapSelected = () => {
    this.props.mapDisplayed();
  };

  render() {
    const { classes, auth, heightFactor, topHeight, hideMap } = this.props;
    const {
      errorGroupName,
      // groupIcon,
      groupName,
      // creatingUpdatingGroup,
      markerPosition
    } = this.state;

    const groupFirstLetter = groupName.charAt(0).toUpperCase();

    return (
      <div className={classes.page}>
        {hideMap ? (
          <SetLocationMap
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
            markerPosition={position =>
              this.setState({ markerPosition: position })
            }
            selectedPosition={markerPosition}
          />
        ) : (
          <div>
            <TextField
              id="group-name"
              className={classes.textField}
              margin="normal"
              label="Group Name"
              // placeholder="Group Name"
              error={errorGroupName}
              value={groupName}
              onChange={event => this.handleTextChange(event)}
            />
            <List>
              <ListItem
                style={{
                  justifyContent: 'center',
                  paddingTop: '0px',
                  paddingBottom: '0px'
                }}
              >
                <ListItemText primary="Group Icon:" style={{ flex: 'none' }} />
                <UploadIcon
                  letter={groupFirstLetter.length > 0 ? groupFirstLetter : 'G'}
                  colorMain={'#900C3F'}
                  colorText={'white'}
                  setGroupIcon={groupIcon => this.setState({ groupIcon })}
                />
              </ListItem>
              <ListItem style={{ paddingTop: '0px' }}>
                <SetGroupLocation
                  showMap={() => this.showMapSelected()}
                  markerPosition={markerPosition}
                />
              </ListItem>
              <Divider />
            </List>
            {auth.superUser ? (
              <div>
                <Typography style={{ paddingBottom: '8px' }}>
                  Add Members:
                </Typography>
                <List
                  style={{
                    maxHeight: '265px',
                    overflow: 'auto',
                    paddingTop: '0px'
                  }}
                >
                  {this.renderUsersList()}
                </List>
              </div>
            ) : (
              this.renderNonSuperUserList()
            )}
          </div>
        )}
      </div>
    );
  }
}

function mapStateToProps({ auth, maintenance, snackBar }) {
  return {
    auth,
    maintenance,
    snackBar
  };
}

export default connect(mapStateToProps)(withStyles(styles)(CreateUpateGroups));
