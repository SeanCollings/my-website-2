import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
// import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';

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
    marginTop: theme.spacing.unit * 2,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`
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
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit
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
    '&$cssFocused': {
      color: '#FF4136'
    }
  },
  cssFocused: {},
  cssUnderline: {
    '&:after': {
      borderBottomColor: '#FF4136'
    }
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

  googleClicked = () => {
    console.log('Google has been clicked!');
  };

  handleSubmit = event => {
    event.preventDefault();

    // console.log(event);
    // this.props.signinUser({ username, password });
    if (this.props.signUpUser) {
      const { password, confirmPassword } = this.state;

      if (password !== confirmPassword) {
        console.log('Password no Match!');
      } else {
        // make API call
        console.log("It's a match!");
      }
    }
  };

  render() {
    const { classes, signUpUser } = this.props;

    return (
      <main className={classes.main}>
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography
            component="h1"
            variant="h5"
            style={{ marginBottom: '5px' }}
          >
            {signUpUser ? 'Sign Up' : 'Log In'}
          </Typography>
          <Button
            fullWidth
            variant="contained"
            style={{
              backgroundColor: 'white',
              height: '50px'
            }}
            onClick={() => this.googleClicked()}
          >
            <Avatar
              alt="Google Login"
              src={GoogleImage}
              // className={classes.googleAvatar}
            />
            Continue with Google
          </Button>
          <form className={classes.form} onSubmit={this.handleSubmit}>
            <FormControl margin="normal" required fullWidth>
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
                autoFocus
                classes={{
                  underline: classes.cssUnderline
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
              >
                Password
              </InputLabel>
              <Input
                name="password"
                type="password"
                id="password"
                autoComplete="current-password"
                classes={{
                  underline: classes.cssUnderline
                }}
              />
            </FormControl>
            <FormControl
              margin="normal"
              fullWidth
              required={signUpUser ? true : false}
              style={{
                visibility: signUpUser ? 'visible' : 'hidden',
                height: '0px'
              }}
            >
              <InputLabel
                htmlFor="password"
                classes={{
                  root: classes.cssLabel,
                  focused: classes.cssFocused
                }}
              >
                Confirm Password
              </InputLabel>
              <Input
                name="confirmPassword"
                type="password"
                id="confirmPassword"
                classes={{
                  underline: classes.cssUnderline
                }}
              />
            </FormControl>
            <FormControlLabel
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
            />
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
