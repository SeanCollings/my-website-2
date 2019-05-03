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

class ContactsPage extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.pageFill}>
        <Header headerName="Home" colour="#120533" />
        <Paper title="Contact Me" content="Feel free to send me a message" />
        <Footer />
      </div>
    );
  }
}

export default withStyles(styles)(ContactsPage);
