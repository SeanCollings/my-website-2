import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader-advanced';
import MiniLoader from 'react-loader-spinner';
import * as actions from '../../actions';
import { showMessage } from '../../actions/snackBarActions';

import DatePicker from '../components/DatePicker';
import { MessageTypeEnum } from '../../utils/constants';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
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
    minWidth: 120
  }
});

class UpdatePererittoPlayer extends Component {
  state = {
    playerName: '',
    selectedDate: null,
    errorName: false,
    updatingPlayer: false
  };

  componentDidMount() {
    // this.props.getPererittoUsers();
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.snackBar.open && this.state.updatingPlayer) {
      this.setState({ updatingPlayer: false });
    }

    return true;
  }

  onFormSubmit = event => {
    event.preventDefault();
  };

  handleChange = event => {
    this.setState({ playerName: event.target.value });
  };

  updatePlayerClick = () => {
    const { playerName, selectedDate } = this.state;

    if (playerName === '') {
      this.setState({ errorName: true });
      return this.props.showMessage(MessageTypeEnum.error, 'Select a name!');
    }

    if (selectedDate === null || selectedDate === '')
      return this.props.showMessage(MessageTypeEnum.error, 'Select a date!');

    this.setState({ updatingPlayer: true });
    return this.props.updatePererittoUser(playerName, selectedDate);
    // .then(() => this.props.getWinners());
  };

  renderPlayers = () => {
    const { pererittoUsers } = this.props;
    if (pererittoUsers.length > 0) {
      return pererittoUsers.map(user => {
        return (
          <MenuItem key={user.name} value={user.name}>
            {user.name}
          </MenuItem>
        );
      });
    }

    return null;
  };

  spinner = (
    <span>
      <MiniLoader type="TailSpin" color="#FFC300" height={45} width={45} />
    </span>
  );

  spinnerSmall = (
    <span>
      <MiniLoader type="TailSpin" color="#FFC300" height={30} width={30} />
    </span>
  );

  toggleUpateType = () => {
    console.log('toggleUpateType');
  };

  render() {
    const { classes, resizeScreen } = this.props;
    const { updatingPlayer } = this.state;

    return (
      <div>
        <Grid className={classes.root}>
          <Grid item style={{ display: 'inline-flex' }}>
            <Grid item style={{ textAlign: 'center' }}>
              <form onSubmit={this.onFormSubmit}>
                <FormControl className={classes.formControl}>
                  <Select
                    value={this.state.playerName}
                    onChange={this.handleChange}
                    displayEmpty
                    style={{
                      opacity: this.state.playerName === '' ? '0.5' : '1'
                    }}
                  >
                    <MenuItem value="" disabled>
                      Select Player
                    </MenuItem>
                    {this.renderPlayers()}
                  </Select>
                </FormControl>
              </form>
            </Grid>
            <Grid item>
              <Avatar
                onClick={() => this.toggleUpateType()}
                style={{
                  position: 'absolute',
                  top: '4px',
                  backgroundColor: 'transparent',
                  color: '#ffa07a'
                }}
              >
                <MoreIcon />
              </Avatar>
            </Grid>
          </Grid>
          <Grid item style={{ textAlign: 'center' }}>
            <DatePicker
              preventSelection={false}
              selectedDate={date => this.setState({ selectedDate: date })}
            />
          </Grid>
          <Grid item style={{ textAlign: 'center', marginTop: '12px' }}>
            <Loader
              show={updatingPlayer ? true : false}
              message={resizeScreen ? this.spinnerSmall : this.spinner}
              backgroundStyle={{ backgroundColor: '' }}
            >
              <Button
                size={resizeScreen ? 'small' : 'medium'}
                style={{
                  color: 'white',
                  backgroundColor: '#001f3f',
                  opacity: updatingPlayer ? '0.4' : '1'
                }}
                onClick={this.updatePlayerClick}
              >
                Update Player
              </Button>
            </Loader>
          </Grid>
        </Grid>
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

export default connect(
  mapStateToProps,
  { ...actions, showMessage }
)(withStyles(styles)(UpdatePererittoPlayer));
