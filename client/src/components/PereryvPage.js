import React, { Component } from 'react';

import { adjectives, nouns } from '../utils/slateNames';

import Paper from './components/paper';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  pageFill: {
    paddingBottom: '2.5rem'
  }
});

class PereryvPage extends Component {
  render() {
    const { classes } = this.props;

    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];

    return (
      <div className={classes.pageFill}>
        <Paper content={`${adjective} ${noun}`} />
      </div>
    );
  }
}

export default withStyles(styles)(PereryvPage);
