import React, { Component } from 'react';

// import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

import Paper from './components/paper';

const styles = theme => ({
  pageFill: {
    paddingBottom: '2.5rem'
  }
});

class ProfilePage extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.pageFill}>
        {/* <Button variant="contained" color="primary" href="/home">
          {' '}
          Home
        </Button> */}
        <Paper
          // title="About Me"
          content="'Who are you?' you may ask. Good question..."
        />
      </div>
    );
  }
}

export default withStyles(styles)(ProfilePage);
