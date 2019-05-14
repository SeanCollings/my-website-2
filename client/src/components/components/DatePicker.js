import React, { Component } from 'react';
import ReactDayPicker from 'react-day-picker';

import 'react-day-picker/lib/style.css';
import classNames from 'react-day-picker/lib/src/classNames';

import './DatePicker.css';
const dayPickerClassNames = {
  ...classNames,
  weekday: 'Custom-Weekday',
  weekdays: 'Custom-Weekdays',
  todayButton: 'Custom-TodayButton',
  day: 'Custom-Day',
  wrapper: 'Custom-Wrapper',
  footer: 'Custom-Footer',
  navButtonNext: 'Custom-NavButton Custom-NavButton--next',
  navButtonPrev: 'Custom-NavButton Custom-NavButton--prev'
};

class DatePicker extends Component {
  state = { selectedDay: null };

  componentDidMount() {
    // this.props.
  }

  handleDayClick = (day, { selected }) => {
    let date = day.toString().substring(0, 15);
    this.setState({
      selectedDay: selected ? undefined : new Date(date)
    });
    this.props.selectedDate(date);
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
    const { data } = this.props;
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

    return (
      <div>
        <ReactDayPicker
          todayButton="Today"
          selectedDays={this.state.selectedDay}
          onDayClick={this.handleDayClick}
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          classNames={dayPickerClassNames}
          renderDay={this.renderDay}
        />
      </div>
    );
  }
}

export default DatePicker;
