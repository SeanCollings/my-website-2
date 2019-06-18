import React, { Component } from 'react';

import Button from '@material-ui/core/Button';

class CreateLocationsGroup extends Component {
  state = { editGroup: false };

  createEditGroup = () => {
    console.log('Creating or updating group');
  };

  render() {
    const {
      createGroupClicked,
      // creatingGroup,
      editGroup,
      createEditGroup
    } = this.props;

    return (
      <div>
        <Button
          onClick={createGroupClicked}
          style={{
            backgroundColor: '#3D9970',
            color: 'white',
            display: createEditGroup ? '' : 'none'
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={createGroupClicked}
          style={{
            backgroundColor: '#3D9970',
            color: 'white',
            display: editGroup ? 'none' : ''
          }}
        >
          {createEditGroup ? 'Create' : 'Create Group'}
        </Button>
        {/* <Button
          onClick={this.createEditGroup()}
          style={{
            backgroundColor: '#3D9970',
            color: 'white',
            display: editGroup ? '' : 'none'
          }}
        >
          Update
        </Button> */}
      </div>
    );
  }
}

export default CreateLocationsGroup;
