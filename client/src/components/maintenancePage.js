import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';

import Paper from './components/paper';
import TabContainer from './components/tabContainer';
import SnackBar from './components/SnackBar';
import AddRemovePererittoPlayer from './maintenace/AddRemovePererittoPlayer';
import UpdateUsers from './maintenace/UpdateUsers';

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
  textField: {
    width: '100%',
    maxWidth: '500px'
  }
});

class ContactsPage extends Component {
  state = { value: 0 };

  renderPereritto() {
    return <AddRemovePererittoPlayer />;
  }

  renderSnackBar() {
    const { maintenance } = this.props;

    if (maintenance && maintenance.error) {
      // this.setState({ openSnackBar: true });

      // setTimeout(() => {
      //   this.setState({ openSnackBar: false });
      // }, 4000);

      return (
        <SnackBar
          variant={'error'}
          open={this.state.openSnackBar}
          message={maintenance.error}
        />
      );
    }

    if (maintenance) {
      // console.log(maintenance);
    }

    return null;
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
        >
          <Tab label="Users" />
          <Tab label="Pereritto" />
        </Tabs>
        {value === 0 && <TabContainer>{this.renderUsers()}</TabContainer>}
        {value === 1 && <TabContainer>{this.renderPereritto()}</TabContainer>}
        {this.renderSnackBar()}
      </div>
    );
  }
}

function mapStateToProps({ maintenance }) {
  return { maintenance };
}

export default connect(
  mapStateToProps,
  actions
)(withStyles(styles)(ContactsPage));
