import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

const styles = {
  root: {
    flexGrow: 1,
    display: 'absolute',
    zIndex: 10000
  }
};

function LinearIndeterminate(props) {
  const { classes, loaded } = props;

  if (loaded) return null;

  return (
    <div className={classes.root}>
      <LinearProgress color="primary" />
    </div>
  );
}

LinearIndeterminate.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(LinearIndeterminate);
