import React, { Component } from 'react';
import { connect } from 'react-redux';

import './Tooltip.css';
import { Typography } from '@material-ui/core';

class Tooltip extends Component {
  render() {
    const { tooltip } = this.props;

    if (!tooltip) return null;

    return (
      <div style={{ position: 'absolute' }}>
        <div
          className="tooltip"
          style={{
            top: `calc(${tooltip.positionY}px - 35px)`,
            left: `calc(${tooltip.positionX}px - 32px)`,
            backgroundColor: tooltip.colour
          }}
        >
          <Typography className="tooltip-text">{tooltip.content}</Typography>
        </div>
        <span
          className="arrow"
          style={{
            borderTop: `10px solid ${tooltip.colour}`,
            top: `calc(${tooltip.positionY}px - 26px)`,
            left: `calc(${tooltip.positionX}px - 32px)`
          }}
        />
      </div>
    );
  }
}

function mapStateToProps({ app }) {
  return { tooltip: app.tooltip };
}

export default connect(mapStateToProps)(Tooltip);
