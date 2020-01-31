import React, { useState } from 'react';
import Chart from 'react-gauge-chart';
import { Typography } from '@material-ui/core';

const NUMBER_OF_LEVELS = 20;

const resetGauge = async (percent, setFakePercent) => {
  setFakePercent(-percent);
  setTimeout(() => {
    setFakePercent(0);
  }, 0);
};

const GaugeChart = ({ allAwards }) => {
  const [fakePercent, setFakePercent] = useState(0);

  const { userAwards, totalAwards } = allAwards;
  const percent = Number((userAwards / totalAwards).toFixed(2)) + fakePercent;
  const chartStyle = { height: 140 };
  const textColor = '#dedede';
  let needleColor = '#d3000e';

  if (percent > 0 && percent <= 0.12) needleColor = '#faa900';
  else if (percent > 0.12 && percent <= 0.25) needleColor = '#f69000';
  else if (percent > 0.25 && percent <= 0.37) needleColor = '#f17800';
  else if (percent > 0.37 && percent <= 0.5) needleColor = '#ec6200';
  else if (percent > 0.5 && percent <= 0.62) needleColor = '#e64100';
  else if (percent > 0.62 && percent <= 0.75) needleColor = '#e12c00';
  else if (percent > 0.75 && percent <= 0.87) needleColor = '#dc1800';

  return (
    <div
      onClick={() => resetGauge(percent, setFakePercent)}
      style={{
        height: '110px',
        marginBottom: '24px',
        position: 'relative',
        paddingBottom: '35px'
      }}
    >
      <div style={{ position: 'absolute', zIndex: '1' }}>
        <Chart
          id="gauge-chart"
          style={chartStyle}
          nrOfLevels={NUMBER_OF_LEVELS}
          percent={percent}
          cornerRadius={3}
          formatTextValue={value => `${(percent * 100).toFixed(0)}%`}
          textColor={textColor}
          needleColor={needleColor}
          needleBaseColor={needleColor}
          arcWidth={0.3}
          arcPadding={0.02}
          animDelay={0}
          // colors={['#ffd000', '#db0404']}
          // colors={['#8bba13', '#db0404']}
          // colors={['#2c13ba', '#db0404']}
          // colors={['#1382ba', '#db0404']}
          // colors={['#ba1613', '#13ba13']}
          // colors={['#50ba13', '#ba1613']}
          colors={['#ffc200', '#d3000e']}
        />
      </div>
      <div
        style={{
          height: '110px',
          width: '220px',
          borderRadius: '110px 110px 0px 0px',
          background: '#40100ae6',
          position: 'absolute',
          zIndex: '0',
          left: '0',
          right: '0',
          margin: 'auto',
          top: '2px',
          border: '3px solid #dedede'
        }}
      ></div>
      <Typography
        style={{
          fontWeight: '100',
          color: '#EAEAEA',
          textAlign: 'center',
          position: 'absolute',
          left: '0',
          right: '0',
          bottom: '0'
        }}
      >
        Achievements Unlocked
      </Typography>
    </div>
  );
};

export default GaugeChart;
