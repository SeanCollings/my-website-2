import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    // paddingTop: '10px',
    // paddingBottom: '10px',
    textAlign: 'center',
    backgroundColor: 'transparent'
  },
  textColour: {
    color: '#DEDEDE'
  }
});

function PaperSheet(props) {
  const { classes } = props;

  return (
    <div style={{ paddingTop: '10px' }}>
      <Paper className={classes.root} elevation={0}>
        {/* <Typography variant="h5" component="h3" className={classes.textColour}>
          {props.title}
        </Typography> */}
        <Typography component="p" className={classes.textColour}>
          {props.content}
        </Typography>
      </Paper>
    </div>
  );
}

PaperSheet.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(PaperSheet);
