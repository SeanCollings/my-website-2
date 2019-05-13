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
  day: 'Custom-Day'
};

class DatePicker extends Component {
  state = { selectedDay: null };

  modifiers = {
    holiday: new Date(
      'Fri May 01 2019 12:00:00 GMT+0200 (South Africa Standard Time)'
    )
  };
  modifiersStyles = {
    holiday: {
      color: 'white',
      backgroundColor: 'blue'
    }
  };

  handleDayClick = (day, { selected }) => {
    let date = new Date(day);
    console.log(day, date);
    this.setState({
      selectedDay: selected ? undefined : day
    });
  };

  render() {
    return (
      <div style={{ backgroundImage: 'linear-gradient(#FFA07A, #FFDAB9 60%)' }}>
        <ReactDayPicker
          todayButton="Today"
          onTodayButtonClick={day => console.log(day)}
          selectedDays={this.state.selectedDay}
          onDayClick={this.handleDayClick}
          modifiers={this.modifiers}
          modifiersStyles={this.modifiersStyles}
          classNames={dayPickerClassNames}
        />
      </div>
    );
  }
}

export default DatePicker;
