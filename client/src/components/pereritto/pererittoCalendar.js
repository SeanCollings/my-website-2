import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';

import DatePicker from '../components/DatePicker';

class PererittoCalendar extends Component {
  componentDidMount() {
    this.props.getWinners();
  }
  render() {
    return <DatePicker data={this.props.winners} />;
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
