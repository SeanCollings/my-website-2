import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';

import Paper from './components/paper';

const styles = theme => ({
  pageFill: {
    paddingBottom: '2.5rem'
  }
});

class PereryvPage extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.pageFill}>
        <Paper content="Pereryv page coming soon..." />
      </div>
    );
  }
}

export default withStyles(styles)(PereryvPage);
