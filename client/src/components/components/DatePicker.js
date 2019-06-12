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
    data: null
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
  }

  handleDayClick = (day, { selected }) => {
    let date = day.toString().substring(0, 15);
    this.setState({
      selectedDay: selected ? null : new Date(date)
    });

    this.props.selectedDate(selected ? null : date);
  };

  renderDay = day => {
    const { data } = this.props;
    let dateToRender = day.toString().substring(0, 15);

    const date = day.getDate();
    const renderDates = () => {
      if (data && data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].date === dateToRender)
            return <div>{data[i]._winner.name.charAt(0).toUpperCase()}</div>;
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
    const { resizeScreen, preventSelection, showMoreMonths, data } = this.props;
    let modifiers = {};
    let modifiersStyles = {};

    if (data && data.length) {
      data.forEach(date => {
        if (date.date.length > 0) {
          modifiers[date._id] = new Date(date.date);
          modifiersStyles[date._id] = {
            color: 'white',
            backgroundColor: date._winner.colour
          };
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
