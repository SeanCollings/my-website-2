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

  render() {
    const {
      classes,
      cancelCreateClicked,
      confirmCreateUpdateClicked,
      editGroup,
      createEditGroup,
      mapDisplayed
    } = this.props;

    const createButtonText = !mapDisplayed
      ? !createEditGroup
        ? 'Create Group'
        : !editGroup
        ? 'Create'
        : 'Update'
      : 'Confirm';

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
        <Button onClick={confirmCreateUpdateClicked} className={classes.button}>
          {createButtonText}
        </Button>
      </div>
    );
  }
}

export default withStyles(styles)(CreateUpdateButtons);
