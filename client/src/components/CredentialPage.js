import React, { Component } from 'react';

import Header from './components/Header';
import SignIn from './components/SignIn';
import Footer from './components/footer';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  pageFill: {
    minHeight: '98vh',
    position: 'relative'
  }
});

class CredentialPage extends Component {
  state = { signUpUser: false };

  signUpUser = () => {
    this.setState({ signUpUser: !this.state.signUpUser });
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.pageFill}>
        <Header />
        <SignIn signUpUser={this.state.signUpUser} />
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justify="center"
          style={{
            minHeight: '10vh'
          }}
        >
          <Typography style={{ marginTop: '10px' }}>
            {this.state.signUpUser ? 'Got an account already?' : 'Don\'t have an account?'}
          </Typography>
          <Button style={{ alignItems: 'center', color: '#FF4136' }}
            onClick={() => this.signUpUser()}
          >
            {this.state.signUpUser ? 'Login instead' : 'Sign up instead'}
          </Button>
        </Grid>
        <Footer />
      </div>
    );
  }
}

export default withStyles(styles)(CredentialPage);
