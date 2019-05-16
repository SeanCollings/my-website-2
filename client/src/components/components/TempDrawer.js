import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import Gravatar from 'react-gravatar';

import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
// import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Link } from '@material-ui/core';
// import Avatar from '@material-ui/core/Avatar';

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

  renderLoginLogout() {
    switch (this.props.auth) {
      case null:
        return;
      case false:
        return (
          <NavLink to="/login" style={{ textDecoration: 'none' }}>
            <ListItem button>
              <ListItemText primary="Login" />
            </ListItem>
          </NavLink>
        );
      default:
        return (
          <Link href="/api/logout">
            <ListItem button>
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

    return (
      <NavLink
        key={item}
        to={`/${item.toLowerCase()}`}
        style={{ textDecoration: 'none' }}
      >
        <ListItem button>
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
              <ListItemText primary="Maintenance" />
            </ListItem>
          </NavLink>
        </List>
      );
    }

    return null;
  }

  renderUserMenu() {
    const { auth } = this.props;

    // let initials = '';
    // if (auth) {
    //   initials =
    //     auth.givenName.charAt(0).toUpperCase() +
    //     auth.familyName.charAt(0).toUpperCase();
    // }

    return (
      <div>
        <List style={{ paddingTop: '6px', paddingBottom: '6px' }}>
          <NavLink to="/profile" style={{ textDecoration: 'none' }}>
            <ListItem
              button
              style={{ paddingTop: '1px', paddingBottom: '1px' }}
            >
              {/* <Avatar>{initials}</Avatar> */}
              <Gravatar
                email={auth ? auth.emailAddress : ''}
                size={40}
                style={{ borderRadius: '50%' }}
                protocol="https://"
                default="mp"
              />
              <ListItemText
                primary={auth ? `${auth.givenName} ${auth.familyName}` : ''}
              />
            </ListItem>
          </NavLink>
        </List>
        <Divider />
      </div>
    );
  }

  render() {
    const { classes } = this.props;

    const sideList = (
      <div className={classes.list}>
        {this.renderUserMenu()}
        <List>
          {this.props.menuList.map((text, index) => this.renderMenu(text))}
        </List>
        {this.props.superUser && <Divider />}
        {this.renderMaintenance()}
        <Divider />
        <List>{this.renderLoginLogout()}</List>
      </div>
    );

    return (
      <div>
        <Drawer
          open={this.props.openDrawer}
          onClose={() => this.props.onClick(false)}
          PaperProps={{
            style: { backgroundColor: '#DEDEDE' }
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
        </Drawer>
      </div>
    );
  }
}

TemporaryDrawer.propTypes = {
  classes: PropTypes.object.isRequired
};

function mapStateToProps({ auth }) {
  return { auth, superUser: auth !== null ? auth.superUser : null };
}

export default connect(mapStateToProps)(
  withRouter(withStyles(styles)(TemporaryDrawer))
);
