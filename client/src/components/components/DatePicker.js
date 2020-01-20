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
    selectedCalendarDate: null,
    pererittoId: 'pereritto_id',
    showToolTip: false,
    presentNames: {},
    datePre2020: false,
    selectedPlayer: null
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

  componentDidMount() {
    // const navButtons = document.getElementsByClassName('Custom-NavButton');
    // if (navButtons && navButtons.length > 0) {
    //   for (let i = 0; i < navButtons.length; i++) {
    //     navButtons[i].addEventListener('click', () => {
    //       console.log(this.state.selectedCalendarDate);
    //     });
    //   }
    // }
  }

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
        this.setState({ selectedCalendarDate: null });
      }
      this.props.selectedDate(null);
    }

    if (showMoreMonths !== props.showMoreMonths) {
      this.handleMonthChange();
    }
  }

  handleDayClick = (day, modifiers, e) => {
    const { preventSelection, showPlayers, presentPlayerNames } = this.props;
    const { datePre2020 } = this.state;

    // if (Object.keys(modifiers)[0] && Object.keys(modifiers)[0].includes(pererittoId)) {
    //   const keySplit = Object.keys(modifiers)[0].split('|');
    //   const bounds = this.datePicker.getBoundingClientRect();
    //   this.props.showTooltip(true,keySplit[2],e.clientX,e.clientY - bounds.top,'#b17e26');
    // }
    let date = day.toString().substring(0, 15);

    if (!preventSelection) {
      if (this.props.hideDates) {
        this.setState({
          selectedDay: modifiers.selected ? null : new Date(date)
        });
        this.props.selectedDate(modifiers.selected ? null : date);
      } else {
        const dateExists = this.checkIfDateExists(date);

        this.setState({
          ...this.state,
          selectedCalendarDate:
            modifiers.selected || dateExists.length === 0
              ? null
              : new Date(date),
          selectedDay: null
        });
        this.props.selectedDate(
          modifiers.selected || dateExists.length === 0 ? null : date
        );
      }
    } else if (showPlayers) {
      const dateExists = this.checkIfDateExists(date);
      if (
        dateExists.length > 0 &&
        dateExists[0].presentPlayers &&
        dateExists[0].presentPlayers.length > 0
      ) {
        const date = dateExists[0].date;
        const dateSelected = document.querySelector(`[aria-label="${date}"]`);

        if (dateSelected) {
          const rect = dateSelected.getBoundingClientRect();
          const position = {
            top: rect.top - 128 + window.scrollY,
            center: rect.left + rect.width / 2 + window.scrollX
          };

          const tooltip = document.getElementById('tooltip');
          if (tooltip) {
            const tooltipWidth = tooltip.offsetWidth;
            tooltip.style.top = `${position.top}px`;
            tooltip.style.left = `${position.center - tooltipWidth / 2}px`;
          }
        }

        const selectedPlayer = dateExists[0]._winner._id;
        const presentPlayers = dateExists[0].presentPlayers;
        // presentPlayers.sort((a, b) => (a > b ? a : b));
        const presentNames = { players: presentPlayers, selectedDate: date };

        this.setState({
          ...this.state,
          selectedCalendarDate:
            modifiers.selected || dateExists.length === 0
              ? null
              : new Date(date),
          showToolTip: true,
          presentNames,
          selectedPlayer
        });
        presentPlayerNames(presentNames, true, selectedPlayer);
      } else {
        presentPlayerNames('', !datePre2020);
        this.setState({
          ...this.state,
          selectedCalendarDate: null,
          showToolTip: false,
          presentNames: {},
          selectedPlayer: null
        });
      }
    }
  };

  monthDifference = (dateFrom, dateTo) => {
    return (
      dateTo.getMonth() -
      dateFrom.getMonth() +
      12 * (dateTo.getFullYear() - dateFrom.getFullYear())
    );
  };

  handleMonthChange = month => {
    const { showMoreMonths, presentPlayerNames } = this.props;
    const { presentNames, selectedPlayer } = this.state;

    const checkMonth = month ? month : new Date();
    const pre2020Small = new Date(checkMonth).getFullYear() < 2020;
    const pre2020Big = this.monthDifference(checkMonth, new Date()) >= 6;

    if ((!showMoreMonths && pre2020Small) || pre2020Big) {
      this.setState({ datePre2020: true });
      presentPlayerNames('');
    } else {
      presentPlayerNames(presentNames, true, selectedPlayer);
      this.setState({ datePre2020: false });
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
      hideDates,
      showPlayers
    } = this.props;
    const { selectedCalendarDate, pererittoId } = this.state;

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
          const name = date._winner.name;
          const colour = date._winner.colour;
          const mods = `${pererittoId}|${date._id}|${name}`;

          modifiers[mods] = new Date(date.date);

          if (
            !selectedCalendarDate ||
            (selectedCalendarDate &&
              new Date(date.date).getTime() !== selectedCalendarDate.getTime())
          ) {
            modifiersStyles[mods] = {
              color: 'white',
              backgroundColor: colour
            };
          } else {
            modifiersStyles[mods] = {
              color: 'white',
              backgroundColor: showPlayers ? colour : '#232020',
              filter: showPlayers
                ? `drop-shadow(1px 1px 2px #232020) contrast(1.1)`
                : ''
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
      <div
        ref={ref => {
          this.datePicker = ref;
        }}
        style={showMoreMonths ? styleShowMoreMonths : styleShowOneMonth}
      >
        <ReactDayPicker
          todayButton="Today"
          selectedDays={this.state.selectedDay}
          onDayClick={this.handleDayClick}
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
          onMonthChange={this.handleMonthChange}
        />
        {/* {showPlayers && (
          <div
            id="tooltip"
            style={{
              background: 'aliceblue',
              position: 'absolute',
              display: showToolTip ? '' : 'none'
            }}
          >
            Jarrod
          </div>
        )} */}
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
