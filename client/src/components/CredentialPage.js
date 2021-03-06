import React, { Component } from 'react';

import SignIn from './components/SignIn';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  pageFill: {
    // paddingBottom: '2.5rem',
  }
});

const SIGN_UP_DISABLED = false;

class CredentialPage extends Component {
  state = {
    signUpUser: false
  };

  signUpUser = () => {
    this.setState({
      signUpUser: !this.state.signUpUser
    });
  };

  render() {
    const { classes } = this.props;
    const { signUpUser } = this.state;

    return (
      <div className={classes.pageFill}>
        <SignIn signUpUser={signUpUser} signUpDisabled={SIGN_UP_DISABLED} />
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justify="center"
          style={{
            minHeight: '10vh',
            opacity: SIGN_UP_DISABLED ? '0.4' : '1'
          }}
        >
          <Typography
            style={{
              color: '#DEDEDE'
            }}
          >
            {signUpUser ? 'Got an account already?' : "Don't have an account?"}
          </Typography>
          <Button
            disabled={SIGN_UP_DISABLED}
            style={{
              alignItems: 'center',
              // color: '#FFC300',
              color: '#FFC300',
              marginBottom: signUpUser ? '60px' : ''
            }}
            onClick={() => this.signUpUser()}
          >
            {signUpUser ? 'Log In instead' : 'Sign up instead'}
          </Button>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(CredentialPage);
