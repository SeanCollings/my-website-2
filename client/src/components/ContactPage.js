import React, { Component } from 'react';

// import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

import Paper from './components/paper';
// import Footer from './components/footer';

const styles = theme => ({
  pageFill: {
    paddingBottom: '2.5rem'
  }
});

class ContactsPage extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.pageFill}>
        <Paper
          // title="Contact Me"
          content="Feel free to send me a message, somehow"
        />
      </div>
    );
  }
}

export default withStyles(styles)(ContactsPage);
