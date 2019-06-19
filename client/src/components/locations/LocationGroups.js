import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getLocationGroups } from '../../actions/locationActions';

import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';

import MapIcon from '@material-ui/icons/Map';
import EditIcon from '@material-ui/icons/Create';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  list: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: 'white',
    borderRadius: '15px'
  },
  borderLeft: {
    borderLeft: 'solid 1px #e0e0e0',
    paddingLeft: '12px',
    marginLeft: '10px'
  }
});

class LocationGroups extends Component {
  componentDidMount() {
    this.props.getLocationGroups();
  }

  selectGroup = selectedGroup => {
    console.log('SelectedGroup:', selectedGroup);
  };

  editGroup = selectedGroup => {
    console.log('EditGroup:', selectedGroup);
  };

  renderGroups = () => {
    const { locations, auth, classes } = this.props;

    if (!locations.groups)
      return (
        <Typography style={{ textAlign: 'center' }}>
          Loading your groups...
        </Typography>
      );
    else if (locations.groups.length === 0)
      return (
        <Typography style={{ textAlign: 'center' }}>
          You're not apart of any groups yet...
        </Typography>
      );

    locations.groups.sort((a, b) =>
      new Date(a.createdDate) < new Date(b.createdDate) ? 1 : -1
    );

    const groupsLength = locations.groups.length;

    return locations.groups.map((group, index) => {
      const members = group.members.length + 1;
      const initial = group.name.charAt(0).toUpperCase();
      const createdByUser =
        group.createdById.toString() === auth._id.toString();

      return (
        <div key={group._id}>
          <ListItem button onClick={() => this.props.selectedGroup(group)}>
            <ListItemAvatar>
              <Avatar
                src={group.icon}
                style={{
                  backgroundColor: group.icon ? 'transparent' : '#900C3F'
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
              onClick={() => this.props.editGroup(group)}
              className={createdByUser ? classes.borderLeft : null}
            >
              {createdByUser ? (
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
                {createdByUser ? <EditIcon /> : <MapIcon />}
              </ListItemIcon>
            </ListItemSecondaryAction>
          </ListItem>
          {groupsLength === index + 1 ? null : (
            <Divider variant="inset" component="li" />
          )}
        </div>
      );
    });
  };

  render() {
    const { classes } = this.props;

    return <List className={classes.list}>{this.renderGroups()}</List>;
  }
}

function mapStateToProps({ resizeScreen, locations, auth }) {
  return { resizeScreen, locations, auth };
}

export default connect(
  mapStateToProps,
  { getLocationGroups }
)(withStyles(styles)(LocationGroups));
