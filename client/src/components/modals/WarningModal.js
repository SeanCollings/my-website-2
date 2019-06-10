import React, { Component } from 'react';

import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Grid from '@material-ui/core/Grid';
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
    // width: '400',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    // padding: theme.spacing(4),
    outline: 'none'
  }
});

class WarningModal extends Component {
  handleClose = () => {
    console.log('handleClose');
    this.props.closeModal();
  };

  confirmContinueClick = () => {
    console.log('confirmContinueClick');
    this.props.continueModal();
  };

  render() {
    const { classes, showModal } = this.props;

    return (
      <Modal
        aria-labelledby="warning"
        aria-describedby="warning"
        open={showModal}
        onClose={this.handleClose}
      >
        {!this.state.showWarning ? (
          <div className={`${classes.modalStyles} ${classes.paper}`}>
            <Typography id="modal-title" style={{ textAlign: 'center' }}>
              Profile Photo
            </Typography>
            <Grid
              item
              style={{
                display: 'flex',
                justifyContent: 'space-evenly',
                padding: '10px'
              }}
            />
            <Typography
              id="modal-icons"
              variant="inherit"
              style={{
                display: 'flex',
                justifyContent: 'space-evenly',
                paddingBottom: '10px'
              }}
            >
              <Typography variant="body1" style={{ marginRight: '20px' }}>
                Camera
              </Typography>
              <Typography variant="body1" style={{ marginRight: '20px' }}>
                Gallery
              </Typography>
              <Typography variant="body1">Remove</Typography>
            </Typography>
            <Button
              style={{ width: '100%', backgroundColor: '#DEDEDE' }}
              onClick={() => this.setState({ showModal: false })}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <div className={`${classes.modalStyles} ${classes.paper}`}>
            <Typography
              id="modal-title"
              style={{ textAlign: 'center', paddingBottom: '10px' }}
            >
              Are you sure you want to continue?
            </Typography>
            <Button
              style={{
                width: '45%',
                backgroundColor: '#001f3f',
                color: 'white',
                marginRight: '10%'
              }}
              onClick={() => this.confirmContinueClick()}
            >
              Confirm
            </Button>
            <Button
              style={{
                width: '45%',
                backgroundColor: '#FF4136',
                color: 'white'
              }}
              onClick={() => this.props.cancelModal()}
            >
              Cancel
            </Button>
          </div>
        )}
      </Modal>
    );
  }
}

export default withStyles(styles)(WarningModal);
