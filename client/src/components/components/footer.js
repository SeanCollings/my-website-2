import React from 'react';

import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  footer: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
    backgroundColor: '#444444',
    textAlign: 'center',
    height: '25px',
    paddingTop: '10px'
  }
};

function footer(props) {
  const { classes } = props;
  return (
    <footer className={classes.footer}>
      <Typography style={{ color: '#DEDEDE' }}>
        © 2019 Sean Collings. All rights reserved.
      </Typography>
    </footer>
  );
}

export default withStyles(styles)(footer);
