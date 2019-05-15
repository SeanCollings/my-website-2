import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';

import DatePicker from '../components/DatePicker';
import { Button, Grid } from '@material-ui/core';

class PererittoCalendar extends Component {
  state = { showMoreMonths: false };

  componentDidMount() {
    this.props.getWinners();
  }

  render() {
    const { showMoreMonths } = this.state;
    const { resizeScreen } = this.props;
    return (
      <div>
        <div style={{ paddingTop: resizeScreen ? '' : '24px' }} />
        <Grid item style={{ textAlign: 'center' }}>
          <Button
            style={{
              display: resizeScreen ? '' : 'none',
              color: '#FFC300'
            }}
            size="small"
            onClick={() => this.setState({ showMoreMonths: !showMoreMonths })}
          >
            {showMoreMonths ? 'View 1 month' : 'View 6 months'}
          </Button>
        </Grid>
        <DatePicker
          data={this.props.winners}
          preventSelection={true}
          showMoreMonths={showMoreMonths}
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
