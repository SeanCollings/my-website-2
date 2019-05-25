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

    if (winners && winners.winnerYears && winners.winners) {
      Object.keys(winners.winners).forEach(key => {
        Object.keys(winners.winners[key]).forEach(date => {
          selectedYearsArray.push(winners.winners[key][date]);
        });
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
              paddingBottom: '5px'
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
