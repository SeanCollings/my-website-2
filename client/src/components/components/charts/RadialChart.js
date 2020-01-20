import React, { useState } from 'react';
import Chart from 'react-apexcharts';
import { Typography, Button } from '@material-ui/core';

const RadialChart = ({ winners, selectedYear, pererittoUsers }) => {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const playerTotalWins = {};
  const totalAppearance = {};

  if (!winners || !winners.winners) return null;

  const currentYearWinners = winners.winners.filter(
    winner => winner.year === selectedYear
  );

  const allPlayers = pererittoUsers.map(user => {
    const name = user.name;
    const colour = user.colour;
    const retired = user.retired;
    const id = user._id;
    return { name, colour, retired, id, count: 0 };
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
          totalAppearance[player] = 1;
        } else {
          totalAppearance[player] += 1;
        }
      });
    }
  });

  const playersActiveOrWinners = allPlayers
    .filter(player => {
      if (player.retired) {
        if (!playerTotalWins[player.id]) {
          return false;
        }
      }
      return true;
    })
    .map(player => {
      let count = 0;
      for (let key in totalAppearance) {
        if (player.id === key) count = totalAppearance[key];
      }

      return { ...player, count };
    });

  if (currentYearWinners.length === 0) return null;
  const totalWins = currentYearWinners.length;

  // playersActiveOrWinners.sort((a, b) => b.count - a.count);

  const series = playersActiveOrWinners
    .filter(player => player.count > 0)
    .map(player => ((player.count / totalWins) * 100).toFixed(2));

  const colors = playersActiveOrWinners
    .filter(player => player.count > 0)
    .map(player => player.colour);
  // console.log('totalAppearance', totalAppearance);
  // series.push(50);
  // colors.push('#b10dc9');
  // playersActiveOrWinners.push({
  //   name: 'Vaughn',
  //   colour: '#b10dc9',
  //   count: 3,
  //   id: 123
  // });

  const options = {
    chart: {
      events: {
        dataPointSelection: (event, chartContext, config) => {
          const index = config.dataPointIndex;
          const player = config.w.config.labels[index];
          setSelectedPlayer(player);
        }
      }
    },
    plotOptions: {
      radialBar: {
        offsetY: -18,
        offsetX: -1,
        startAngle: 0,
        endAngle: 270,
        hollow: {
          size: '10%',
          background: 'transparent'
        },
        dataLabels: {
          name: {
            show: false
          },
          value: {
            show: false
          }
        }
      }
    },
    colors,
    labels: playersActiveOrWinners
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '180px',
        height: '180px',
        margin: 'auto'
      }}
    >
      <div style={{ position: 'absolute', zIndex: '2', cursor: 'pointer' }}>
        <Chart
          options={options}
          series={series}
          type="radialBar"
          height={273}
        />
      </div>
      <div
        style={{
          borderRadius: '50%',
          borderWidth: '78px',
          borderStyle: 'solid',
          borderColor: 'transparent bisque bisque',
          transform: 'rotate(-45deg)',
          width: '24px',
          height: '24px',
          position: 'absolute'
        }}
      ></div>
      <div
        style={{
          borderBottom: '5px solid bisque',
          width: '78px',
          position: 'absolute',
          top: '87px'
        }}
      ></div>
      <div
        style={{
          borderRight: '5px solid bisque',
          height: '78px',
          position: 'absolute',
          left: '87px'
        }}
      ></div>
      <Button
        onClick={() => {
          setSelectedPlayer(null);
        }}
        style={{
          width: '73px',
          height: '73px',
          float: 'left',
          borderRadius: '50%',
          display: 'block',
          justifyContent: 'center',
          alignItems: 'center',
          border: '3px solid #EAEAEA',
          zIndex: 10,
          background: selectedPlayer ? selectedPlayer.colour : 'transparent'
        }}
      >
        <Typography
          variant="subtitle1"
          style={{
            color: '#EAEAEA',
            fontWeight: '100',
            fontSize: '2rem',
            flex: '0'
          }}
        >
          {selectedPlayer ? selectedPlayer.count : currentYearWinners.length}
        </Typography>
        <Typography
          variant="body2"
          style={{
            color: '#EAEAEA',
            fontWeight: '100',
            fontSize: '9px',
            textTransform: 'none',
            marginTop: !selectedPlayer ? '-15px' : '-15px'
          }}
        >
          {!selectedPlayer
            ? currentYearWinners.length > 1
              ? `Rounds`
              : 'Round'
            : 'Plays'}
        </Typography>
      </Button>
    </div>
  );
};

export default RadialChart;
