import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { MENU_LIST } from '../../utils/constants';

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
  background: 'rgba(26,26,26,.95)'
};

class Header extends Component {
  state = { openDrawer: false };

  renderMenuItems() {
    return MENU_LIST.map(item => {
      if (item === 'Login') {
        return this.renderLoginLogout();
      }

      if (item === 'Pereritto' && !this.props.pererittoUser) {
        return null;
      } else if (item === 'Maintenance' && !this.props.superUser) {
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
            height: this.props.resizeScreen ? '56px' : '64px'
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
            {this.props.resizeScreen ? (
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
            {this.props.resizeScreen ? '' : this.renderLoginLogout()}
          </Toolbar>
        </AppBar>
        <TempDrawer
          openDrawer={this.state.openDrawer}
          onClick={this.toggleDrawer}
          menuList={MENU_LIST}
          pererittoUser={this.props.pererittoUser}
        />
      </div>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired
};

function mapStateToProps({ auth, resizeScreen }) {
  return { auth, resizeScreen };
}

export default connect(mapStateToProps)(withRouter(withStyles(styles)(Header)));
