import React from 'react';
import { Grid, Button, Typography } from '@material-ui/core';
import { memoize } from '../components/charts/chartUtils';

const CURRENT_YEAR = new Date().getFullYear();

const memoizedPlayers = memoize(pererittoUsers => {
  return pererittoUsers.map((user, i) => {
    const name = user.name;
    const colour = user.colour;
    const id = user._id;
    return { name, colour, id, position: i };
  });
});

const getPlayerNameAndColour = (allPlayers, presentPlayers) => {
  const players = presentPlayers.map(
    player => allPlayers.filter(p => p.id === player)[0]
  );

  return players.sort((a, b) => a.name.localeCompare(b.name));
};

const PererittoAttendance = ({
  hideAllAttendance,
  winners,
  pererittoUsers,
  chalkBoard
}) => {
  const totalAppearance = {};
  const playerTotalWins = {};

  const allPlayers = memoizedPlayers(pererittoUsers);
  const currentYearWinners = winners.winners
    .filter(winner => winner.year === CURRENT_YEAR)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

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

  // console.log('currentYearWinners', currentYearWinners);
  // console.log('playerTotalWins', playerTotalWins);
  // console.log('allPlayers', allPlayers);
  // console.log('attendedPlayers', attendedPlayers);

  return (
    <Grid
      item
      style={{
        textAlign: 'center',
        margin: 'auto',
        position: 'relative'
      }}
    >
      <Button
        onClick={hideAllAttendance}
        style={{
          color: '#FFC300',
          border: '1px solid'
        }}
        size="small"
      >
        Cancel
      </Button>
      <div
        style={{
          margin: '8px auto',
          background: `url(${chalkBoard})`,
          width: '80%',
          maxWidth: '900px',
          borderRadius: '4px',
          padding: '4px',
          border: '8px solid sandybrown'
        }}
      >
        <Grid container spacing={8}>
          {attendedPlayers.map((winner, i) => {
            const { date, players, winnerId } = winner;
            const dateNoYear = date.substring(4, 10);
            const leftBorder = i === 0 || i % 4 === 0;

            return (
              <Grid
                key={i}
                item
                xs={3}
                style={{
                  borderBottom: '1px solid #8a8a8a66',
                  borderLeft: leftBorder ? '' : '1px solid #8a8a8a66'
                  // borderRadius: '8px'
                }}
              >
                <Typography
                  variant="body2"
                  style={{
                    fontSize: 'small',
                    color: '#dededeb3',
                    fontWeight: '100'
                  }}
                >
                  {dateNoYear}
                </Typography>
                <Grid container>
                  {players.map(player => {
                    const { name, colour, id } = player;
                    const intial = name.charAt(0).toUpperCase();
                    const isWinner = id === winnerId;

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
                          borderLeft: isWinner ? `1px solid ${colour}4d` : '',
                          borderRight: isWinner ? `1px solid ${colour}4d` : '',
                          borderRadius: '4px'
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
