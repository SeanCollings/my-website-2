import React, { Component } from 'react';

// import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

import Paper from './components/paper';
import ComplexCard from './components/ComplexCard';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
  pageFill: {
    // paddingBottom: '2.5rem'
  },
  card: {
    paddingLeft: '5px',
    paddingRight: '5px'
  }
});

class ProjectsPage extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.pageFill}>
        <Paper
          title="My Projects"
          content="Just some of the projects I have worked on"
        />
        <Grid>
          <Grid item >
            <ComplexCard className={classes.card} />
          </Grid>
        </Grid>
        <div style={{ height: '40px' }} />
      </div>
    );
  }
}

export default withStyles(styles)(ProjectsPage);
