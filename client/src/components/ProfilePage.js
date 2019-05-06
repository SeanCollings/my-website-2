import React, { Component } from 'react';

// import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

import Paper from './components/paper';
import Footer from './components/footer';

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
        <Paper title="My Profile" content="Probably some important stuff" />
        <Footer />
      </div>
    );
  }
}

export default withStyles(styles)(ProfilePage);
