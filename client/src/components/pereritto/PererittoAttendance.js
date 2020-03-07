import React, { useState, Fragment } from 'react';
import { Grid, Button, Typography, ClickAwayListener } from '@material-ui/core';

import UnselectedIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import SelectedIcon from '@material-ui/icons/CheckBox';
import MoreIcon from '@material-ui/icons/ExpandMore';

import CHALK_BOARD from '../../images/chalkboard.png';

const ICON_STYLE = {
  padding: '0px',
  background: '#424242',
  borderRadius: '4px',
  cursor: 'pointer'
};

const getPlayerNameAndColour = (allPlayers, presentPlayers) => {
  const players = presentPlayers.map(
    player => allPlayers.filter(p => p.id === player)[0]
  );

  return players.sort((a, b) => a.name.localeCompare(b.name));
};

const PererittoAttendance = ({
  hideAllAttendance,
  allPlayers,
  currentYearWinners,
  mobile
}) => {
  const [open, setOpen] = useState(false);
  const [totalEvents, setTotalEvents] = useState(currentYearWinners.length);
  const [selectedPlayers, setSelectedPlayers] = useState(
    allPlayers ? allPlayers.map(player => player.id) : []
  );

  const totalAppearance = {};
  const playerTotalWins = {};

  currentYearWinners.forEach(winner => {
    const { _winner } = winner;

    if (_winner) {
      const id = _winner._id;

      if (!playerTotalWins[id]) {
        playerTotalWins[id] = { count: 1, id };
      } else {
        playerTotalWins[id].count += 1;
      }
    }
  });

  const attendedPlayers = currentYearWinners.map(winner => {
    const { presentPlayers, date, _winner } = winner;

    if (presentPlayers) {
      const winnerId = _winner ? _winner._id : null;
      return {
        date,
        players: getPlayerNameAndColour(allPlayers, presentPlayers),
        winnerId
      };
    }

    return null;
  });

  currentYearWinners.forEach(winner => {
    const { presentPlayers } = winner;

    if (presentPlayers) {
      presentPlayers.forEach(player => {
        if (!totalAppearance[player]) {
          totalAppearance[player] = 1;
        } else {
          totalAppearance[player] += 1;
        }
      });
    }
  });

  const togglePlayer = id => {
    const updatedPlayers = [...selectedPlayers];

    const index = updatedPlayers.indexOf(id);
    if (index > -1) updatedPlayers.splice(index, 1);
    else updatedPlayers.push(id);

    setSelectedPlayers(updatedPlayers);

    const updatedTotalEvents = attendedPlayers.filter(event =>
      event.players.some(p => updatedPlayers.includes(p.id))
    );

    setTotalEvents(updatedTotalEvents.length);
  };

  const handleClick = () => {
    setOpen(!open);
  };

  const handleClickAway = () => {
    setOpen(false);
  };

  return (
    <Grid
      item
      style={{
        textAlign: 'center',
        margin: 'auto',
        position: 'relative'
      }}
    >
      <div
        style={{
          width: '82%',
          maxWidth: '900px',
          margin: 'auto',
          height: '30px',
          position: 'relative'
        }}
      >
        <ClickAwayListener onClickAway={handleClickAway}>
          <div style={{ position: 'absolute', zIndex: '2', width: '180px' }}>
            <Button
              onClick={handleClick}
              style={{
                width: '100%',
                borderRadius: '4px 4px 0px 0px',
                color: '#FFC300',
                border: '1px solid'
              }}
              size="small"
            >
              <div>
                {`${totalEvents} event${totalEvents === 1 ? '' : 's'}`}
                <MoreIcon
                  className={`more-icon ${open ? 'open' : 'closed'}`}
                  style={{
                    height: '20px',
                    padding: '5px',
                    color: '#FFC300'
                  }}
                />
              </div>
            </Button>
            {open ? (
              <div
                style={{
                  background: '#e52337',
                  zIndex: '2',
                  opacity: '0.9',
                  padding: '8px 8px 6px',
                  borderRadius: '0px 0px 8px 8px',
                  borderTop: '6px solid #cd0939',
                  display: 'grid',
                  gridTemplateColumns: '24px 54% 18%',
                  columnGap: '10px',
                  maxHeight: '200px',
                  overflow: 'auto'
                }}
              >
                {allPlayers.map(player => {
                  return (
                    <Fragment key={player.id}>
                      {selectedPlayers.includes(player.id) ? (
                        <SelectedIcon
                          onClick={() => togglePlayer(player.id)}
                          style={{ ...ICON_STYLE, color: player.colour }}
                        />
                      ) : (
                        <UnselectedIcon
                          onClick={() => togglePlayer(player.id)}
                          style={{ ...ICON_STYLE, color: player.colour }}
                        />
                      )}
                      <Typography
                        onClick={() => togglePlayer(player.id)}
                        style={{
                          lineHeight: '24px',
                          textAlign: 'left',
                          marginBottom: '2px',
                          cursor: 'pointer',
                          overflow: 'hidden',
                          color: '#DEDEDE'
                        }}
                      >
                        {player.name}
                      </Typography>
                      <Typography
                        onClick={() => togglePlayer(player.id)}
                        style={{
                          lineHeight: '20px',
                          borderRadius: '4px',
                          border: '1px solid #dedede80',
                          marginBottom: '4px',
                          color: '#DEDEED'
                        }}
                      >
                        {totalAppearance[player.id]}
                      </Typography>
                    </Fragment>
                  );
                })}
              </div>
            ) : null}
          </div>
        </ClickAwayListener>
        <Button
          onClick={hideAllAttendance}
          style={{
            color: '#FFC300',
            border: '1px solid',
            float: 'right'
          }}
          size="small"
        >
          Cancel
        </Button>
      </div>
      <div
        style={{
          margin: '8px auto',
          background: '#151515',
          backgroundImage: `url(${CHALK_BOARD})`,
          width: '80%',
          maxWidth: '900px',
          borderRadius: '4px',
          padding: '4px',
          border: '8px solid sandybrown',
          boxShadow: '3px 7px 12px -5px #555, inset 0 0 10px 0 #555'
        }}
      >
        <Grid container spacing={8}>
          {attendedPlayers.map((winner, i) => {
            const { date, players, winnerId } = winner;
            const dateNoYear = date.substring(4, 10);
            const leftBorder = i === 0 || i % 4 === 0;
            const displayDate = players.some(p =>
              selectedPlayers.includes(p.id)
            );

            return (
              <Grid
                key={i}
                item
                xs={mobile ? 3 : 2}
                style={{
                  borderBottom: '1px dashed #8a8a8a4d',
                  borderLeft: leftBorder && mobile ? '' : '1px dashed #8a8a8a4d'
                }}
              >
                <Typography
                  variant="body2"
                  style={{
                    fontSize: 'smaller',
                    color: '#ffffffb3',
                    fontWeight: '100',
                    fontFamily: 'Walter Turncoat',
                    opacity: displayDate ? '1' : '0.1'
                  }}
                >
                  {`${dateNoYear}${!winnerId ? ' ?' : ''}`}
                </Typography>
                <Grid container>
                  {players.map(player => {
                    const { name, colour, id } = player;
                    const intial = name.charAt(0).toUpperCase();
                    const isWinner = id === winnerId;
                    const display = selectedPlayers.includes(id);

                    return (
                      <Grid
                        key={id}
                        item
                        xs={3}
                        style={{
                          // color: '#DEDEDE',
                          // background: colour,
                          // borderRadius: '4px'
                          color: colour,
                          fontWeight: 'bold',
                          borderLeft: isWinner ? `1px solid ${colour}99` : '',
                          borderRight: isWinner ? `1px solid ${colour}99` : '',
                          borderRadius: '4px',
                          fontSize: 'small',
                          fontFamily: 'Walter Turncoat',
                          opacity: display ? '1' : '0.1'
                        }}
                      >
                        {intial}
                      </Grid>
                    );
                  })}
                </Grid>
              </Grid>
            );
          })}
        </Grid>
      </div>
    </Grid>
  );
};

export default PererittoAttendance;
