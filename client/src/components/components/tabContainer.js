import React from 'react';

import Typography from '@material-ui/core/Typography';

export default function TabContainer(props) {
  return (
    <Typography
      component="div"
      style={{ padding: props.padding ? props.padding : '', paddingTop: '0px' }}
    >
      {props.children}
    </Typography>
  );
}
