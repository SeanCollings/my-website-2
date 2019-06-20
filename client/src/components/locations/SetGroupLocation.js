import React, { Component } from 'react';
import openGeocoder from 'node-open-geocoder';

import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import AddLocationIcon from '@material-ui/icons/AddLocation';

class SetGroupLocation extends Component {
  state = { address: null, location: null };

  componentDidUpdate() {
    const { markerPosition } = this.props;
    const { currentMarkerPosition } = this.state;

    if (markerPosition) {
      if (currentMarkerPosition !== markerPosition) {
        openGeocoder()
          .reverse(markerPosition.lng, markerPosition.lat)
          .end((err, res) => {
            if (res) {
              this.setState({
                ...this.state,
                address: res.display_name,
                currentMarkerPosition: markerPosition
              });
            } else if (err) {
              this.setState({ address: null });
            }
          });
      }
    }
  }

  render() {
    const { markerPosition, showErrors } = this.props;
    const { address } = this.state;

    const displayName = address
      ? address
      : markerPosition
      ? `${markerPosition.lat.toFixed(5)}, ${markerPosition.lng.toFixed(5)}`
      : 'Select location';

    return (
      <Grid
        container
        justify="center"
        alignItems="center"
        style={{ marginTop: '6px' }}
      >
        <Typography style={{ display: !markerPosition ? 'none' : '' }}>
          Location:
        </Typography>
        <Typography
          style={{
            fontStyle: 'italic',
            color: showErrors ? '#FF4136' : '',
            paddingRight: address ? '' : '12px',
            textAlign: 'center'
          }}
          onClick={this.props.showMap}
        >
          {displayName}
        </Typography>
        <IconButton
          onClick={this.props.showMap}
          style={{
            paddingRight: '0px',
            paddingLeft: '0px',
            color: showErrors ? '#FF4136' : ''
          }}
        >
          <AddLocationIcon />
        </IconButton>
      </Grid>
    );
  }
}

export default SetGroupLocation;
