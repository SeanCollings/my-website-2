import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader-advanced';
import MiniLoader from 'react-loader-spinner';
import * as actions from '../../actions';
import { showMessage } from '../../actions/snackBarActions';

import DatePicker from '../components/DatePicker';
import ConfirmActionModal from '../modals/ConfirmActionModal';
import { MessageTypeEnum } from '../../utils/constants';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
// import Typography from '@material-ui/core/Typography';
// import TextField from '@material-ui/core/TextField';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';
// import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui//core/FormControl';
import Select from '@material-ui/core/Select';
import Avatar from '@material-ui/core/Avatar';
import MoreIcon from '@material-ui/icons/MoreVert';

const styles = theme => ({
  root: {
    maxWidth: '100%',
    width: '360px'
  },
  rootChecked: {
    color: '#001f3f',
    '&$checked': {
      color: '#001f3f'
    }
  },
  checked: {},
  textField: {
    maxWidth: '80%',
    width: '400px'
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
    marginLeft: '40px'
  }
});

const UPDATE_BOARD = 'Update Board';
const REMOVE_PLAYER = 'Remove Player';
const MARK_ABSENT = 'Mark Absent';
const updateStates = [UPDATE_BOARD, REMOVE_PLAYER, MARK_ABSENT];

class UpdatePererittoPlayer extends Component {
  state = {
    playerId: '',
    selectedDate: null,
    errorName: false,
    updatingPlayer: false,
    hideDates: true,
    showModal: false,
    updateState: UPDATE_BOARD,
    updateInt: 0
  };

  componentDidMount() {
    // this.props.getPererittoUsers();
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.snackBar.open && this.state.updatingPlayer) {
      this.setState({ updatingPlayer: false });
      this.props.getWinners();
    }

    return true;
  }

  onFormSubmit = event => {
    event.preventDefault();
  };

  handleChange = event => {
    this.setState({ playerId: event.target.value });
  };

  updatePlayerClick = () => {
    const { playerId, selectedDate, updateState } = this.state;

    if (
      playerId === '' &&
      (updateState === UPDATE_BOARD || updateState === MARK_ABSENT)
    ) {
      this.setState({ errorName: true });
      return this.props.showMessage(MessageTypeEnum.error, 'Select a name!');
    }

    if (selectedDate === null || selectedDate === '')
      return this.props.showMessage(MessageTypeEnum.error, 'Select a date!');

    switch (updateState) {
      case UPDATE_BOARD:
        this.setState({ updatingPlayer: true });
        this.props.updatePererittoUser(playerId, selectedDate);
        break;
      case REMOVE_PLAYER:
        this.setState({ ...this.state, updatingPlayer: true, showModal: true });
        break;
      case MARK_ABSENT:
        this.setState({ ...this.state, updatingPlayer: true, showModal: true });
        break;
      default:
        break;
    }
  };

  renderPlayers = () => {
    const { pererittoUsers } = this.props;
    if (pererittoUsers.length > 0) {
      return pererittoUsers
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(user => {
          if (user.retired) return null;
          return (
            <MenuItem key={user._id} value={user._id}>
              {user.name}
            </MenuItem>
          );
        });
    }

    return null;
  };

  spinner = (
    <span>
      <MiniLoader type="TailSpin" color="#FFC300" height={36} width={36} />
    </span>
  );

  spinnerSmall = (
    <span>
      <MiniLoader type="TailSpin" color="#FFC300" height={30} width={30} />
    </span>
  );

  toggleUpdateType = () => {
    const { updateInt } = this.state;

    let newUpdateInt = updateInt;
    if (updateInt !== updateStates.length - 1) newUpdateInt++;
    else newUpdateInt = 0;

    this.setState({
      ...this.state,
      updateInt: newUpdateInt,
      updateState: updateStates[newUpdateInt]
    });
  };

  render() {
    const { classes } = this.props;
    const {
      updatingPlayer,
      updateState,
      showModal,
      selectedDate,
      playerId
    } = this.state;

    return (
      <div>
        <Grid className={classes.root}>
          <Grid container direction="row" justify="center">
            <form onSubmit={this.onFormSubmit}>
              <FormControl className={classes.formControl}>
                <Select
                  value={playerId}
                  onChange={this.handleChange}
                  displayEmpty
                  disabled={updateState === REMOVE_PLAYER}
                  style={{
                    opacity: playerId === '' ? '0.5' : '1'
                  }}
                >
                  <MenuItem value="" disabled>
                    Select Player
                  </MenuItem>
                  {this.renderPlayers()}
                </Select>
              </FormControl>
            </form>
            <Avatar
              onClick={() => this.toggleUpdateType()}
              style={{
                top: '5px',
                backgroundColor: 'transparent',
                color: '#ffa07a'
              }}
            >
              <MoreIcon />
            </Avatar>
          </Grid>
          <Grid item style={{ textAlign: 'center' }}>
            <DatePicker
              preventSelection={false}
              selectedDate={date => this.setState({ selectedDate: date })}
              hideDates={
                updateState === UPDATE_BOARD || updateState === MARK_ABSENT
              }
            />
          </Grid>
          <Grid item style={{ textAlign: 'center', marginTop: '12px' }}>
            <Loader
              show={updatingPlayer ? true : false}
              message={this.spinner}
              backgroundStyle={{ backgroundColor: '' }}
            >
              <Button
                size={'medium'}
                disabled={
                  updateState === REMOVE_PLAYER && !selectedDate ? true : false
                }
                style={{
                  color: 'white',
                  backgroundColor:
                    updateState === MARK_ABSENT ? '#c70039' : '#154360',
                  opacity:
                    updatingPlayer ||
                    (updateState === REMOVE_PLAYER && !selectedDate)
                      ? '0.5'
                      : '1'
                }}
                onClick={this.updatePlayerClick}
              >
                {updateState}
              </Button>
            </Loader>
          </Grid>
        </Grid>
        <ConfirmActionModal
          showModal={showModal}
          title={'Warning!'}
          message={`Are you sure you want to ${
            updateState === REMOVE_PLAYER
              ? 'delete this date?'
              : 'mark this player as absent?'
          }`}
          confirmClick={() => {
            this.setState({ showModal: false });
            updateState === REMOVE_PLAYER &&
              this.props.removeWinnerDate(selectedDate);
            updateState === MARK_ABSENT &&
              this.props.markPlayerAbsent(playerId, selectedDate);
          }}
          cancelClick={() =>
            this.setState({
              ...this.state,
              updatingPlayer: false,
              showModal: false
            })
          }
        />
      </div>
    );
  }
}

function mapStateToProps({ auth, pererittoUsers, resizeScreen, snackBar }) {
  return {
    pererittoUsers,
    superUser: auth.superUser,
    resizeScreen,
    snackBar
  };
}

export default connect(mapStateToProps, { ...actions, showMessage })(
  withStyles(styles)(UpdatePererittoPlayer)
);
