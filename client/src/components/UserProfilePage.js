import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Loader from 'react-loader-advanced';
import MiniLoader from 'react-loader-spinner';
// import { ClipLoader } from 'halogenium';
import * as actions from '../actions';
import { showMessage } from '../actions/snackBarActions';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { withStyles } from '@material-ui/core/styles';

import Paper from './components/paper';

const styles = theme => ({
  pageFill: {
    // paddingBottom: '2.5rem'
  },
  root: {
    // display: 'flex',
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
    firstMount: true
  };

  componentDidMount() {
    // this.setState({ getUserSettings: true });
    this.props.getUserSettings();
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.snackBar.open && this.state.getUserSettings) {
      this.setState({ getUserSettings: false });
      this.props.getUserSettings();
    }

    return true;
  }

  componentWillUpdate(props) {
    if (props.settings) {
      if (this.state.firstMount) {
        this.setState({ firstMount: false });
        if (props.settings.profilePic !== this.state.value) {
          this.setState({ value: props.settings.profilePic });
        }
      }
    }
  }

  handleChange = event => {
    this.setState({ value: event.target.value });
  };

  spinner = (
    <span>
      <MiniLoader type="TailSpin" color="#FFC300" height={45} width={45} />
    </span>
  );

  spinnerSmall = (
    <span>
      <MiniLoader type="TailSpin" color="#FFC300" height={30} width={30} />
    </span>
  );

  avatarSelection() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Loader
          show={this.props.settings === null ? true : false}
          message={this.spinner}
          style={{ width: '100%' }}
        >
          <FormControl component="fieldset" className={classes.formControl}>
            <FormLabel component="legend">Preferred Profile Picture:</FormLabel>
            <RadioGroup
              aria-label="PreferredProfile"
              name="PreferredProfile"
              className={classes.group}
              value={this.state.value}
              onChange={this.handleChange}
            >
              <FormControlLabel value="none" control={<Radio />} label="None" />
              <FormControlLabel
                value="google"
                control={<Radio />}
                label="Google"
              />
              <FormControlLabel
                value="gravatar"
                control={<Radio />}
                label="Gravatar"
              />
            </RadioGroup>
          </FormControl>
        </Loader>
      </div>
    );
  }

  renderSettings() {
    return (
      <Grid>
        <Grid item style={{ textAlign: 'center', marginTop: '24px' }}>
          <Typography style={{ color: '#DEDEDE', fontSize: 'large' }}>
            Settings:
          </Typography>
          {/* <Typography>Select your preferred profile picture</Typography> */}
          {this.avatarSelection()}
        </Grid>
      </Grid>
    );
  }

  submitClick = event => {
    event.preventDefault();
    this.setState({ shouldCall: true });
    this.setState({ getUserSettings: true });
    this.props.updateProfilePic(this.state.value);
  };

  render() {
    const { classes, auth, resizeScreen } = this.props;
    const { getUserSettings } = this.state;

    if (!auth) return null;

    return (
      <div className={classes.pageFill}>
        <Paper
          title={`${auth.givenName} ${auth.familyName}`}
          content="Your very own page. Yay"
        />
        {this.renderSettings()}
        <Grid item style={{ textAlign: 'center', marginTop: '24px' }}>
          <div>
            <Loader
              show={getUserSettings ? true : false}
              message={
                this.props.resizeScreen ? this.spinnerSmall : this.spinner
              }
              backgroundStyle={{ backgroundColor: '' }}
            >
              <Button
                size={resizeScreen ? 'small' : 'medium'}
                style={{
                  color: 'white',
                  backgroundColor: '#001f3f',
                  opacity: getUserSettings ? '0.4' : '1'
                }}
                onClick={this.submitClick}
                disabled={getUserSettings ? true : false}
              >
                Submit
              </Button>
            </Loader>
          </div>
        </Grid>
        <div style={{ height: '40px' }} />
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
