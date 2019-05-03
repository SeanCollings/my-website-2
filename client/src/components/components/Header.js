import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

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
  // menuButton: {
  //   marginLeft: -12,
  //   marginRight: 20
  // },
  background: 'rgba(26,26,26,.95)'
};

const menuList = ['Profile', 'Projects', 'Contact', 'Login'];

class Header extends React.Component {
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

  render() {
    const { classes } = this.props;
    const pointer = { cursor: 'pointer' };

    return (
      <div className={classes.root} ref={this.myDiv}>
        <AppBar
          position="sticky"
          elevation={0}
          style={{
            background: '#424242',
            height: this.mobileWidth() ? '56px' : '64px'
          }}
        >
          <Toolbar>
            {/* <IconButton
            className={classes.menuButton}
            color="inherit"
            aria-label="Menu"
          >
            <MenuIcon />
          </IconButton> */}
            {/* <Typography variant="h6" color="inherit" className={classes.grow}>
            <Link
              className="nav-link"
              to="/"
              style={{ textDecoration: 'none' }}
            >
              Home
            </Link>
          </Typography> */}
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
              // <LongMenu options={menuList} />
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
          </Toolbar>
        </AppBar>
        <TempDrawer
          openDrawer={this.state.openDrawer}
          onClick={this.toggleDrawer}
          menuList={menuList}
        />
      </div>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withRouter(withStyles(styles)(Header));
