import React, { Component } from 'react';

// import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import AddLocationIcon from '@material-ui/icons/AddLocation';

class SetGroupLocation extends Component {
  // state = { location: { lat: -33.917825, lng: 18.42408 } };

  render() {
    const { markerPosition } = this.props;

    return (
      <Grid container justify="center" alignItems="center">
        <Typography style={{ display: !markerPosition ? 'none' : '' }}>
          Location:
        </Typography>
        <Typography style={{ fontStyle: 'italic' }}>
          {markerPosition
            ? `${markerPosition.lat.toFixed(6)}, ${markerPosition.lng.toFixed(
                6
              )}`
            : 'select location'}
        </Typography>
        <IconButton
          onClick={this.props.showMap}
          style={{ paddingRight: '0px' }}
        >
          <AddLocationIcon />
        </IconButton>
      </Grid>
    );
  }
}

export default SetGroupLocation;
