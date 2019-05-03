import React, { Component } from 'react';

// import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

import Header from './components/Header';
import Paper from './components/paper';
import Footer from './components/footer';

const styles = theme => ({
  pageFill: {
    minHeight: '98vh',
    position: 'relative'
  }
});

class ProfilePage extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.pageFill}>
        <Header headerName="Home" colour="#996a0d" />
        {/* <Button variant="contained" color="primary" href="/home">
          {' '}
          Home
        </Button> */}
        <Paper
          title="My Profile"
          content="Probably some important stuff"
        />
        <Footer />
      </div>
    );
  }
}

export default withStyles(styles)(ProfilePage);
