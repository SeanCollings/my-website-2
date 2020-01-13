import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader-advanced';
import MiniLoader from 'react-loader-spinner';
import * as actions from '../../actions';
import { showMessage } from '../../actions/snackBarActions';

import DatePicker from '../components/DatePicker';
import ConfirmActionModal from '../modals/ConfirmActionModal';
import { MessageTypeEnum, FIRST, LAST } from '../../utils/constants';

import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@material-ui/core';
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
import UnselectedIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import SelectedIcon from '@material-ui/icons/CheckBox';

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
const CUSTOM_AWARD = 'Custom Award';
const updateStates = [UPDATE_BOARD, REMOVE_PLAYER];

class UpdatePererittoPlayer extends Component {
  state = {
    playerId: '',
    selectedDate: null,
    errorName: false,
    updatingPlayer: false,
    hideDates: true,
    showModal: false,
    updateState: UPDATE_BOARD,
    updateInt: 0,
    presentPlayers: [],
    presentUpdated: false,
    choseFirstAndWon: false,
    choseLastAndWon: false
  };

  componentDidMount() {
    // this.props.getPererittoUsers();
  }

  componentDidUpdate({ pererittoUsers }, newState) {
    const { presentUpdated } = this.state;

    if (!presentUpdated && pererittoUsers && pererittoUsers.length > 0) {
      const presentPlayers = pererittoUsers
        .filter(user => !user.retired)
        .map(user => user._id);
      this.setState({ ...this.state, presentUpdated: true, presentPlayers });
    }
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
    const { presentPlayers, presentUpdated } = this.state;
    const playerId = event.target.value;

    const newState = [...presentPlayers];
    if (!presentPlayers.includes(playerId) && presentUpdated)
      newState.push(playerId);

    this.setState({ playerId, presentPlayers: newState });
  };

  updatePlayerClick = () => {
    const { playerId, selectedDate, updateState, presentPlayers } = this.state;

    if (
      playerId === '' &&
      (updateState === UPDATE_BOARD || updateState === CUSTOM_AWARD)
    ) {
      this.setState({ errorName: true });
      return this.props.showMessage(MessageTypeEnum.error, 'Select a name!');
    }

    if (selectedDate === null || selectedDate === '')
      return this.props.showMessage(MessageTypeEnum.error, 'Select a date!');

    switch (updateState) {
      case UPDATE_BOARD:
        if (!presentPlayers.includes(playerId))
          return this.props.showMessage(
            MessageTypeEnum.error,
            'The selected player needs to be present!'
          );
        this.setState({ ...this.state, updatingPlayer: true, showModal: true });
        break;
      case REMOVE_PLAYER:
        this.setState({ ...this.state, updatingPlayer: true, showModal: true });
        break;
      case CUSTOM_AWARD:
        this.setState({ ...this.state, updatingPlayer: true, showModal: true });
        break;
      default:
        break;
    }
  };

  updateBoardFinal = () => {
    const {
      playerId,
      selectedDate,
      presentPlayers,
      choseFirstAndWon,
      choseLastAndWon
    } = this.state;

    let choseAndWon;
    if (choseFirstAndWon) choseAndWon = FIRST;
    else if (choseLastAndWon) choseAndWon = LAST;

    this.props.updatePererittoUser(
      playerId,
      selectedDate,
      presentPlayers,
      choseAndWon
    );
  };

  updatePresentPlayer = userId => {
    const { presentPlayers, playerId } = this.state;
    const newState = [...presentPlayers];

    if (playerId === userId) return null;

    const index = newState.indexOf(userId);
    if (index > -1) newState.splice(index, 1);
    else newState.push(userId);

    this.setState({ presentPlayers: newState });
  };

  renderChoseAndWon = () => {
    const { choseFirstAndWon, choseLastAndWon } = this.state;

    const iconStyles = {
      display: 'table-cell',
      verticalAlign: 'middle',
      color: '#ad1209',
      background: '#ffdab9',
      borderRadius: '4px'
    };

    return (
      <div style={{ margin: '0 auto 30px', display: 'table' }}>
        <div
          onClick={() =>
            this.setState({
              ...this.state,
              choseFirstAndWon: !choseFirstAndWon,
              choseLastAndWon: false
            })
          }
          style={{ display: 'table', marginBottom: '4px', cursor: 'pointer' }}
        >
          {choseFirstAndWon ? (
            <SelectedIcon style={iconStyles} />
          ) : (
            <UnselectedIcon style={iconStyles} />
          )}
          <Typography
            style={{
              display: 'table-cell',
              verticalAlign: 'middle',
              paddingLeft: '4px'
            }}
          >
            Winner chose first
          </Typography>
        </div>
        <div
          onClick={() =>
            this.setState({
              ...this.state,
              choseLastAndWon: !choseLastAndWon,
              choseFirstAndWon: false
            })
          }
          style={{ display: 'table', cursor: 'pointer' }}
        >
          {choseLastAndWon ? (
            <SelectedIcon style={iconStyles} />
          ) : (
            <UnselectedIcon style={iconStyles} />
          )}
          <Typography
            style={{
              display: 'table-cell',
              verticalAlign: 'middle',
              paddingLeft: '4px'
            }}
          >
            Winner chose last
          </Typography>
        </div>
      </div>
    );
  };

  renderPresentPlayers = () => {
    const { pererittoUsers } = this.props;
    const { playerId, presentPlayers } = this.state;

    if (!pererittoUsers) return null;

    return (
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        style={{ marginTop: '12px', marginBottom: '12px' }}
      >
        <List
          style={{
            width: '200px',
            border: '1px solid #a2a2a2',
            borderRadius: '8px',
            padding: '8px',
            background: '#dedede'
          }}
        >
          {pererittoUsers.map(user => {
            if (user.retired) return null;

            return (
              <ListItem
                key={user._id}
                style={{
                  padding: '1px',
                  backgroundColor: '#dadada',
                  borderLeft: '1px solid #ad1209',
                  borderRight: '1px solid #ad1209',
                  borderBottom: '1px solid #eaeaea',
                  borderRadius: '2px'
                }}
                button
                onClick={() => this.updatePresentPlayer(user._id)}
              >
                <ListItemIcon>
                  {presentPlayers.includes(user._id) ? (
                    <SelectedIcon
                      style={{
                        // color: '#ad1209',
                        color: user.colour,
                        backgroundColor:
                          playerId === user._id ? '#fafafa' : '#eaeaea',
                        borderRadius: '3px'
                      }}
                    />
                  ) : (
                    <UnselectedIcon
                      style={{
                        // color: '#ad1209',
                        color: user.colour,
                        backgroundColor: '#dedede',
                        borderRadius: '3px'
                      }}
                    />
                  )}
                </ListItemIcon>
                <ListItemText
                  id={user._id}
                  disableTypography
                  primary={
                    <Typography
                      type="body2"
                      style={{
                        color: presentPlayers.includes(user._id)
                          ? '#000000de'
                          : '#adadad'
                      }}
                    >
                      {user.name}
                    </Typography>
                  }
                />
              </ListItem>
            );
          })}
        </List>
      </Grid>
    );
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
                updateState === UPDATE_BOARD || updateState === CUSTOM_AWARD
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
                    updateState === CUSTOM_AWARD ? '#c70039' : '#154360',
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
            {updateState === UPDATE_BOARD && playerId !== '' && (
              <Fragment>
                {this.renderPresentPlayers()}
                {this.renderChoseAndWon()}
              </Fragment>
            )}
          </Grid>
        </Grid>
        <ConfirmActionModal
          showModal={showModal}
          title={'Notice!'}
          message={`Are you sure you want to ${
            updateState === REMOVE_PLAYER
              ? 'delete this date?'
              : updateState === UPDATE_BOARD
              ? 'update the board?'
              : 'mark this player as absent?'
          }`}
          confirmClick={() => {
            this.setState({ showModal: false });
            updateState === UPDATE_BOARD && this.updateBoardFinal();
            updateState === REMOVE_PLAYER &&
              this.props.removeWinnerDate(selectedDate);
            updateState === CUSTOM_AWARD &&
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
