import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
// import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Link } from '@material-ui/core';

const styles = {
  list: {
    width: 250
  },
  fullList: {
    width: 'auto'
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
          <ListItem button>
            <NavLink to="/login" style={{ textDecoration: 'none' }}>
              <ListItemText primary="Login" />
            </NavLink>
          </ListItem>
        );
      default:
        return (
          <ListItem button>
            <Link href="/api/logout">
              <ListItemText primary="Log out" />
            </Link>
          </ListItem>
        );
    }
  }

  renderMenu(item) {
    if (item === 'Pereritto' && !this.props.pererittoUser) {
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

  render() {
    const { classes } = this.props;

    const sideList = (
      <div className={classes.list}>
        <List>
          {this.props.menuList.map((text, index) => this.renderMenu(text))}
        </List>
        <Divider />
        <List>{this.renderLoginLogout()}</List>
      </div>
    );

    return (
      <div>
        <Drawer
          open={this.props.openDrawer}
          onClose={() => this.props.onClick(false)}
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
  return { auth };
}

export default connect(mapStateToProps)(
  withRouter(withStyles(styles)(TemporaryDrawer))
);
