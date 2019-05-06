import React, { Component } from 'react';

// import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

import Paper from './components/paper';

const styles = theme => ({
  pageFill: {
    paddingBottom: '2.5rem'
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
      </div>
    );
  }
}

export default withStyles(styles)(ProjectsPage);
