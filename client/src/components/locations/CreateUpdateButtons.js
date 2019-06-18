import React, { Component } from 'react';

import Button from '@material-ui/core/Button';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  button: {
    color: 'white',
    border: '1px solid',
    minWidth: '100px'
  }
});

class CreateUpdateButtons extends Component {
  state = { editGroup: false };

  createEditGroup = () => {
    console.log('Creating or updating group');
  };

  render() {
    const {
      classes,
      cancelCreateClicked,
      createConfirmClicked,
      // creatingGroup,
      editGroup,
      createEditGroup,
      mapDisplayed
    } = this.props;

    return (
      <div style={{ textAlign: 'center' }}>
        <Button
          onClick={cancelCreateClicked}
          className={classes.button}
          style={{
            marginRight: '24px',
            display: createEditGroup ? '' : 'none'
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={createConfirmClicked}
          className={classes.button}
          style={{
            display: editGroup ? 'none' : ''
          }}
        >
          {!mapDisplayed ? 'Create' : 'Confirm'}
        </Button>
        {/* <Button
          onClick={this.createEditGroup()}
          className={classes.button}
          style={{
            display: editGroup ? '' : 'none'
          }}
        >
          Update
        </Button> */}
      </div>
    );
  }
}

export default withStyles(styles)(CreateUpdateButtons);
