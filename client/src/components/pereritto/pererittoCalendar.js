import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';

import DatePicker from '../components/DatePicker';
import { Button, Grid, Typography } from '@material-ui/core';

const SELECT_A_DATE = 'Select a date to see who was there...';

class PererittoCalendar extends Component {
  state = {
    showMoreMonths: false,
    presentPlayers: SELECT_A_DATE
  };

  displayPresentPlayers = (names, display) => {
    if (display) {
      this.setState({
        presentPlayers: names.length ? names : SELECT_A_DATE
      });
    } else {
      this.setState({
        presentPlayers: ''
      });
    }
  };

  render() {
    const { showMoreMonths, presentPlayers } = this.state;
    const { resizeScreen, winners } = this.props;
    const selectedYearsArray = [];

    if (winners && winners.winners) {
      winners.winners.forEach(winner => {
        selectedYearsArray.push(winner);
      });
    }

    return (
      <div style={{ position: 'relative' }}>
        <div style={{ paddingTop: resizeScreen ? '8px' : '24px' }} />
        <Grid item style={{ textAlign: 'center' }}>
          <Button
            style={{
              display: resizeScreen ? '' : 'none',
              color: '#FFC300',
              marginBottom: '8px',
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
          showPlayers={true}
          presentPlayerNames={this.displayPresentPlayers}
        />
        <Typography
          id="present-players"
          style={{ marginTop: showMoreMonths ? '' : '8px', maxWidth: '260px' }}
          // onClick={() => this.setState({ presentPlayers: '' })}
        >
          {presentPlayers.replace(/,/g, ', ')}
        </Typography>
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

export default connect(mapStateToProps, actions)(PererittoCalendar);
