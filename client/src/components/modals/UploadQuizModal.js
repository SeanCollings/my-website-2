import React from 'react';

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
    padding: '12px 20px'
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

const UploadQuizModal = ({ classes, showModal, cancelClick, confirmClick }) => {
  return (
    <Modal
      aria-labelledby="upload-modal"
      aria-describedby="upload-modal"
      open={showModal}
    >
      <div
        style={{ background: '#fffaf0' }}
        className={`${classes.modalStyles} ${classes.paper}`}
      >
        <Typography
          id="modal-title"
          style={{ textAlign: 'center', fontWeight: 'bold' }}
          paragraph
        >
          UPLOAD QUIZ
        </Typography>
        <Typography paragraph>
          In order to upload a quiz it needs to adhere to the following:
        </Typography>
        <ul>
          <li>
            <Typography>The file must be in .txt format</Typography>
          </li>
          <li>
            <Typography>
              Both the question and the answer must be on the same line
            </Typography>
          </li>
          <li>
            <Typography>The question must end in a '?'</Typography>
          </li>
        </ul>
        <Typography>
          This allows for the questions to be read in correctly.
        </Typography>
        <Typography paragraph>
          Failure to do this may prevent some question and/or answers from
          appearing correctly.
        </Typography>
        <Typography paragraph>
          Note: Uploading a new file will replace any other content that may
          already be there.
        </Typography>
        <Button
          className={classes.button}
          style={{
            width: '45%',
            marginRight: '10%',
            backgroundColor: 'transparent',
            color: '#9198e5',
            borderColor: 'pink'
          }}
          onClick={cancelClick}
        >
          Cancel
        </Button>
        <Button
          className={classes.button}
          style={{
            width: '45%',
            color: '#fffaf0',
            background: '#9198e5',
            borderColor: 'pink'
          }}
          onClick={confirmClick}
        >
          Confirm
        </Button>
      </div>
    </Modal>
  );
};

export default withStyles(styles)(UploadQuizModal);
