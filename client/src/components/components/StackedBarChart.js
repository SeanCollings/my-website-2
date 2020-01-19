import React, { useState } from 'react';
import { List, ListItem, Avatar } from '@material-ui/core';

import './StackedBarChart.css';

const BORDER_COLOUR = 'bisque';

const stackedBar = (first, second, colour) => {
  const height = '20px';

  return (
    <div
      className="chart_horiz"
      style={{
        border: `1px solid ${BORDER_COLOUR}`
      }}
    >
      <div
        className="chart_bar"
        style={{
          height,
          width: `${first}px`,
          background: `${colour}`
        }}
      ></div>
      <div
        className="chart_miss"
        style={{
          height,
          width: `${second}px`,
          background: `#EAEAEA99`,
          borderLeft: `1px solid ${BORDER_COLOUR}`,
          overflow: 'hidden'
        }}
      ></div>
      <div className="grid_line" style={{ transform: 'translate(25px)' }}></div>
      <div className="grid_line" style={{ transform: 'translate(50px)' }}></div>
      <div className="grid_line" style={{ transform: 'translate(75px)' }}></div>
    </div>
  );
};

const handleSetShowPercentage = (id, showPercentage, setShowPercentage) => {
  if (showPercentage.includes(id)) setShowPercentage([]);
  else setShowPercentage([id]);
};

const renderChart = (players, showPercentage, setShowPercentage) => {
  return players.map(player => {
    const showPercent = showPercentage.includes(player.id);
    const percentageWin = (player.wins / player.attended) * 100;
    const percentageMiss = 100 - percentageWin;

    let avatarText = player.name.charAt(0);
    if (showPercent) avatarText = `${percentageWin.toFixed(0)}%`;

    return (
      <ListItem
        onClick={() =>
          handleSetShowPercentage(player.id, showPercentage, setShowPercentage)
        }
        key={player.id}
        style={{ padding: '2px 16px' }}
      >
        <Avatar
          style={{
            backgroundColor: player.colour,
            width: '24px',
            height: '24px',
            border: `1px solid ${BORDER_COLOUR} `,
            marginRight: '8px',
            fontSize: showPercent ? '9px' : '14px'
          }}
        >
          {avatarText}
        </Avatar>
        {stackedBar(
          percentageWin.toFixed(2),
          percentageMiss.toFixed(2),
          player.colour
        )}
      </ListItem>
    );
  });
};

const StackedBarChart = ({ winners, selectedYear, pererittoUsers }) => {
  const [showPercentage, setShowPercentage] = useState([]);
  const playerTotalWins = {};
  const totalAppearance = {};

  const currentYearWinners = winners.winners.filter(
    winner => winner.year === selectedYear
  );

  const allPlayers = pererittoUsers.map(user => {
    const name = user.name;
    const colour = user.colour;
    const retired = user.retired;
    const id = user._id;
    return { name, colour, retired, id, wins: 0, attended: 0 };
  });

  currentYearWinners.forEach(winner => {
    const id = winner._winner._id;
    const title = winner._winner.name;
    const color = winner._winner.colour;
    const presentPlayers = winner.presentPlayers;

    if (!playerTotalWins[id]) {
      playerTotalWins[id] = { count: 1, color, title, id };
    } else {
      playerTotalWins[id].count += 1;
    }

    if (presentPlayers) {
      presentPlayers.forEach(player => {
        if (!totalAppearance[player]) {
          totalAppearance[player] = {
            count: 1
          };
        } else {
          totalAppearance[player].count += 1;
        }
      });
    }
  });

  const playerWinAttendedCount = allPlayers
    .filter(player => {
      if (player.retired) {
        if (!playerTotalWins[player.id]) {
          return false;
        }
      }
      return true;
    })
    .map(player => {
      let attended = 0;
      let wins = 0;
      let difference = 0;
      for (let key in totalAppearance) {
        if (player.name === key) {
          attended = totalAppearance[key].count;
          wins = playerTotalWins[player.id]
            ? playerTotalWins[player.id].count
            : 0;
          difference = attended - wins;
        }
      }

      return { ...player, wins, attended, difference };
    });

  playerWinAttendedCount.sort((a, b) => b.wins - a.wins);

  return (
    <div
      style={{
        position: 'relative',
        width: '180px',
        height: '180px'
      }}
    >
      <List style={{ padding: 0 }}>
        {renderChart(playerWinAttendedCount, showPercentage, setShowPercentage)}
      </List>
    </div>
  );
};

export default StackedBarChart;
