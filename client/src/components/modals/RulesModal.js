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
    width: '90%',
    padding: '12px',
    overflow: 'scroll',
    maxHeight: '100%'
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
    const { classes, showModal } = this.props;

    return (
      <Modal
        aria-labelledby="confirm-delete"
        aria-describedby="confirm-delete"
        open={showModal}
      >
        <div className={`${classes.modalStyles} ${classes.paper}`}>
          <Typography
            id="modal-title"
            style={{
              textAlign: 'center',
              fontWeight: 'bold'
            }}
          >
            Rules - Finger of Die
          </Typography>
          <ul
            style={{
              overflow: 'scroll',
              maxHeight: '400px',
              paddingRight: '12px'
            }}
          >
            <li>
              <Typography>Players: 2 - 8</Typography>
            </li>
            <li>
              <Typography>Game is played clockwise</Typography>
            </li>
            <li>
              <Typography>Play until someone gets 5 points</Typography>
            </li>
            <li>
              <Typography>No negative points</Typography>
            </li>
            <li>
              <Typography>
                A round is when each player rolls the dice once
              </Typography>
            </li>
            <li>
              <Typography>Highest roll in a round gets 1 point</Typography>
            </li>
            <li>
              <Typography>
                Double a roll of 3 and roll of 5 ie. 3=6, 5=10
              </Typography>
            </li>
            {/* <li>
              <Typography>
                If two or more rolls are equal in a round, minus 1 from those
                players
              </Typography>
            </li> */}
            <li>
              <Typography>
                Roll 3('6') and roll 6 are both a '6' but not equal
              </Typography>
            </li>
            <li>
              <Typography>
                2 players: If the rolls for a round are equal, both players
                minus 1 point
              </Typography>
            </li>
            <li>
              <Typography>
                3+ players: If the highest roll is shared by 2 or more players
                and are equal, no change in score occurs
              </Typography>
            </li>
            <li>
              <Typography>
                If a 1 is rolled, all scores get calculated first - as per the
                above rules- after everyone has played, and then all those new
                scores get moved clockwise by 1
              </Typography>
            </li>
            <li>
              <Typography>
                If two or more 1's are rolled, scores get calculated first and
                then moved clockwise by the amount of 1's rolled
              </Typography>
            </li>
          </ul>
          <div style={{ textAlign: 'center' }}>
            <Button
              className={classes.button}
              style={{
                width: '45%'
                // backgroundColor: 'transparent'
              }}
              onClick={() => this.props.doneClick()}
            >
              Done
            </Button>
          </div>
        </div>
      </Modal>
    );
  }
}

export default withStyles(styles)(ConfirmActionModal);
