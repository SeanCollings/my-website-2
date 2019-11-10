import React, { Component } from 'react';

import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
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
  render() {
    const { classes, title, message, showModal } = this.props;

    return (
      <Modal
        aria-labelledby="confirm-delete"
        aria-describedby="confirm-delete"
        open={showModal}
      >
        <div className={`${classes.modalStyles} ${classes.paper}`}>
          <Typography
            id="modal-title"
            style={{ textAlign: 'center' }}
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
          <Button
            className={classes.button}
            style={{
              width: '45%',
              marginRight: '10%',
              backgroundColor: 'transparent'
            }}
            onClick={() => this.props.cancelClick()}
          >
            Cancel
          </Button>
          <Button
            className={classes.button}
            style={{
              width: '45%'
            }}
            onClick={() => this.props.confirmClick()}
          >
            Confirm
          </Button>
        </div>
      </Modal>
    );
  }
}

export default withStyles(styles)(ConfirmActionModal);
