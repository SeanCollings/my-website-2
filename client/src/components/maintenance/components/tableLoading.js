import React from 'react';

import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';

export default () => {
  return (
    <TableBody>
      <TableRow />
      <TableRow />
      <TableRow style={{ width: '100%', verticalAlign: 'bottom' }}>
        <td align="center" colSpan="4">
          Loading data...
        </td>
      </TableRow>
      <TableRow />
      <TableRow />
    </TableBody>
  );
};
