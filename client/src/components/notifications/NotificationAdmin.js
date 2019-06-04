import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  pageFill: {
    paddingBottom: '2.5rem',
    maxWidth: '100%'
  }
});

class NotificationAdmin extends Component {
  componentDidMount() {
    const { notifications } = this.props;
    if (!notifications.notifications) this.props.getNotificationGroups();
  }

  render() {
    const { notifications } = this.props;

    if (notifications.groups) console.log('Groups:', notifications.groups);

    return <div style={{ paddingTop: ' 24px' }}>Notification Admin</div>;
  }
}

function mapStateToProps({ resizeScreen, notifications }) {
  return {
    resizeScreen,
    notifications
  };
}

export default connect(
  mapStateToProps,
  actions
)(withStyles(styles)(NotificationAdmin));
