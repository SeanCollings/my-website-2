import React, { Component } from 'react';

import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import CancelIcon from '@material-ui/icons/Cancel';
import IconButton from '@material-ui/core/IconButton';
import AddPersonIcon from '@material-ui/icons/PersonAdd';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  textField: {
    width: 200
  }
});

class UserListNonSuper extends Component {
  state = {
    errorEmailAddress: false,
    emailAddress: '',
    newGroupMembers: []
  };

  componentDidMount() {
    const { userList } = this.props;

    if (userList) this.setState({ newGroupMembers: userList });
  }

  handleEmailChange = event => {
    const error = event.target.value === 0;

    this.setState({
      ...this.state,
      emailAddress: event.target.value,
      errorEmailAddress: error
    });
  };

  addEmailAddress = () => {
    const { emailAddress, newGroupMembers } = this.state;
    if (emailAddress.length === 0) {
      this.setState({ errorEmailAddress: true });
    } else {
      if (!newGroupMembers.includes(emailAddress.toLowerCase())) {
        const newUserList = [...newGroupMembers, emailAddress.toLowerCase()];

        this.setState({
          ...this.state,
          emailAddress: '',
          errorEmailAddress: false,
          newGroupMembers: newUserList
        });

        this.props.setUserList(newUserList);
      } else {
        this.setState({ emailAddress: '' });
      }
    }
  };

  removeEmailAddress = emailAddress => {
    const { newGroupMembers } = this.state;
    const newUserList = newGroupMembers.filter(x => x !== emailAddress);

    this.setState({
      newGroupMembers: newGroupMembers.filter(x => x !== emailAddress)
    });

    this.props.setUserList(newUserList);
  };

  render() {
    const { classes, selectedGroup, avatarColor } = this.props;
    const { errorEmailAddress, emailAddress, newGroupMembers } = this.state;

    return (
      <div style={{ paddingBottom: '8px' }}>
        {selectedGroup ? (
          <Typography
            style={{
              paddingLeft: '8px',
              paddingRight: '8px'
            }}
          >
            You can only update the Group Name and Icon for now. Some more of
            that sweet, sweet func will be sprinkled in this area shortly...
          </Typography>
        ) : (
          <div>
            <Typography
              style={{
                marginBottom: '-8px',
                paddingLeft: '8px',
                paddingRight: '8px'
              }}
            >
              Enter a valid email address to add a new member to this group:
            </Typography>
            <TextField
              id="email"
              className={classes.textField}
              margin="normal"
              label="Email Address"
              error={errorEmailAddress}
              value={emailAddress}
              onChange={event => this.handleEmailChange(event)}
              onKeyDown={e =>
                e.keyCode === 13 ? this.addEmailAddress() : null
              }
            />
            <AddPersonIcon
              style={{
                position: 'absolute',
                marginTop: '36px',
                opacity: emailAddress.length > 0 ? '1' : '0.2'
              }}
              onClick={() =>
                emailAddress.length > 0 ? this.addEmailAddress() : null
              }
            />
            <List style={{ paddingLeft: '12px' }}>
              {newGroupMembers.length === 0 ? (
                <ListItem>
                  <ListItemText
                    style={{
                      fontSize: 'small',
                      textAlign: 'center',
                      fontStyle: 'italic'
                    }}
                    primary="No email address(s) added..."
                  />
                </ListItem>
              ) : (
                newGroupMembers.map((member, index) => {
                  const initial = member.charAt(0).toUpperCase();
                  return (
                    <ListItem
                      key={index}
                      style={{ paddingTop: '8px', paddingBottom: '8px' }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          style={{
                            width: '30px',
                            height: '30px',
                            backgroundColor: avatarColor
                          }}
                        >
                          {initial}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={member}
                        style={{ overflow: 'scroll', marginRight: '20px' }}
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          style={{ background: 'white' }}
                          onClick={() => this.removeEmailAddress(member)}
                        >
                          <CancelIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  );
                })
              )}
            </List>
          </div>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(UserListNonSuper);
