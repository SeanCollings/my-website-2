import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';

// import Paper from './components/paper';
import TabContainer from './components/tabContainer';
import UpdatePererittos from './maintenance/UpdatePererittos';
import UpdateUsers from './maintenance/UpdateUsers';
import UpdateApp from './maintenance/UpdateApp';

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

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <div className={classes.pageFill}>
        {/* <Paper title="Maintenance" /> */}
        <Tabs
          value={value}
          onChange={this.handleChange}
          centered
          style={{ backgroundColor: '' }}
          classes={{ indicator: classes.indicator }}
        >
          <Tab label="App" style={{ minWidth: '100px' }} />
          <Tab label="Users" style={{ minWidth: '100px' }} />
          <Tab label="Pereritto" style={{ minWidth: '100px' }} />
        </Tabs>
        {value === 0 && (
          <TabContainer style={{ width: '100%', maxWidth: '900px' }}>
            <UpdateApp />
          </TabContainer>
        )}
        {value === 1 && (
          <TabContainer style={{ width: '100%', maxWidth: '900px' }}>
            <UpdateUsers />
          </TabContainer>
        )}
        {value === 2 && (
          <TabContainer style={{ width: '100%', maxWidth: '900px' }}>
            <UpdatePererittos />
          </TabContainer>
        )}
      </div>
    );
  }
}

export default connect(
  null,
  actions
)(withStyles(styles)(ContactsPage));
