import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
// import List from '@material-ui/core/List';
// import ListItem from '@material-ui/core/ListItem';
// import ListItemAvatar from '@material-ui/core/ListItemAvatar';
// import ListItemText from '@material-ui/core/ListItemText';
// import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

const styles = theme => ({
  disabledButton: {
    opacity: '0.3'
  }
});

class UpdateUsers extends Component {
  state = { updateEnabled: false };
  componentDidMount() {
    this.props.fetchAllUsers();
  }

  updateClick = () => {
    this.setState({ updateEnabled: true });
  };

  saveClick = () => {
    console.log('SAVE CLICKED!');
  };

  renderAllUsers() {
    const { users } = this.props;
    console.log(users);
    if (users !== null && users.length > 1) {
      return users.map((user, index) => {
        const details = `${index + 1}. ${user.givenName} ${user.familyName} - ${
          user.emailAddress
        } ${user.pererittoUser ? '1' : '0'}`;
        return (
          <Grid key={index}>
            <Typography>{details}</Typography>
          </Grid>
        );
      });
    }

    return <Typography>Retrieving user list...</Typography>;
  }

  render() {
    const { classes } = this.props;

    return (
      <Grid>
        <Grid
          item
          style={{
            paddingBottom: '24px',
            textAlign: 'center'
          }}
        >
          <Button
            style={{
              color: 'white',
              backgroundColor: '#001f3f',
              marginRight: '10px',
              minWidth: '125px'
            }}
            onClick={this.updateClick}
          >
            Update
          </Button>
          <Button
            disabled={this.state.updateEnabled ? false : true}
            style={{
              marginLeft: '10px',
              color: 'white',
              backgroundColor: '#2ECC40',
              minWidth: '125px'
            }}
            classes={{ disabled: classes.disabledButton }}
            onClick={this.saveClick}
          >
            Save
          </Button>
        </Grid>
        <Grid
          item
          style={{
            textAlign: 'left',
            maxWidth: '100%',
            width: '400px',
            margin: 'auto'
          }}
        >
          {this.renderAllUsers()}
        </Grid>
      </Grid>
    );
  }
}

function mapStateToProps({ maintenance }) {
  return { users: maintenance.users };
}

export default connect(
  mapStateToProps,
  actions
)(withStyles(styles)(UpdateUsers));
