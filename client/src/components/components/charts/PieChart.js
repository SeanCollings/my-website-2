import React, { useState } from 'react';
import Chart from 'react-minimal-pie-chart';
import Typography from '@material-ui/core/Typography';

const label = usePercentage => props => {
  const key = props.key.split('-')[1];

  if (props.data && props.data[key] && props.data[key].title.length > 0) {
    if (usePercentage) {
      const percentage = props.data[key].percentage;
      const unit = percentage >= 1 ? '%' : '';

      return `${percentage.toFixed(0)}${unit}`;
      // .replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/, '$1')}
    }
    return props.data[key].title.charAt(0).toUpperCase();
  }

  return '!';
};

const handleClick = (usePercentage, setUsePercentage) => (
  event,
  data,
  dataIndex
) => {
  setUsePercentage(!usePercentage);
};

const PieChart = ({ winners, selectedYear }) => {
  const [usePercentage, setUsePercentage] = useState(false);

  if (!winners || !winners.winners) return null;

  const tallyPlayers = {};
  const currentYearWinners = winners.winners.filter(
    winner => winner.year === selectedYear
  );

  currentYearWinners.forEach(winner => {
    const id = winner._winner._id;
    const title = winner._winner.name;
    const color = winner._winner.colour;

    if (!tallyPlayers[id]) {
      tallyPlayers[id] = { value: 1, color, title };
    } else {
      tallyPlayers[id].value += 1;
    }
  });

  const data = Object.values(tallyPlayers).sort((a, b) =>
    a.title.localeCompare(b.title)
  );

  return (
    <div
      style={{
        position: 'relative',
        width: '180px',
        height: '180px',
        margin: 'auto'
      }}
    >
      <div
        style={{
          position: 'absolute',
          zIndex: '2',
          cursor: 'pointer'
        }}
      >
        <Chart
          data={data}
          animate
          animationDuration={500}
          animationEasing="ease-out"
          lengthAngle={360}
          startAngle={270}
          radius={49}
          // paddingAngle={data.length > 1 ? 0 : 1}
          paddingAngle={1}
          lineWidth={40}
          // rounded
          label={label(usePercentage)}
          labelPosition={usePercentage ? 81 : 80}
          labelStyle={{
            fontFamily: 'sans-serif',
            fontSize: usePercentage ? '7px' : '8px',
            fill: '#EAEAEA'
          }}
          // viewBoxSize={[110, 110]}
          onClick={handleClick(usePercentage, setUsePercentage)}
        />
      </div>
      <div
        style={{
          borderRadius: '50%',
          border: 'solid 40px #EAEAEA',
          width: '100px',
          height: '100px',
          position: 'absolute'
        }}
      >
        <Typography
          variant="subtitle1"
          style={{
            position: 'relative',
            top: '40px',
            color: '#EAEAEA',
            lineHeight: '0.8',
            fontWeight: '100',
            fontSize: '2rem',
            textAlign: 'center'
          }}
        >
          {currentYearWinners.length}
        </Typography>
      </div>
    </div>
  );
};

export default PieChart;
