import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';

import Paper from './components/paper';
import TabContainer from './components/tabContainer';
import AddRemovePererittoPlayer from './maintenance/AddRemovePererittoPlayer';
import UpdateUsers from './maintenance/UpdateUsers';

import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
// import Button from '@material-ui/core/Button';
// import Grid from '@material-ui/core/Grid';
// import TextField from '@material-ui/core/TextField';
// import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  pageFill: {
    paddingBottom: '2.5rem'
  },
  indicator: {
    backgroundColor: '#154360'
  }
});

class ContactsPage extends Component {
  state = { value: 0 };

  renderPereritto() {
    return <AddRemovePererittoPlayer />;
  }

  renderUsers() {
    return <UpdateUsers />;
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <div className={classes.pageFill}>
        <Paper title="Maintenance" />
        <Tabs
          value={value}
          onChange={this.handleChange}
          centered
          style={{ backgroundColor: '' }}
          classes={{ indicator: classes.indicator }}
        >
          <Tab label="Users" style={{ minWidth: '100px' }} />
          <Tab label="Pereritto" style={{ minWidth: '100px' }} />
        </Tabs>
        <div style={{ paddingTop: '24px' }}>
          {value === 0 && (
            <TabContainer style={{ width: '100%' }}>
              {this.renderUsers()}
            </TabContainer>
          )}
        </div>
        {value === 1 && (
          <TabContainer padding={'24px'}>{this.renderPereritto()}</TabContainer>
        )}
      </div>
    );
  }
}

export default connect(
  null,
  actions
)(withStyles(styles)(ContactsPage));
