import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import MaterialTable from 'material-table';

import UpdatePereritto from './UpdatePereritto';

import Grid from '@material-ui/core/Grid';
// import Typography from '@material-ui/core/Typography';
// import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  disabledButton: {
    opacity: '0.3'
  },
  colorRed: {
    color: 'red'
  }
});

class UpdatePererittos extends Component {
  state = { updateEnabled: false };

  componentDidMount() {
    this.props.fetchAllUsers('pererittoUser');
  }

  renderAllUsers() {
    const { users, resizeScreen } = this.props;

    const columns = [
      {
        title: 'Name',
        field: 'name'
      },
      {
        title: 'Surname',
        field: 'surname'
      }
    ];

    if (!resizeScreen) {
      columns.unshift({
        title: 'Row',
        field: 'index'
      });
    }

    return (
      <div
        style={{
          paddingLeft: '10px',
          paddingRight: '10px',
          maxWidth: '600px',
          margin: 'auto'
        }}
      >
        <MaterialTable
          title="Pereritto Table"
          columns={columns}
          data={
            users !== null && users.length > 0
              ? users.map((user, index) => ({
                  index: index + 1,
                  id: user._id,
                  name: user.givenName,
                  surname: user.familyName,
                  pererittoUser: user.pererittoUser
                }))
              : []
          }
          detailPanel={[
            {
              render: rowData => {
                return <UpdatePereritto data={rowData} />;
              }
            }
          ]}
          onRowClick={(event, rowData, togglePanel) => togglePanel()}
          options={{
            rowStyle: {
              height: 'auto'
            },
            headerStyle: {
              backgroundColor: '#EF6161',
              color: '#DEDEDE'
            }
          }}
        />
      </div>
    );
  }

  render() {
    return (
      <Grid>
        <Grid
          item
          style={{
            textAlign: 'left',
            maxWidth: '1200px',
            width: '100%',
            margin: 'auto'
          }}
        >
          {this.renderAllUsers()}
        </Grid>
      </Grid>
    );
  }
}

function mapStateToProps({ maintenance, resizeScreen }) {
  return { users: maintenance.users, resizeScreen };
}

export default connect(
  mapStateToProps,
  actions
)(withStyles(styles)(UpdatePererittos));
