import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import Gravatar from 'react-gravatar';
import { getVersion } from '../../actions/appActions';

import { withStyles } from '@material-ui/core/styles';
// import Drawer from '@material-ui/core/Drawer';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
// import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Link, Typography } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';

import ListItemIcon from '@material-ui/core/ListItemIcon';
import LogoutIcon from '@material-ui/icons/ExitToApp';
import ContactIcon from '@material-ui/icons/MailOutline';
import MaintenanceIcon from '@material-ui/icons/BuildOutlined';
import ProjectsIcon from '@material-ui/icons/DescriptionOutlined';
import PererittoIcon from '@material-ui/icons/HotTubRounded';
import ProfileIcon from '@material-ui/icons/PersonOutline';
import HomeIcon from '@material-ui/icons/HomeOutlined';
import ClearIcon from '@material-ui/icons/Clear';
import VibrationIcon from '@material-ui/icons/Vibration';
import LocationIcon from '@material-ui/icons/ExploreOutlined';

let googlePic = '';

const styles = {
  list: {
    width: 250,
    color: '#581845'
  },
  fullList: {
    width: 'auto'
  },
  color: {
    backgroundColor: 'blue'
  }
};

class TemporaryDrawer extends React.Component {
  // static getDerivedStateFromProps(props, state) {
  //   return { ...state, openDrawer: props.openDrawer };
  // }
  componentDidMount() {
    if (!this.props.version) this.props.getVersion();
  }

  renderLoginLogout() {
    switch (this.props.auth) {
      case null:
        return;
      case false:
        return (
          <NavLink to="/login" style={{ textDecoration: 'none' }}>
            <ListItem button>
              <ListItemIcon>{<LogoutIcon />}</ListItemIcon>
              <ListItemText primary="Login" />
            </ListItem>
          </NavLink>
        );
      default:
        return (
          <Link href="/api/logout">
            <ListItem button>
              <ListItemIcon>
                {<LogoutIcon style={{ transform: 'rotate(180deg)' }} />}
              </ListItemIcon>
              <ListItemText primary="Log out" />
            </ListItem>
          </Link>
        );
    }
  }

  renderMenu(item) {
    if (item === 'Pereritto' && !this.props.pererittoUser) {
      return null;
    }

    if (item === 'Maintenance') {
      return null;
    }

    if (item === 'Notifications' && !this.props.auth) {
      return null;
    }

    if (item === 'Locations' && !this.props.auth) {
      return null;
    }

    return (
      <NavLink
        key={item}
        to={`/${item.toLowerCase().replace(/\s/g, '')}`}
        style={{ textDecoration: 'none' }}
      >
        <ListItem button>
          {item === 'Home' && (
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
          )}
          {item === 'About Me' && (
            <ListItemIcon>
              <ProfileIcon />
            </ListItemIcon>
          )}
          {item === 'Projects' && (
            <ListItemIcon>
              <ProjectsIcon />
            </ListItemIcon>
          )}
          {item === 'Contact' && (
            <ListItemIcon>
              <ContactIcon />
            </ListItemIcon>
          )}
          {item === 'Pereritto' && (
            <ListItemIcon>
              <PererittoIcon />
            </ListItemIcon>
          )}
          {item === 'Notifications' && (
            <ListItemIcon>
              <VibrationIcon />
            </ListItemIcon>
          )}
          {item === 'Locations' && (
            <ListItemIcon>
              <LocationIcon />
            </ListItemIcon>
          )}
          <ListItemText primary={item} />
        </ListItem>
      </NavLink>
    );
  }

  renderMaintenance() {
    if (this.props.superUser) {
      return (
        <List>
          <NavLink to="/maintenance" style={{ textDecoration: 'none' }}>
            <ListItem button>
              <ListItemIcon>
                <MaintenanceIcon />
              </ListItemIcon>
              <ListItemText primary="Maintenance" />
            </ListItem>
          </NavLink>
        </List>
      );
    }

    return null;
  }

  renderTopColor(currentRoute) {
    switch (currentRoute) {
      case '/pereritto':
        return '#C70039';
      case '/maintenance':
        return '#154360';
      default:
        return '#581845';
    }
  }

  renderTopMenu() {
    const { currentRoute } = this.props;

    // if (!auth) {
    //   return null;
    // }

    // if (auth.googlePhoto && googlePic === '') {
    //   googlePic = auth.googlePhoto;
    // }

    // const profileName = `${auth.givenName.toLowerCase()}${auth.familyName.toLowerCase()}`;

    return (
      <div
        style={{
          paddingTop: '5px',
          color: '#DEDEDE',
          backgroundColor: this.renderTopColor(currentRoute)
        }}
      >
        <div style={{ paddingBottom: '5px' }}>
          <List disablePadding={true}>
            {/* <NavLink
            to={`/profile/${profileName}`}
            style={{ textDecoration: 'none' }}
          > */}
            <ListItem
              button
              // style={{ paddingTop: '1px', paddingBottom: '1px' }}
            >
              <ListItemIcon>
                <ClearIcon style={{ color: '#DEDEDE' }} />
              </ListItemIcon>
              {/* <ListItemText
                primary={auth ? `${auth.givenName} ${auth.familyName}` : ''}
                />
              {this.renderAvatar()} */}
            </ListItem>
            {/* </NavLink> */}
          </List>
        </div>
        <Divider />
      </div>
    );
  }

  renderAvatar() {
    const { settings, auth } = this.props;

    let initials = '';
    if (auth) {
      initials =
        auth.givenName.charAt(0).toUpperCase() +
        auth.familyName.charAt(0).toUpperCase();
    }

    if (!settings) {
      return <Avatar>{initials}</Avatar>;
    }

    if (settings.profilePic === 'google') {
      return <Avatar src={auth.googlePhoto ? googlePic : ''} />;
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

  render() {
    const { classes, version, menuList, superUser, openDrawer } = this.props;

    const sideList = (
      <div className={classes.list}>
        {this.renderTopMenu()}
        <List>{menuList.map((text, index) => this.renderMenu(text))}</List>
        {superUser && <Divider />}
        {this.renderMaintenance()}
        <Divider />
        <List>{this.renderLoginLogout()}</List>
      </div>
    );

    return (
      <div>
        {/* <Drawer
          open={this.props.openDrawer}
          onClose={() => this.props.onClick(false)}
          PaperProps={{
            style: {
              backgroundColor: '#DEDEDE'
            }
          }}
        >
          <div
            tabIndex={0}
            role="button"
            onClick={() => this.props.onClick(false)}
            onKeyDown={() => this.props.onClick(false)}
          >
            {sideList}
          </div>
          <Typography
            style={{
              position: 'absolute',
              bottom: '10px',
              right: '15px',
              color: '#C7C7C7'
            }}
          >
            {`release version: ${version}`}
          </Typography>
        </Drawer> */}
        <SwipeableDrawer
          open={openDrawer}
          onClose={() => this.props.onClick(false)}
          onOpen={() => this.props.onClick(true)}
          disableBackdropTransition={true}
          disableDiscovery={false}
          minFlingVelocity={500}
          // transitionDuration={300}
          PaperProps={{
            style: {
              backgroundColor: '#DEDEDE'
            }
          }}
        >
          <div
            tabIndex={0}
            role="button"
            onClick={() => this.props.onClick(false)}
            onKeyDown={() => this.props.onClick(false)}
          >
            {sideList}
          </div>
          <Typography
            style={{
              position: 'absolute',
              bottom: '10px',
              right: '15px',
              color: '#C7C7C7'
            }}
          >
            {`release version: ${version}`}
          </Typography>
        </SwipeableDrawer>
      </div>
    );
  }
}

TemporaryDrawer.propTypes = {
  classes: PropTypes.object.isRequired
};

function mapStateToProps({ auth, settings, app }) {
  return {
    auth,
    superUser: auth !== null ? auth.superUser : null,
    settings,
    version: app.version
  };
}

export default connect(
  mapStateToProps,
  { getVersion }
)(withRouter(withStyles(styles)(TemporaryDrawer)));
