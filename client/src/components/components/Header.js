import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import Gravatar from 'react-gravatar';

import { MENU_LIST } from '../../utils/constants';

// import Avatar from './avatar';
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
// import VertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Avatar from '@material-ui/core/Avatar';
// import Drawer from '@material-ui/core/Drawer';
// import IconButton from '@material-ui/core/IconButton';
// import MenuIcon from '@material-ui/icons/Menu';

let googlePic = '';

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
  state = { openDrawer: false, anchorEl: null };

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
            this.handleClick(item.toLowerCase().replace(/\s/g, ''), e);
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

  toggleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  renderDropDownMenu = () => {
    const { auth } = this.props;

    if (!auth) {
      return null;
    }

    if (auth.googlePhoto && googlePic === '') {
      googlePic = auth.googlePhoto;
    }

    const profileName = `${auth.givenName.toLowerCase()}${auth.familyName.toLowerCase()}`;

    return (
      <div>
        <NavLink
          to={`/profile/${profileName}`}
          style={{ textDecoration: 'none' }}
        >
          <MenuItem onClick={this.handleClose}>
            <Typography noWrap>
              {auth ? `${auth.givenName} ${auth.familyName}` : 'Profile'}
            </Typography>
          </MenuItem>
        </NavLink>
        <NavLink to="/settings" style={{ textDecoration: 'none' }}>
          <MenuItem onClick={this.handleClose}>
            <Typography noWrap>Settings</Typography>
          </MenuItem>
        </NavLink>
      </div>
    );
  };

  renderAvatar() {
    const { settings, auth } = this.props;
    let initials = '';

    if (auth === null) return null;

    if (auth) {
      initials =
        auth.givenName.charAt(0).toUpperCase() +
        auth.familyName.charAt(0).toUpperCase();
    }

    // console.log(auth.googlePhoto, 'inbetween', googlePic);
    if (settings === null) {
      // console.log('test');
      return <Avatar>{initials}</Avatar>;
    }

    if (settings.profilePic === 'google') {
      return <Avatar src={auth.googlePhoto ? auth.googlePhoto : ''} />;
    } else if (settings.profilePic === 'gravatar') {
      return (
        <Gravatar
          email={auth ? auth.emailAddress : ''}
          size={40}
          style={{ borderRadius: '50%' }}
          protocol="https://"
          default={'mp'}
        />
      );
    } else {
      return <Avatar>{initials}</Avatar>;
    }
  }

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

  renderHeading(currentRoute) {
    const { auth } = this.props;

    switch (currentRoute) {
      case '/home':
        return 'Home';
      case '/aboutme':
        return 'About Me';
      case '/projects':
        return 'Projects';
      case '/contact':
        return 'Contact Me';
      case '/pereritto':
        return 'Pereritto Winners';
      case '/maintenance':
        return 'Maintenance';
      case '/settings':
        return 'Settings';
      default:
        if (currentRoute.includes('profile') && auth)
          return `${auth.givenName} ${auth.familyName}`;

        return '';
    }
  }

  renderColor(currentRoute) {
    switch (currentRoute) {
      case '/pereritto':
        return '#C70039';
      case '/maintenance':
        return '#154360';
      default:
        return '#581845';
    }
  }

  render() {
    const { classes, currentRoute } = this.props;
    // const pointer = { cursor: 'pointer' };
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);

    return (
      <div className={classes.root} ref={this.myDiv}>
        <AppBar
          position="fixed"
          elevation={1}
          style={{
            background: this.renderColor(currentRoute),
            // background: '#581845',
            //   this.props.auth !== null && location.pathname === '/pereritto'
            //     ? '#FF4136'
            //     : 'transparent',
            // // : '#424242',
            // backgroundImage:
            //   'linear-gradient(155deg, #581845, #900C3F, #FF5733)',
            height: this.props.resizeScreen ? '56px' : '64px'
          }}
        >
          <Toolbar>
            <IconButton
              aria-label="More"
              aria-haspopup="true"
              onClick={() => this.toggleDrawer(true)}
              style={{ color: '#DEDEDE' }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h5"
              color="inherit"
              className={classes.grow}
              // align="center"
              noWrap={true}
              style={{
                display: 'inline-block',
                color: '#DEDEDE',
                paddingLeft: '16px'
              }}
            >
              {/* <Link
                color="inherit"
                underline="none"
                style={pointer}
                onClick={e => {
                  this.handleClick('home', e);
                }}
              >
                Home
              </Link> */}
              {this.renderHeading(currentRoute)}
            </Typography>

            {/* <Typography style={{ display: 'inline-block' }} component={'span'}>
              <Link
                style={pointer}
                onClick={e => {
                  this.handleClick('aboutme', e);
                }}
              >
                <Avatar className={classes.grow} />
              </Link>
            </Typography> */}
            {/* {this.props.resizeScreen ? ( */}
            {this.props.resizeScreen ? '' : this.renderMenuItems()}
            {this.props.resizeScreen ? '' : this.renderLoginLogout()}
            <IconButton
              aria-label="More"
              aria-haspopup="true"
              onClick={this.toggleMenu}
              style={{ color: '#DEDEDE' }}
            >
              {/* <VertIcon /> */}
              {this.renderAvatar()}
            </IconButton>
            <Menu
              id="user-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={this.handleClose}
              disableAutoFocusItem
              elevation={1}
              PaperProps={{
                style: {
                  backgroundColor: '#DEDEDE',
                  width: 220,
                  square: true
                }
              }}
              style={{ paddingTop: '20px' }}
            >
              {this.renderDropDownMenu()}
            </Menu>
            {/* ) : (
              this.renderMenuItems()
            )} */}
          </Toolbar>
        </AppBar>
        <TempDrawer
          openDrawer={this.state.openDrawer}
          onClick={this.toggleDrawer}
          menuList={MENU_LIST}
          pererittoUser={this.props.pererittoUser}
          currentRoute={currentRoute}
        />
      </div>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired
};

function mapStateToProps({ auth, resizeScreen, settings }) {
  return { auth, resizeScreen, settings };
}

export default connect(mapStateToProps)(withRouter(withStyles(styles)(Header)));
