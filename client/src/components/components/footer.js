import React from 'react';

import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

// import version from '../../utils/version.js';

const styles = {
  footer: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
    backgroundColor: '#444444',
    textAlign: 'center',
    height: '2.5rem',
    paddingTop: '10px'
  }
};

function footer(props) {
  const { classes } = props;
  // const v = `${version.mainVersion}.${version.subVersion}`;

  return (
    <footer className={classes.footer}>
      <Typography style={{ color: '#DEDEDE' }}>
        © 2019 Sean Collings. All rights reserved.
      </Typography>
      {/* <Typography
        style={{
          color: '#DEDEDE',
          textAlign: 'right',
          marginRight: '10px'
        }}
      >
        version {v}
      </Typography> */}
    </footer>
  );
}

export default withStyles(styles)(footer);
