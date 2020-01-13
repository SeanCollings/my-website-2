import React, { Fragment } from 'react';

import { sortByCreatedDate } from '../../utils/utility';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import MoreIcon from '@material-ui/icons/ExpandMore';

import './CompletedSlates.css';

class CompletedSlates extends React.Component {
  state = { showMoreSlates: [] };

  sortSlates = slates =>
    slates.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));

  handleSlateClick = id => {
    const { showMoreSlates } = this.state;
    const newState = [...showMoreSlates];

    const index = newState.indexOf(id);
    if (index > -1) newState.splice(index, 1);
    else newState.push(id);

    this.setState({ showMoreSlates: newState });
  };

  render() {
    const { slates } = this.props;
    const { showMoreSlates } = this.state;

    if (!slates.length) return null;

    return (
      <div style={{ marginBottom: '24px' }}>
        {sortByCreatedDate(slates, false).map(slate => {
          if (!slate.completed) return null;

          const showMore = showMoreSlates.includes(slate._id);

          return (
            <Grid
              className={`no-select slate-details`}
              key={slate._id}
              container
              direction="column"
              justify="center"
              alignItems="center"
              style={{ width: '230px' }}
              onClick={() => this.handleSlateClick(slate._id)}
            >
              <Typography
                style={{
                  color: '#581845',
                  borderBottom: showMore ? '1px solid #581845b3' : ''
                }}
              >{`${slate.name}`}</Typography>
              {showMore && (
                <Fragment>
                  <Typography
                    style={{
                      color: '#581845cc'
                    }}
                  >{`Members: ${slate.members.length}`}</Typography>
                  <Typography
                    style={{
                      color: '#581845cc'
                    }}
                  >{`Completed: ${
                    slate.completedDate.toString().split('T')[0]
                  }`}</Typography>
                </Fragment>
              )}
              <Typography
                style={{
                  color: '#581845b3'
                }}
              >{`Created: ${
                slate.createdDate.toString().split('T')[0]
              }`}</Typography>
              <MoreIcon
                className={`more-icon ${showMore ? 'open' : 'closed'}`}
                style={{
                  height: '20px'
                }}
              />
            </Grid>
          );
        })}
      </div>
    );
  }
}

export default CompletedSlates;
