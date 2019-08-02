import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactDayPicker from 'react-day-picker';

import 'react-day-picker/lib/style.css';
import classNames from 'react-day-picker/lib/src/classNames';

import './DatePicker.css';

class DatePicker extends Component {
  state = {
    selectedDay: null,
    showMoreMonths: false,
    monthsToDisplay: 6,
    data: null,
    selectedRemoveDate: null
  };

  mobileScreen = this.props.resizeScreen || !this.props.preventSelection;
  showMoreMonths = this.props.showMoreMonths;

  dayPickerClassNames = {
    ...classNames,
    container: this.mobileScreen ? 'DayPicker' : 'Custom-DayPicker',
    weekday: 'Custom-Weekday',
    weekdays: 'Custom-Weekdays',
    todayButton: 'Custom-TodayButton',
    day: 'Custom-Day',
    wrapper: 'Custom-Wrapper',
    footer: 'Custom-Footer',
    navButtonNext: this.mobileScreen
      ? 'Custom-NavButton Custom-NavButton--next'
      : 'Custom-NavButton Custom-NavButton-Multiple--next',
    navButtonPrev: this.mobileScreen
      ? 'Custom-NavButton Custom-NavButton--prev'
      : 'Custom-NavButton Custom-NavButton-Multiple--prev'
  };

  shouldComponentUpdate(nextProps) {
    if (
      !this.props.preventSelection &&
      nextProps.selectedDate !== this.state.selectedDay
    ) {
      return true;
    }

    if (nextProps.data) {
      if (this.state.data !== nextProps.data) {
        return true;
      }
    }

    if (nextProps.hideDates !== this.props.hideDates) return true;

    return nextProps.showMoreMonths !== this.state.showMoreMonths;
  }

  componentDidUpdate(props) {
    const { showMoreMonths, preventSelection } = this.props;
    this.dayPickerClassNames = {
      ...this.dayPickerClassNames,
      navButtonPrev: showMoreMonths
        ? 'Custom-NavButton-ShowMoreMonths--prev'
        : 'Custom-NavButton Custom-NavButton-Multiple--prev',
      month: showMoreMonths ? 'Custom-Month-ShowMoreMonths' : 'DayPicker-Month',
      caption: showMoreMonths
        ? 'Custom-Caption-ShowMoreMonths'
        : 'DayPicker-Caption'
    };

    if (preventSelection) this.setState({ showMoreMonths: showMoreMonths });

    if (props.data && this.state.data !== props.data) {
      this.setState({ data: props.data });
    }

    if (props.hideDates !== this.props.hideDates) {
      if (props.hideDates) {
        this.setState({ selectedDay: null });
      } else {
        this.setState({ selectedRemoveDate: null });
      }
      this.props.selectedDate(null);
    }
  }

  handleDayClick = (day, { selected }) => {
    let date = day.toString().substring(0, 15);

    if (this.props.hideDates) {
      this.setState({
        selectedDay: selected ? null : new Date(date)
      });
      this.props.selectedDate(selected ? null : date);
    } else {
      const dateExists = this.checkIfDateExists(date);

      this.setState({
        ...this.state,
        selectedRemoveDate:
          selected || dateExists.length === 0 ? null : new Date(date),
        selectedDay: null
      });
      this.props.selectedDate(
        selected || dateExists.length === 0 ? null : date
      );
    }
  };

  checkIfDateExists(date) {
    const { winners } = this.props;

    if (winners && winners.winners) {
      return winners.winners.filter(winner => winner.date === date);
    }
  }

  renderDay = day => {
    const { winners, hideDates } = this.props;

    if (!winners || !winners.winners) return null;

    let dateToRender = day.toString().substring(0, 15);

    const date = day.getDate();
    const renderDates = () => {
      if (!hideDates && winners.winners && winners.winners.length > 0) {
        for (let i = 0; i < winners.winners.length; i++) {
          if (winners.winners[i].date === dateToRender)
            return (
              <div>
                {winners.winners[i]._winner.name.charAt(0).toUpperCase()}
              </div>
            );
        }
      }

      return <div>{date}</div>;
    };

    return <div>{renderDates()}</div>;
  };

  setMonthsBack = () => {
    const monthDisplay = this.state.monthsToDisplay - 1;
    return new Date(
      new Date().getFullYear(),
      new Date().getMonth() - monthDisplay,
      new Date().getDate()
    );
  };

  render() {
    const {
      resizeScreen,
      preventSelection,
      showMoreMonths,
      winners,
      hideDates
    } = this.props;
    const { selectedRemoveDate } = this.state;

    let modifiers = {};
    let modifiersStyles = {};

    if (
      !hideDates &&
      winners &&
      winners.winners &&
      winners.winners.length > 0
    ) {
      winners.winners.forEach(date => {
        if (date.date.length > 0) {
          modifiers[date._id] = new Date(date.date);

          if (
            !selectedRemoveDate ||
            (selectedRemoveDate &&
              new Date(date.date).getTime() !== selectedRemoveDate.getTime())
          ) {
            modifiersStyles[date._id] = {
              color: 'white',
              backgroundColor: date._winner.colour
            };
          } else {
            modifiersStyles[date._id] = {
              color: 'white',
              backgroundColor: '#232020'
            };
          }
        }
      });
    }

    const mobileScreen = resizeScreen || !preventSelection;

    const styleShowMoreMonths = {
      marginTop: '-22px',
      transform: 'scale(1,0.9)'
    };

    const styleShowOneMonth = {
      paddingTop: mobileScreen ? '' : '24px',
      backgroundColor: mobileScreen ? '' : '#ffa07a'
    };

    return (
      <div style={showMoreMonths ? styleShowMoreMonths : styleShowOneMonth}>
        <ReactDayPicker
          todayButton="Today"
          selectedDays={this.state.selectedDay}
          onDayClick={preventSelection ? null : this.handleDayClick}
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          classNames={this.dayPickerClassNames}
          renderDay={this.renderDay}
          numberOfMonths={
            mobileScreen ? (showMoreMonths ? 6 : 1) : this.state.monthsToDisplay
          }
          month={
            mobileScreen
              ? showMoreMonths
                ? this.setMonthsBack()
                : null
              : this.setMonthsBack()
          }
        />
      </div>
    );
  }
}

function mapStateToProps({ resizeScreen, winners }) {
  return {
    resizeScreen,
    winners
  };
}

export default connect(mapStateToProps)(DatePicker);
