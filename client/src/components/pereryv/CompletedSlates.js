import React from 'react';

import { sortByCreatedDate } from '../../utils/utility';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

class CompletedSlates extends React.Component {
  sortSlates = slates =>
    slates.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));

  render() {
    const { slates } = this.props;

    if (!slates.length) return null;

    return (
      <div>
        {sortByCreatedDate(slates, false).map(slate => {
          if (!slate.completed) return null;

          return (
            <Grid
              key={slate._id}
              container
              direction="column"
              justify="center"
              alignItems="center"
              style={{
                marginBottom: '4px',
                background: '#dedede',
                borderRadius: '8px',
                width: '230px'
              }}
            >
              <Typography
                style={{ color: '#581845' }}
              >{`${slate.name}`}</Typography>
              <Typography
                style={{
                  color: '#581845b3'
                }}
              >{`Created: ${
                slate.createdDate.toString().split('T')[0]
              }`}</Typography>
            </Grid>
          );
        })}
      </div>
    );
  }
}

export default CompletedSlates;
