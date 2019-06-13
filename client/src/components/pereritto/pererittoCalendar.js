import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';

import DatePicker from '../components/DatePicker';
import { Button, Grid } from '@material-ui/core';

class PererittoCalendar extends Component {
  state = { showMoreMonths: false };

  render() {
    const { showMoreMonths } = this.state;
    const { resizeScreen, winners, renderPage } = this.props;
    const selectedYearsArray = [];

    if (winners && winners.winners) {
      winners.winners.forEach(winner => {
        selectedYearsArray.push(winner);
      });
    }

    return (
      <div>
        <div style={{ paddingTop: resizeScreen ? '5px' : '24px' }} />
        <Grid item style={{ textAlign: 'center' }}>
          <Button
            style={{
              display: resizeScreen ? '' : 'none',
              color: '#FFC300',
              marginBottom: '5px',
              border: '1px solid'
            }}
            size="small"
            onClick={() => this.setState({ showMoreMonths: !showMoreMonths })}
          >
            {showMoreMonths ? 'View 1 month' : 'View 6 months'}
          </Button>
        </Grid>
        <DatePicker
          data={selectedYearsArray}
          preventSelection={true}
          showMoreMonths={showMoreMonths}
          renderPage={renderPage}
        />
      </div>
    );
  }
}

function mapStateToProps({ auth, pererittoUsers, resizeScreen, winners }) {
  return {
    pererittoUsers,
    superUser: auth.superUser,
    resizeScreen,
    winners
  };
}

export default connect(
  mapStateToProps,
  actions
)(PererittoCalendar);
