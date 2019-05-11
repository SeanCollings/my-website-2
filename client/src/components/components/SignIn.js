import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
// import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
// import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import Link from '@material-ui/core/Link';

import GoogleImage from '../../images/google.png';

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  paper: {
    // marginTop: theme.spacing.unit * 2,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`,
    backgroundColor: 'transparent'
  },
  avatar: {
    margin: theme.spacing.unit,
    // backgroundColor: theme.palette.secondary.main
    backgroundColor: '#FF4136'
  },
  googleAvatar: {
    margin: 10
  },
  form: {
    width: '100%' // Fix IE 11 issue.
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
    backgroundColor: '#FF4136',
    color: 'white'
  },
  colorDark: {
    color: '#424242'
  },
  colorLight: {
    color: '#DEDEDE'
  },
  colorRed: {
    color: '#FF4136'
  },
  cssLabel: {
    color: '#DEDEDE',
    '&$cssFocused': {
      color: '#FF4136'
    }
  },
  cssFocused: {},
  cssUnderline: {
    borderBottomColor: '#DEDEDE',
    '&:after': {
      borderBottomColor: '#FF4136'
    }
  },
  hideSignUpContent: {
    display: 'none'
  },
  input: {
    color: '#FFC300'
  }
});

class SignIn extends Component {
  state = {
    password: '',
    confirmPassword: ''
  };

  signInClicked = () => {
    console.log('Sign In Clicked');
    console.log(this);
  };

  handleSubmit = event => {
    event.preventDefault();

    // this.props.signinUser({ username, password });
    if (this.props.signUpUser) {
    }
  };

  render() {
    const { classes, signUpUser } = this.props;

    return (
      <main className={classes.main}>
        <Paper className={classes.paper} elevation={0}>
          {/* <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar> */}
          <Typography
            component="h1"
            variant="h5"
            style={{ marginBottom: '20px', color: '#DEDEDE' }}
          >
            {signUpUser ? 'Sign Up' : 'Log In'}
          </Typography>
          <Link
            href="/auth/google"
            style={{ width: '100%', textDecoration: 'none' }}
          >
            <Button
              fullWidth
              variant="contained"
              style={{
                backgroundColor: 'white',
                height: '50px'
              }}
              // onClick={() => this.googleClicked()}
            >
              <Avatar
                alt="Google Login"
                src={GoogleImage}
                // className={classes.googleAvatar}
              />
              Continue with Google
            </Button>
          </Link>
          <form className={classes.form} onSubmit={this.handleSubmit}>
            <FormControl
              margin="normal"
              required={signUpUser ? true : false}
              fullWidth
              className={signUpUser ? '' : classes.hideSignUpContent}
            >
              <InputLabel
                htmlFor="name"
                classes={{
                  root: classes.cssLabel,
                  focused: classes.cssFocused
                }}
              >
                First Name
              </InputLabel>
              <Input
                id="firstName"
                name="firstName"
                classes={{
                  underline: classes.cssUnderline,
                  input: classes.input
                }}
              />
            </FormControl>
            <FormControl
              margin="normal"
              required={signUpUser ? true : false}
              fullWidth
              className={signUpUser ? '' : classes.hideSignUpContent}
            >
              <InputLabel
                htmlFor="name"
                classes={{
                  root: classes.cssLabel,
                  focused: classes.cssFocused
                }}
              >
                Last Name
              </InputLabel>
              <Input
                id="lastName"
                name="lastName"
                classes={{
                  underline: classes.cssUnderline,
                  input: classes.input
                }}
              />
            </FormControl>
            <FormControl
              margin="normal"
              required
              fullWidth
              style={{ color: 'blue' }}
            >
              <InputLabel
                htmlFor="email"
                classes={{
                  root: classes.cssLabel,
                  focused: classes.cssFocused
                }}
              >
                Email Address
              </InputLabel>
              <Input
                id="email"
                name="email"
                autoComplete="email"
                classes={{
                  underline: classes.cssUnderline,
                  input: classes.input
                }}
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel
                htmlFor="password"
                classes={{
                  root: classes.cssLabel,
                  focused: classes.cssFocused
                }}
                In
              >
                Password
              </InputLabel>
              <Input
                name="password"
                type="password"
                id="password"
                autoComplete="current-password"
                classes={{
                  underline: classes.cssUnderline,
                  input: classes.input
                }}
              />
            </FormControl>
            {/* <FormControlLabel
              style={{
                visibility: signUpUser ? 'hidden' : 'visible'
              }}
              control={
                <Checkbox
                  value="remember"
                  color="primary"
                  style={{
                    color: '#FF4136'
                  }}
                />
              }
              label="Remember me"
            /> */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              className={classes.submit}
              // onClick={() => this.signInClicked()}
            >
              {signUpUser ? 'Sign Up' : 'Log In'}
            </Button>
          </form>
        </Paper>
      </main>
    );
  }
}

SignIn.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SignIn);
