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
    // backgroundColor: '#444444',
    backgroundColor: 'White',
    // backgroundImage: 'linear-gradient(white, #444444 90%)',
    textAlign: 'center'
    // height: '2.5rem'
    // paddingTop: '10px'
  }
};

function footer(props) {
  const { classes } = props;
  // const ver = version.version;

  return (
    <footer className={classes.footer}>
      <Typography
        style={{
          // color: '#DEDEDE',
          color: '#444444',
          alignItems: 'center'
        }}
        component="div"
      >
        © 2019 Sean Collings. All rights reserved.
        {/* <Typography
          style={{
            color: '#DEDEDE',
            float: 'right',
            marginRight: '10px'
          }}
        >
          version {ver}
        </Typography> */}
      </Typography>
    </footer>
  );
}

export default withStyles(styles)(footer);
