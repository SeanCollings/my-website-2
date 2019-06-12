import React, { Component } from 'react';

import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import GroupIcon from '@material-ui/icons/SupervisorAccount';
import PersonIcon from '@material-ui/icons/Person';

class RenderGroups extends Component {
  render() {
    const { groups, auth } = this.props;

    if (!groups) return <Typography>Loading your groups...</Typography>;
    else if (groups.length === 0)
      return <Typography>You're not apart of any groups yet...</Typography>;

    groups.sort((a, b) =>
      new Date(a.createdDate) < new Date(b.createdDate) ? 1 : -1
    );

    const groupsLength = groups.length;
    return groups.map((group, index) => {
      const members = group.members.length + 1;
      const initial = group.name.charAt(0).toUpperCase();
      return (
        <div key={group._id}>
          <ListItem button onClick={() => this.props.selectGroup(group)}>
            <ListItemAvatar>
              <Avatar
                src={group.icon}
                style={{
                  backgroundColor: group.icon ? 'transparent' : '#3D9970'
                }}
              >
                {initial}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={group.name}
              secondary={`Members: ${members}`}
            />
            <ListItemSecondaryAction
              onClick={() => this.props.selectGroup(group)}
            >
              {group.createdById.toString() === auth._id.toString() ? (
                <Typography
                  style={{
                    fontSize: 'x-small',
                    marginRight: '16px',
                    color: '#3D9970'
                  }}
                >
                  Admin
                </Typography>
              ) : null}
              <ListItemIcon>
                {members > 2 ? <GroupIcon /> : <PersonIcon />}
              </ListItemIcon>
            </ListItemSecondaryAction>
          </ListItem>
          {groupsLength === index + 1 ? null : (
            <Divider variant="inset" component="li" />
          )}
        </div>
      );
    });
  }
}

export default RenderGroups;
