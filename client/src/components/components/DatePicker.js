import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactDayPicker from 'react-day-picker';

import 'react-day-picker/lib/style.css';
import classNames from 'react-day-picker/lib/src/classNames';

import './DatePicker.css';

class DatePicker extends Component {
  state = { selectedDay: null };
  mobileScreen = this.props.resizeScreen || !this.props.preventSelection;

  dayPickerClassNames = {
    ...classNames,
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

  componentDidMount() {
    // this.props.
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
      if (data) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].date === dateToRender)
            return <div>{data[i]._winner.name.charAt(0).toUpperCase()}</div>;
        }
      }

      return <div>{date}</div>;
    };

    return <div>{renderDates()}</div>;
  };

  render() {
    const { data, resizeScreen, preventSelection } = this.props;
    let modifiers = {};
    let modifiersStyles = {};

    if (data) {
      data.forEach(d => {
        modifiers[d._id] = new Date(d.date);
        modifiersStyles[d._id] = {
          color: 'white',
          backgroundColor: d._winner.colour
        };
      });
    }

    const mobileScreen = resizeScreen || !preventSelection;
    let monthsToDisplay = 6;

    return (
      <div
        style={{
          paddingTop: mobileScreen ? '' : '24px',
          backgroundColor: mobileScreen ? '' : '#ffa07a'
        }}
      >
        <ReactDayPicker
          todayButton="Today"
          selectedDays={this.state.selectedDay}
          onDayClick={preventSelection ? null : this.handleDayClick}
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          classNames={this.dayPickerClassNames}
          renderDay={this.renderDay}
          numberOfMonths={mobileScreen ? 1 : monthsToDisplay}
          month={
            mobileScreen
              ? null
              : new Date(
                  new Date().getFullYear(),
                  new Date().getMonth() - (monthsToDisplay - 1),
                  new Date().getDate()
                )
          }
        />
      </div>
    );
  }
}

function mapStateToProps({ resizeScreen }) {
  return {
    resizeScreen
  };
}

export default connect(mapStateToProps)(DatePicker);
