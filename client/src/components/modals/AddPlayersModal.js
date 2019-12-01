import React, { Component } from 'react';

import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  modalStyles: {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '5px',
    maxWidth: '400px',
    width: '75%',
    padding: '12px'
  },
  paper: {
    position: 'absolute',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    outline: 'none'
  },
  button: {
    backgroundColor: '#e0e0e0',
    border: 'solid 1px #e0e0e0'
  }
});

class ConfirmActionModal extends Component {
  state = {
    currentPlayers: [],
    playerName: '',
    errorMessage: ''
  };

  textFieldKeyDown = e => {
    const { playerName } = this.state;

    if (e.keyCode === 13 && playerName.length > 0) {
      this.addPlayerClicked();
    }
    // else if (e.keyCode === 27) {
    //   this.cancelClicked();
    // }
  };

  addPlayerClicked = () => {
    const { playerName, currentPlayers } = this.state;
    const textField = document.getElementById('add-player');

    if (playerName.length) {
      if (currentPlayers.length === 8) {
        return this.setState({ errorMessage: 'You already have 8 players!' });
      }

      if (currentPlayers.includes(playerName.toLowerCase())) {
        return this.setState({ errorMessage: 'Names must be unique' });
      }

      const allPlayers = [...currentPlayers];
      allPlayers.push(playerName.toLowerCase());

      this.setState({
        ...this.state,
        playerName: '',
        errorMessage: '',
        currentPlayers: allPlayers
      });
      this.props.addClick(playerName);

      if (textField) {
        document.getElementById('add-player').focus();
        document.getElementById('add-player').select();
      }
    } else {
      this.setState({ errorMessage: 'At least something here' });
    }
  };

  cancelClicked = () => {
    const { playerName, currentPlayers, errorMessage } = this.state;

    this.setState({
      showError: false,
      errorMessage: '',
      currentPlayers: [],
      playerName: ''
    });

    if (playerName.length && currentPlayers.length && !errorMessage.length)
      this.props.addClick(playerName);

    this.props.cancelClick();
  };

  render() {
    const { classes, title, message, showModal, playerAdded } = this.props;
    const { playerName, errorMessage } = this.state;

    return (
      <Modal
        aria-labelledby="add-player"
        aria-describedby="add-player"
        open={showModal}
      >
        <div className={`${classes.modalStyles} ${classes.paper}`}>
          <Typography
            id="modal-title"
            style={{ textAlign: 'center', fontWeight: 'bold' }}
            paragraph
          >
            {title}
          </Typography>
          <Typography
            id="modal-title"
            style={{ textAlign: 'center' }}
            paragraph
          >
            {message}
          </Typography>
          <div style={{ textAlign: 'center', margin: '14px' }}>
            <TextField
              autoComplete="off"
              error={errorMessage.length > 0}
              id="add-player"
              label="Player name"
              variant="outlined"
              helperText={errorMessage}
              value={playerName}
              onKeyDown={e => this.textFieldKeyDown(e)}
              onChange={e =>
                this.setState({
                  playerName: e.target.value,
                  showError: e.target.value.length ? false : true
                })
              }
            />
          </div>
          <Button
            className={classes.button}
            style={{
              width: '45%',
              marginRight: '10%',
              backgroundColor: 'transparent'
            }}
            onClick={this.cancelClicked}
          >
            {playerAdded ? 'Start' : 'Cancel'}
          </Button>
          <Button
            className={classes.button}
            style={{
              width: '45%',
              backgroundColor: '#e0e0e0'
            }}
            onClick={this.addPlayerClicked}
          >
            Add+
          </Button>
        </div>
      </Modal>
    );
  }
}

export default withStyles(styles)(ConfirmActionModal);
