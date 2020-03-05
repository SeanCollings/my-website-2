import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';

import GaugeChart from '../components/charts/GaugeChart';
import './PererittoAwards.css';

import { Typography, Grid, Select, MenuItem } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import { withStyles } from '@material-ui/core/styles';

// import trophy from '../../images/trophy.png';
// import coffeeSmall from '../../images/coffee_small.png';
// import diceSmall from '../../images/dice_small.png';
// import habaneroSmall from '../../images/habanero_small.png';
// import medalmall from '../../images/medal_small.png';
// import silverSmall from '../../images/silver_small.png';
// import starSmall from '../../images/star_small.png';

const styles = theme => ({
  root: {},
  award: {
    height: '50px',
    width: '50px',
    borderRadius: 0,
    zIndex: '2',
    top: '35px',
    display: 'inline-block'
  },
  cssUnderline: {
    borderBottomColor: '#DEDEDE',
    '&:before': {
      borderColor: ''
    },
    '&:after': {
      borderBottomColor: '#ffa07a'
    }
  }
});

const AWARD_MESSAGE = '. Wall of Flame .';
const RANDOM_RANDY = 'Random Randy';
const FIRST_CHOICE_WIN = 'First Choice Win';
const LAST_CHOICE_WIN = 'Last Choice Win';
const MAIN_ATTENDER = 'Main Attender';

const CURRENT_YEAR = new Date().getFullYear();
const CURRENT_YEAR_AWARDS = `${CURRENT_YEAR} Awards`;
const PAST_YEAR_AWARDS = `Past Awards`;
const SELECTABLE_YEARS = [CURRENT_YEAR_AWARDS, PAST_YEAR_AWARDS];

class PererittoAwards extends Component {
  state = {
    awardMessage: AWARD_MESSAGE,
    shelvesRendered: false,
    randyUpdated: false,
    selectedYear: SELECTABLE_YEARS[0],
    awardYears: SELECTABLE_YEARS
  };

  componentDidMount() {
    if (!this.props.awards.allAwards) {
      this.props.getUserAwards();
      this.props.getUserAwardsTotal();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { randyUpdated, awardMessage, selectedYear } = this.state;

    if (nextProps.awards !== this.props.awards) {
      if (!randyUpdated && nextProps.awards.allAwards) {
        this.setState({ randyUpdated: true });
      }

      return true;
    }
    if (awardMessage !== nextState.awardMessage) return true;
    if (selectedYear !== nextState.selectedYear) return true;

    return false;
  }

  renderShelves = () => {
    const { classes, awards, resizeScreen } = this.props;
    const { randyUpdated, selectedYear } = this.state;
    const allAwards = awards.allAwards;
    let currentYearAwardsLength = 0;
    let pastYearsAwardsLength = 0;
    let maxDisplayLength = 0;
    let displayAwards = [];

    if (allAwards) {
      allAwards.sort((a, b) => b.year - a.year);

      const randomRandyInArray = allAwards.some(
        el => el.title === RANDOM_RANDY
      );

      if (randomRandyInArray && !randyUpdated) {
        const index = allAwards.findIndex(el => el.title === RANDOM_RANDY);
        const randy = allAwards[index];
        const randomPositon = Math.floor(Math.random() * allAwards.length);

        allAwards.splice(index, 1);
        allAwards.splice(randomPositon, 0, randy);
      }

      const currentYear = selectedYear === CURRENT_YEAR_AWARDS;

      displayAwards = allAwards.filter(award =>
        currentYear ? award.year === CURRENT_YEAR : award.year !== CURRENT_YEAR
      );
      currentYearAwardsLength = allAwards.filter(
        award => award.year === CURRENT_YEAR
      ).length;
      pastYearsAwardsLength = allAwards.filter(
        award => award.year !== CURRENT_YEAR
      ).length;
      maxDisplayLength =
        currentYearAwardsLength > pastYearsAwardsLength
          ? currentYearAwardsLength
          : pastYearsAwardsLength;
    }

    const shelfArray = [];
    let numberOfShelves = 2;

    for (let i = 0; i < numberOfShelves; i++) {
      const awardArray = [];

      if (allAwards) {
        const awardsPerShelf = maxDisplayLength > 12 ? 4 : 3;
        numberOfShelves = Math.ceil(maxDisplayLength / awardsPerShelf);
        numberOfShelves = numberOfShelves < 2 ? 2 : numberOfShelves;

        for (
          let j = i * awardsPerShelf;
          j < i * awardsPerShelf + awardsPerShelf;
          j++
        ) {
          if (displayAwards[j]) {
            const topple = Math.random() < 0.005;
            const fallFloor = Math.random() < 0.004;
            const direction = Math.random() < 0.7 ? '' : '-';
            const pixelsTofall = 50 + 102 * (numberOfShelves - i - 1);
            const randomRandy =
              displayAwards[j].title === RANDOM_RANDY ? true : false;
            const firstChoiceAward = displayAwards[j].title.includes(
              FIRST_CHOICE_WIN
            );
            const lastChoiceAward = displayAwards[j].title.includes(
              LAST_CHOICE_WIN
            );
            const mainAttenderAward = displayAwards[j].title.includes(
              MAIN_ATTENDER
            );
            let distance = null;

            if (displayAwards[j]._award.canFall) {
              if (fallFloor) distance = `${pixelsTofall}px`;
              else if (topple) distance = '4px';
            }
            awardArray.push(
              <Avatar
                key={`${i}${j}`}
                style={{
                  transform:
                    displayAwards[j]._award.canFall && (fallFloor || topple)
                      ? `rotate(${direction}${displayAwards[j]._award.fallAngle}deg)`
                      : '',
                  marginTop: distance ? distance : '',
                  filter:
                    displayAwards[j].year !== new Date().getFullYear()
                      ? 'sepia(5%) grayscale(50%)'
                      : ''
                }}
                className={`${classes.award} transform-scale ${
                  randomRandy ? 'change-hue' : ''
                } ${lastChoiceAward && resizeScreen ? 'bullet' : ''}
                ${mainAttenderAward ? 'main-attender' : ''}
                ${firstChoiceAward ? 'thumbs-up' : ''}`}
                alt={displayAwards[j].title}
                src={displayAwards[j]._award.image}
                onClick={() =>
                  this.setState({
                    ...this.state,
                    awardMessage: `${displayAwards[j].title} - ${displayAwards[j].year}`,
                    randyUpdated: true
                  })
                }
                // onMouseOver={() =>
                //   !resizeScreen &&
                //   this.setState({
                //     ...this.state,
                //     awardMessage: `${allAwards[j].title} - ${allAwards[j].year}`,
                //     randyUpdated: true
                //   })
                // }
                // onMouseOut={() =>
                //   !resizeScreen &&
                //   this.setState({ awardMessage: originalMessage })
                // }
              />
            );
          } else {
            break;
          }
        }
      }

      shelfArray.push(
        <div className="shelf" key={i}>
          <div
            className="back"
            onClick={() => this.setState({ awardMessage: AWARD_MESSAGE })}
          />
          <div
            className="base"
            onClick={() => this.setState({ awardMessage: AWARD_MESSAGE })}
          />
          <div className="front" />
          <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
            {awardArray.map(award => award)}
          </div>
        </div>
      );
    }

    return shelfArray;
  };

  handleChange = event => {
    const selectedYear = event.target.value;
    this.setState({ ...this.state, selectedYear, awardMessage: AWARD_MESSAGE });
  };

  renderDates = () =>
    this.state.awardYears.map(year => (
      <MenuItem key={year} value={year}>
        {year}
      </MenuItem>
    ));

  render() {
    const {
      awards: { allAwards, userTotal },
      classes
    } = this.props;
    const { awardMessage, selectedYear } = this.state;

    return (
      <div
        style={{
          width: '300px',
          maxWidth: '90%',
          margin: '8px auto 0px'
        }}
      >
        <Grid
          item
          style={{
            textAlign: 'center',
            zIndex: '2',
            position: 'relative'
          }}
        >
          <Select
            className={classes.cssUnderline}
            value={selectedYear}
            onChange={this.handleChange}
            MenuProps={{
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'left'
              },
              transformOrigin: {
                vertical: 'top',
                horizontal: 'left'
              },
              getContentAnchorEl: null,
              PaperProps: {
                style: {
                  backgroundColor: '#DEDEDE',
                  maxHeight: '200px',
                  overflow: 'auto'
                }
              }
            }}
            SelectDisplayProps={{ style: { borderBottom: 'red' } }}
          >
            {this.renderDates()}
          </Select>
        </Grid>
        <div className="plaque-border">
          <div className="plaque-interior">
            <Typography
              style={{
                top: '25px',
                position: 'relative',
                transform: 'rotateX(20deg)',
                WebkitTransform: 'rotateX(20deg)',
                color: '#3e0c00'
              }}
              className="plaque-text"
            >
              {awardMessage}
            </Typography>
          </div>
        </div>
        <div className="cabinet">
          <div className="cabinet-top" />
          {this.renderShelves()}
        </div>
        {allAwards && userTotal && <GaugeChart allAwards={userTotal} />}
      </div>
    );
  }
}

function mapStateToProps({ resizeScreen, auth, awards }) {
  return {
    resizeScreen,
    auth,
    awards
  };
}

export default connect(
  mapStateToProps,
  actions
)(withStyles(styles)(PererittoAwards));
