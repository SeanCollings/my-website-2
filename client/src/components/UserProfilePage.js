import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import Loader from 'react-loader-advanced';
// import MiniLoader from 'react-loader-spinner';
// import { ClipLoader } from 'halogenium';
import * as actions from '../actions';
import { showMessage } from '../actions/snackBarActions';

// import Button from '@material-ui/core/Button';
// import Typography from '@material-ui/core/Typography';
// import Grid from '@material-ui/core/Grid';
// import Radio from '@material-ui/core/Radio';
// import RadioGroup from '@material-ui/core/RadioGroup';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import FormControl from '@material-ui/core/FormControl';
// import FormLabel from '@material-ui/core/FormLabel';
import { withStyles } from '@material-ui/core/styles';

import Paper from './components/paper';

const styles = theme => ({
  pageFill: {
    // paddingBottom: '2.5rem'
  },
  root: {
    backgroundColor: 'white',
    marginLeft: '24px',
    marginRight: '24px',
    marginTop: '10px'
  },
  formControl: {
    margin: theme.spacing.unit * 3
  },
  group: {
    margin: `${theme.spacing.unit}px 0`
  }
});

class UserProfilePage extends Component {
  state = {
    value: '',
    getUserSettings: false,
    firstMount: true,
    showLoader: true
  };
  render() {
    const { classes, auth } = this.props;

    if (!auth) return null;

    return (
      <div className={classes.pageFill}>
        <Paper
          title={`${auth.givenName} ${auth.familyName}`}
          content="Welcome to the Wall of Flame!"
        />
        <Paper
          style={{ paddnigTop: '48px' }}
          content="I'm sure we should be proud of you"
        />
        <Paper content="." />
        <Paper content="." />
        <Paper content="." />
        <Paper content="." />
        <Paper content="." />
        <Paper content="." />
        <Paper content="." />
        <Paper
          style={{ paddnigTop: '48px' }}
          content="But seriously, something coming here soon..."
        />
      </div>
    );
  }
}

UserProfilePage.propTypes = {
  classes: PropTypes.object.isRequired
};

function mapStateToProps({ auth, resizeScreen, settings, snackBar }) {
  return { auth, resizeScreen, settings, snackBar };
}

export default connect(
  mapStateToProps,
  { ...actions, showMessage }
)(withStyles(styles)(UserProfilePage));
