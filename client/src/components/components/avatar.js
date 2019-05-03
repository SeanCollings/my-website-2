import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import deepPurple from '@material-ui/core/colors/deepPurple';

import profilePic from '../../images/fry.png';

const styles = {
  avatar: {
    margin: 10
  },
  bigAvatar: {
    margin: 10,
    width: 60,
    height: 60
  },
  purpleAvatar: {
    margin: 10,
    color: '#fff',
    backgroundColor: deepPurple[500]
  }
};

function ImageAvatars(props) {
  const { classes } = props;

  return (
    <Grid container justify="center" alignItems="center">
      <Avatar alt="Profile Pic" src={profilePic} className={classes.avatar} />
      {/* <Avatar className={classes.purpleAvatar}>AV</Avatar> */}
    </Grid>
  );
}

ImageAvatars.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ImageAvatars);
