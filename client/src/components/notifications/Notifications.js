import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';

import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  pageFill: {
    paddingBottom: '2.5rem',
    maxWidth: '100%'
    // backgroundColor: '#FF4136'
  }
});

class Notifications extends Component {
  sendSplash = event => {
    event.preventDefault();
    this.props.testNotification();
  };

  render() {
    return (
      <div style={{ paddingTop: ' 24px' }}>
        <Button
          onClick={event => this.sendSplash(event)}
          style={{
            backgroundColor: '#0074D9',
            color: 'white',
            width: '30%'
          }}
        >
          Send Splash
        </Button>
      </div>
    );
  }
}

function mapStateToProps({ resizeScreen }) {
  return {
    resizeScreen
  };
}

export default connect(
  mapStateToProps,
  actions
)(withStyles(styles)(Notifications));
