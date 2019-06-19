import React, { Component } from 'react';

import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import CancelIcon from '@material-ui/icons/Cancel';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({});

class UploadIcon extends Component {
  state = { groupIcon: null };

  componentDidMount() {
    const { groupIcon } = this.props;

    if (groupIcon) this.setState({ groupIcon });
  }

  uploadImageToScreen = event => {
    if (event && event.target && event.target.files[0]) {
      const image = event.target.files[0];
      const imageType = image.type;

      const reader = new FileReader();
      reader.readAsArrayBuffer(image);

      reader.onload = event => {
        var blob = new Blob([event.target.result]);
        window.URL = window.URL || window.webkitURL;
        var blobURL = window.URL.createObjectURL(blob);
        var image = new Image();
        image.src = blobURL;
        image.onload = () => {
          const width = 50;
          const scaleFactor = width / image.width;
          const height = image.height * scaleFactor;

          let canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          var ctx = canvas.getContext('2d');
          ctx.drawImage(image, 0, 0, width, height);
          const resized = canvas.toDataURL(imageType, 0.8);

          this.setState({
            groupIcon: resized
          });

          this.props.setGroupIcon(resized);
        };
      };
      reader.onerror = error => console.log(error);
    }
  };

  render() {
    const { letter, colorMain, colorText } = this.props;
    const { groupIcon } = this.state;

    return (
      <Grid
        container
        direction="row"
        justify="center"
        style={{ width: '100px' }}
      >
        <div>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="group-image-input"
            multiple={false}
            type="file"
            onChange={event => this.uploadImageToScreen(event)}
          />
          <label htmlFor="group-image-input">
            <Avatar
              src={groupIcon}
              style={{
                backgroundColor: groupIcon ? 'transparent' : colorMain,
                color: colorText
              }}
            >
              {letter}
            </Avatar>
          </label>
        </div>
        <IconButton
          onClick={() => this.setState({ groupIcon: null })}
          style={{ paddingRight: '0px', marginLeft: '24px' }}
        >
          <CancelIcon />
        </IconButton>
      </Grid>
    );
  }
}

export default withStyles(styles)(UploadIcon);
