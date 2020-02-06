import React from 'react';

import {
  CONTINUE_QUIZ,
  ALL_OWN_QUIZ,
  ALL_PUBLIC_QUIZ
} from '../../utils/constants';

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

const buttonStyle = {
  background: 'pink',
  color: '#581845',
  textTransform: 'none',
  marginBottom: '4px'
};

const SelectStartQuizModal = ({
  classes,
  showModal,
  cancelClick,
  selectQuizTypeClick,
  savedQuizzes
}) => {
  return (
    <Modal
      aria-labelledby="start-modal"
      aria-describedby="start-modal"
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
          SELECT A QUIZ
        </Typography>
        <Typography paragraph style={{ textAlign: 'center' }}>
          Select the type of quiz you'd like to begin or continue from where you
          left off:
        </Typography>
        <div style={{ textAlign: 'center', marginBottom: '12px' }}>
          <Button
            onClick={() => selectQuizTypeClick(ALL_PUBLIC_QUIZ)}
            style={{
              ...buttonStyle,
              width: '100%',
              border: '1px solid #9198e5'
            }}
          >
            All public questions
          </Button>
          <Button
            onClick={() => selectQuizTypeClick(ALL_OWN_QUIZ)}
            style={{
              ...buttonStyle,
              width: '100%',
              border: '1px solid #9198e5'
            }}
          >
            All own questions
          </Button>
          <Typography
            paragraph
            style={{ textAlign: 'center', marginTop: '12px' }}
          >
            Or select from a single quiz you've saved:
          </Typography>
          <div
            style={{ display: 'grid', maxHeight: '120px', overflow: 'auto' }}
          >
            {savedQuizzes.map(quiz => {
              const { _id, title } = quiz.group;

              return (
                <Button
                  key={_id}
                  onClick={() => selectQuizTypeClick(_id)}
                  style={{ ...buttonStyle }}
                >
                  {title}
                </Button>
              );
            })}
          </div>
        </div>
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
          onClick={() => selectQuizTypeClick(CONTINUE_QUIZ)}
        >
          Continue
        </Button>
      </div>
    </Modal>
  );
};

export default withStyles(styles)(SelectStartQuizModal);
