import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Loader from 'react-loader-advanced';
import MiniLoader from 'react-loader-spinner';

import { userSignUp, userLogin } from '../../actions/index';
import { showMessage } from '../../actions/snackBarActions';
import {
  MessageTypeEnum,
  MAX_PASSWORD_LENGTH,
  MAX_EMAIL_LENGTH,
  MAX_NAMES_LENGTH,
  MIN_PASSWORD_LENGTH
} from '../../utils/constants';

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
    color: '#FFC300',
    paddingLeft: '4px'
  }
});

class SignIn extends Component {
  state = {
    password: '',
    confirmPassword: '',
    emailAddress: '',
    givenName: '',
    familyName: '',
    passwordFocus: false,
    signingInUser: false
  };

  shouldComponentUpdate(nextProps) {
    if (nextProps.snackBar.open && this.state.signingInUser) {
      this.setState({ signingInUser: false });
    }

    return true;
  }

  validateName = name => {
    const regex = /^[a-z ,.'-]+$/i;
    return regex.test(String(name).toLowerCase());
  };

  validateEmail = email => {
    const regex = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(String(email).toLowerCase());
  };

  verifySignUp = () => {
    const {
      givenName,
      familyName,
      emailAddress,
      password,
      confirmPassword
    } = this.state;

    if (
      !givenName ||
      !familyName ||
      !emailAddress ||
      !password ||
      !confirmPassword
    ) {
      this.props.showMessage(MessageTypeEnum.error, 'Complete all fields');
      return false;
    } else if (!this.validateName(givenName) || !this.validateName(givenName)) {
      this.props.showMessage(
        MessageTypeEnum.error,
        'Name may not contain numeric or special characters'
      );
      return false;
    } else if (!this.validateEmail(emailAddress)) {
      this.props.showMessage(
        MessageTypeEnum.error,
        'Enter a valid email address'
      );
      return false;
    } else if (password.length < MIN_PASSWORD_LENGTH) {
      this.props.showMessage(MessageTypeEnum.error, `Password is too short`);
      return false;
    } else if (password !== confirmPassword) {
      this.props.showMessage(MessageTypeEnum.error, `Passwords do not match`);
      return false;
    }

    return true;
  };

  verifyLogin = () => {
    const { emailAddress, password } = this.state;

    if (!emailAddress || !password) {
      this.props.showMessage(MessageTypeEnum.error, 'Complete all fields');
      return false;
    } else if (!this.validateEmail(emailAddress)) {
      this.props.showMessage(
        MessageTypeEnum.error,
        'Enter a valid email address'
      );
      return false;
    }

    return true;
  };

  signInClicked = () => {
    const { signUpUser } = this.props;
    const { givenName, familyName, emailAddress, password } = this.state;

    if (signUpUser && this.verifySignUp()) {
      this.setState({ signingInUser: true });
      this.props.userSignUp(
        givenName.trim(),
        familyName.trim(),
        emailAddress.trim(),
        password.trim()
      );
    } else if (!signUpUser && this.verifyLogin()) {
      this.setState({ signingInUser: true });
      this.props.userLogin(emailAddress.trim(), password.trim());
    }
  };

  handleSubmit = event => {
    event.preventDefault();
  };

  handleFirstNameChange = event => {
    const { givenName } = this.state;
    let name = event.target.value;

    if (name.length > MAX_NAMES_LENGTH) name = givenName;
    this.setState({ givenName: name });
  };
  handleFamilyNameChange = event => {
    const { familyName } = this.state;
    let name = event.target.value;

    if (name.length > MAX_NAMES_LENGTH) name = familyName;
    this.setState({ familyName: name });
  };
  handleEmailAddressChange = event => {
    const { emailAddress } = this.state;
    let email = event.target.value;

    if (email.length > MAX_EMAIL_LENGTH) email = emailAddress;
    this.setState({ emailAddress: email });
  };
  handlePasswordChange = event => {
    const { password } = this.state;
    let passwordValue = event.target.value;

    if (passwordValue.length > MAX_PASSWORD_LENGTH) passwordValue = password;
    this.setState({ password: passwordValue });
  };
  handlePasswordFocus = event => {
    this.setState({ passwordFocus: true });
  };
  handlePasswordBlur = event => {
    this.setState({ passwordFocus: false });
  };
  handleConfirmPasswordChange = event => {
    const confirmPassword = event.target.value;
    this.setState({ confirmPassword });
  };

  spinner = (
    <span>
      <MiniLoader type="TailSpin" color="#FFC300" height={36} width={36} />
    </span>
  );

  render() {
    const { classes, signUpUser, signUpDisabled } = this.props;
    const {
      givenName,
      familyName,
      emailAddress,
      password,
      confirmPassword,
      passwordFocus,
      signingInUser
    } = this.state;

    console.log('signingInUser', this.state.signingInUser);

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
                value={givenName}
                onChange={this.handleFirstNameChange}
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
                value={familyName}
                onChange={this.handleFamilyNameChange}
                classes={{
                  underline: classes.cssUnderline,
                  input: classes.input
                }}
              />
            </FormControl>
            <FormControl
              disabled={signUpDisabled}
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
                value={emailAddress}
                onChange={this.handleEmailAddressChange}
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
              disabled={signUpDisabled}
            >
              <InputLabel
                htmlFor="password"
                classes={{
                  root: classes.cssLabel,
                  focused: classes.cssFocused
                }}
              >
                {`Password${
                  passwordFocus && password.length < MIN_PASSWORD_LENGTH
                    ? ` must be at least ${MIN_PASSWORD_LENGTH} characters`
                    : ''
                }`}
              </InputLabel>
              <Input
                name="password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                maxLength={2}
                onChange={this.handlePasswordChange}
                onFocus={this.handlePasswordFocus}
                onBlur={this.handlePasswordBlur}
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
                htmlFor="confirm-password"
                classes={{
                  root: classes.cssLabel,
                  focused: classes.cssFocused
                }}
              >
                Confirm Password
              </InputLabel>
              <Input
                name="confirm-password"
                type="password"
                id="confirm-password"
                autoComplete="none"
                value={confirmPassword}
                onChange={this.handleConfirmPasswordChange}
                classes={{
                  underline: classes.cssUnderline,
                  input: classes.input
                }}
              />
            </FormControl>
            <div style={{ marginTop: '24px' }}>
              <Loader
                show={signingInUser}
                message={this.spinner}
                backgroundStyle={{ backgroundColor: '' }}
              >
                <Button
                  disabled={signUpDisabled || signingInUser}
                  type="submit"
                  fullWidth
                  variant="contained"
                  className={classes.submit}
                  style={{
                    backgroundColor: '#FF4136',
                    color: 'white',
                    opacity: signingInUser ? '0.6' : '1'
                  }}
                  onClick={() => this.signInClicked()}
                >
                  {signUpUser ? 'Sign Up' : 'Log In'}
                </Button>
              </Loader>
            </div>
          </form>
        </Paper>
      </main>
    );
  }
}

SignIn.propTypes = {
  classes: PropTypes.object.isRequired
};

function mapStateToProps({ snackBar, auth }) {
  return { snackBar, auth };
}

export default connect(mapStateToProps, { showMessage, userSignUp, userLogin })(
  withStyles(styles)(SignIn)
);
