import React, { Component } from 'react';

import Paper from './components/paper';

import { withStyles } from '@material-ui/core/styles';

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
        <Paper title="User Page" />
      </div>
    );
  }
}

export default withStyles(styles)(ContactsPage);
