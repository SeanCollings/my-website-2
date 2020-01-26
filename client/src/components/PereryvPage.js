import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import {
  getSlates,
  getPereryvUsers,
  createSlate,
  updateSlate,
  getCompletedSlates
} from '../actions/pereryvActions';
import ConfirmActionModal from '../components/modals/ConfirmActionModal';
import CompletedSlates from './pereryv/CompletedSlates';
import { adjectives, nouns } from '../utils/slateNames';
import { sortByCreatedDate } from '../utils/utility';

import Paper from './components/paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import AddIcon from '@material-ui/icons/Add';
import PaidIcon from '@material-ui/icons/MonetizationOn';
import UnPaidIcon from '@material-ui/icons/AccessTime';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import ConfirmIcon from '@material-ui/icons/CheckCircle';
import UnselectedIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import SelectedIcon from '@material-ui/icons/CheckBox';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  pageFill: {
    paddingBottom: '2.5rem'
  },
  root: {
    backgroundImage: 'linear-gradient(#b5318e, #ce6db2  60%)',
    borderRadius: '24px'
  }
});

class PereryvPage extends Component {
  state = {
    showModal: false,
    showUpdateModal: false,
    addingSlate: false,
    selectedSlateName: '',
    editSlate: [],
    selectedMembers: []
  };

  componentDidMount() {
    this.props.getSlates();
    this.props.getCompletedSlates();
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.snackBar.open && this.state.addingSlate) {
      this.setState({ addingSlate: false });
      this.props.getSlates();
      this.props.getCompletedSlates();
    }

    return true;
  }

  createSlateName = () => {
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];

    return `${adjective} ${noun}`;
  };

  addSlate = () => {
    this.setState({ showModal: true });
  };

  selectPlayer = memberId => {
    const { selectedMembers } = this.state;
    const newState = [...selectedMembers];

    const index = newState.indexOf(memberId);
    if (index > -1) newState.splice(index, 1);
    else newState.push(memberId);

    this.setState({ selectedMembers: newState });
  };

  updateCurrentSlate = (slateId, slateName) => {
    const { editSlate, selectedMembers } = this.state;

    if (editSlate.includes(slateId)) {
      return (
        <Fragment>
          <ConfirmIcon
            onClick={() =>
              selectedMembers.length
                ? this.setState({ ...this.state, showUpdateModal: true })
                : null
            }
            style={{
              marginTop: '6px',
              marginBottom: '-8px',
              color: selectedMembers.length ? '#004c0d' : '#92002a',
              transform: 'scale(1.4)'
            }}
          />
          <CloseIcon
            onClick={() =>
              this.setState({
                ...this.state,
                selectedMembers: [],
                editSlate: [],
                selectedSlateName: ''
              })
            }
            style={{
              marginTop: '6px',
              marginBottom: '-8px',
              marginLeft: '12px',
              color: '#581845',
              border: '1px solid #581845',
              borderRadius: '6px'
            }}
          />
        </Fragment>
      );
    }

    return (
      <Fragment>
        <div />
        <EditIcon
          onClick={() =>
            this.setState({
              ...this.state,
              editSlate: [slateId],
              selectedSlateName: slateName,
              selectedMembers: []
            })
          }
          style={{ marginTop: '8px', marginBottom: '-8px', color: '#581845' }}
        />
      </Fragment>
    );
  };

  renderSlates = () => {
    const {
      classes,
      resizeScreen,
      auth,
      pereryv: { slates }
    } = this.props;
    const { editSlate } = this.state;

    if (!slates.length) return <Paper content={`The Slates are clean...`} />;

    return sortByCreatedDate(slates, false).map(slate => {
      if (slate.completed) return null;
      const currentSlateSelected = editSlate.includes(slate._id);

      return (
        <div
          key={slate._id}
          className={classes.root}
          style={{
            maxWidth: resizeScreen ? '280px' : '600px',
            marginTop: '8px',
            padding: '0px 12px'
          }}
        >
          {auth.superUser && (
            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="center"
            >
              {this.updateCurrentSlate(slate._id, slate.name)}
            </Grid>
          )}
          <Grid
            container
            direction="row"
            justify="flex-end"
            style={{ borderBottom: '1px solid #bfbfbf' }}
          >
            <Typography
              style={{
                color: '#dedede',
                padding: '8px',
                fontSize: 'inherit'
              }}
            >
              {slate.name}
            </Typography>
          </Grid>
          <List style={{ paddingBottom: '2px' }}>
            {slate.members.map(member => {
              const firstLetter = member.name.charAt(0).toUpperCase();

              return (
                <ListItem key={member._id} style={{ padding: '4px' }}>
                  <Avatar
                    style={{
                      backgroundColor: member.color,
                      width: '30px',
                      height: '30px',
                      border: '1px solid #58184599',
                      opacity: '0.7'
                    }}
                  >
                    {firstLetter}
                  </Avatar>
                  <ListItemText
                    disableTypography
                    primary={
                      <Typography style={{ color: '#dedede' }}>
                        {`${member.name}`}
                      </Typography>
                    }
                    style={{
                      paddingRight: '120px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      color: 'white'
                    }}
                  />
                  <ListItemSecondaryAction style={{ color: '#581845' }}>
                    {member.paid ? (
                      <PaidIcon />
                    ) : currentSlateSelected ? (
                      this.state.selectedMembers.includes(member._id) ? (
                        <SelectedIcon
                          onClick={() => this.selectPlayer(member._id)}
                        />
                      ) : (
                        <UnselectedIcon
                          onClick={() => this.selectPlayer(member._id)}
                        />
                      )
                    ) : (
                      <UnPaidIcon />
                    )}
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
          </List>
          <Typography
            style={{
              color: '#581845b3',
              paddingBottom: '4px',
              textAlign: 'center'
            }}
          >
            {`Created: ${slate.createdDate.toString().split('T')[0]}`}
          </Typography>
        </div>
      );
    });
  };

  render() {
    const {
      classes,
      auth,
      pereryv: { slates, completedSlates }
    } = this.props;
    const {
      showModal,
      showUpdateModal,
      addingSlate,
      editSlate,
      selectedSlateName,
      selectedMembers
    } = this.state;

    return (
      <div
        className={classes.pageFill}
        style={{ maxWidth: '100%', paddingBottom: '12px' }}
      >
        <Fab
          onClick={this.addSlate}
          aria-label="add"
          style={{
            color: '#dedede',
            background: '#581845',
            position: 'fixed',
            bottom: '40px',
            right: '0px',
            borderRadius: '50% 0 0 50%',
            disabled: addingSlate,
            opacity: addingSlate ? '0.6' : '1',
            display: auth.superUser ? '' : 'none',
            zIndex: '10'
          }}
        >
          <AddIcon />
        </Fab>
        <Grid container direction="column" justify="center" alignItems="center">
          <div>{this.renderSlates()}</div>
          {slates.length > 0 && (
            <div
              style={{
                padding: '0px 42px',
                borderBottom: '1px solid #dedede',
                margin: '8px'
              }}
            >
              <Paper content={`Completed Slates: ${completedSlates}`} />
            </div>
          )}
          {slates.length > 0 && <CompletedSlates slates={slates} />}
        </Grid>
        <ConfirmActionModal
          showModal={showModal}
          title={'Create a Slate?'}
          message={`Are you ready to create a new slate?`}
          confirmClick={() => {
            this.setState({
              ...this.state,
              showModal: false,
              addingSlate: true
            });
            this.props.createSlate(this.createSlateName());
          }}
          cancelClick={() =>
            this.setState({
              ...this.state,
              showModal: false
            })
          }
        />
        <ConfirmActionModal
          showModal={showUpdateModal}
          title={'Update Slate?'}
          message={`Are you sure you want to update this slate?`}
          confirmClick={() => {
            this.props.updateSlate(
              editSlate[0],
              selectedSlateName,
              selectedMembers
            );
            this.setState({
              ...this.state,
              showUpdateModal: false,
              addingSlate: true,
              selectedMembers: [],
              editSlate: [],
              selectedSlateName: ''
            });
          }}
          cancelClick={() =>
            this.setState({
              ...this.state,
              showUpdateModal: false
            })
          }
        />
      </div>
    );
  }
}

function mapStateToProps({ auth, resizeScreen, snackBar, pereryv }) {
  return { auth, resizeScreen, snackBar, pereryv };
}

export default connect(mapStateToProps, {
  getSlates,
  getPereryvUsers,
  createSlate,
  updateSlate,
  getCompletedSlates
})(withStyles(styles)(PereryvPage));
