import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import Avatar from './avatar';
// import LongMenu from './LongMenu';
import TempDrawer from './TempDrawer';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
// import Drawer from '@material-ui/core/Drawer';
// import IconButton from '@material-ui/core/IconButton';
// import MenuIcon from '@material-ui/icons/Menu';

const styles = {
  root: {
    flexGrow: 1
  },
  grow: {
    flexGrow: 1
  },
  headerHeight: {
    marginTop: '100px'
  },
  background: 'rgba(26,26,26,.95)'
};

const menuList = ['Profile', 'Projects', 'Contact', 'Pereritto'];

class Header extends Component {
  state = { mobileWidth: false, openDrawer: false };
  updateDimensions = this.updateDimensions.bind(this);
  myDiv = React.createRef();

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener('resize', this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  updateDimensions() {
    if (window.innerWidth < 520) {
      this.setState({ mobileWidth: true });
    } else {
      this.setState({ mobileWidth: false });
    }
  }

  mobileWidth() {
    return this.state.mobileWidth;
  }

  renderMenuItems() {
    return menuList.map(item => {
      if (item === 'Login') {
        return this.renderLoginLogout();
      }

      if (item === 'Pereritto' && !this.props.pererittoUser) {
        return null;
      }

      return (
        <Button
          key={item}
          style={{ color: '#DEDEDE' }}
          onClick={e => {
            this.handleClick(item.toLowerCase(), e);
          }}
        >
          {item}
        </Button>
      );
    });
  }

  handleClick(option, e) {
    e.preventDefault();
    this.props.history.push(`/${option}`);
  }

  toggleDrawer = open => {
    this.setState({ openDrawer: open });
  };

  renderLoginLogout() {
    switch (this.props.auth) {
      case null:
        return;
      // (
      //   <Button key={'login'} style={{ color: '#DEDEDE' }}>
      //     {''}
      //   </Button>
      // );
      case false:
        return (
          <Button
            key={'login'}
            style={{ color: '#DEDEDE' }}
            onClick={e => {
              this.handleClick('login', e);
            }}
          >
            Login
          </Button>
        );
      default:
        return (
          <Button key={'login'} style={{ color: '#DEDEDE' }}>
            <Link
              color="inherit"
              underline="none"
              href="/api/logout"
              style={{ cursor: 'pointer' }}
            >
              Log out
            </Link>
          </Button>
        );
    }
  }

  render() {
    const { classes } = this.props;
    const pointer = { cursor: 'pointer' };

    return (
      <div className={classes.root} ref={this.myDiv}>
        <AppBar
          position="sticky"
          elevation={0}
          style={{
            background: 'transparent',
            //   this.props.auth !== null && location.pathname === '/pereritto'
            //     ? '#FF4136'
            //     : 'transparent',
            // // : '#424242',
            height: this.mobileWidth() ? '56px' : '64px'
          }}
        >
          <Toolbar>
            <Typography style={{ display: 'inline-block' }} component={'span'}>
              <Link
                style={pointer}
                onClick={e => {
                  this.handleClick('profile', e);
                }}
              >
                <Avatar className={classes.grow} />
              </Link>
            </Typography>
            <Typography
              variant="h6"
              color="inherit"
              className={classes.grow}
              style={{ display: 'inline-block', color: '#DEDEDE' }}
            >
              <Link
                color="inherit"
                underline="none"
                style={pointer}
                onClick={e => {
                  this.handleClick('home', e);
                }}
              >
                Home
              </Link>
            </Typography>
            {this.mobileWidth() ? (
              <IconButton
                aria-label="More"
                aria-haspopup="true"
                onClick={() => this.toggleDrawer(true)}
                style={{ color: '#DEDEDE' }}
              >
                <MenuIcon />
              </IconButton>
            ) : (
              this.renderMenuItems()
            )}
            {this.mobileWidth() ? '' : this.renderLoginLogout()}
          </Toolbar>
        </AppBar>
        <TempDrawer
          openDrawer={this.state.openDrawer}
          onClick={this.toggleDrawer}
          menuList={menuList}
          pererittoUser={this.props.pererittoUser}
        />
      </div>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired
};

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps)(withRouter(withStyles(styles)(Header)));
