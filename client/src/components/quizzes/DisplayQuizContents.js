import React from 'react';
import { Typography, List, ListItem, Grid } from '@material-ui/core';

const DisplayQuizContents = ({ quiz }) => {
  if (!quiz || quiz.length === 0) {
    return (
      <Grid container direction="column" justify="center" alignItems="center">
        <Typography
          style={{
            color: '#DEDEDE',
            margin: 'auto',
            padding: '0 12px 12px',
            maxWidth: '90%'
          }}
        >
          This quiz has no questions to display. You can add questions by
          editing this quiz, or by creating another.
        </Typography>
      </Grid>
    );
  }

  const { group, content: contents } = quiz[0];

  return (
    <Grid container direction="column" justify="center" alignItems="center">
      <Typography
        variant="h6"
        style={{ marginBottom: '12px', color: '#dedede' }}
      >
        {group.title}
      </Typography>
      <List
        style={{
          padding: '22px 0px',
          backgroundColor: '#fffaf0',
          background:
            'repeating-linear-gradient(#fffaf0, white 18px, #9198e5 20px, #9198e5 16px)',
          width: '90%',
          maxWidth: '700px'
        }}
      >
        {contents.map((content, i) => {
          return (
            <ListItem key={content._id} style={{ padding: '0px 8px' }}>
              <div style={{ display: 'block', width: '100%' }}>
                <div style={{ display: 'flex' }}>
                  <Typography
                    style={{
                      fontWeight: '500',
                      paddingRight: '6px',
                      borderRight: '1px solid pink',
                      width: '35px',
                      textAlign: 'end'
                    }}
                  >
                    {`Q${i + 1}:`}
                  </Typography>
                  <Typography
                    style={{ paddingLeft: '4px' }}
                  >{`${content.question}`}</Typography>
                </div>
                <div style={{ display: 'flex' }}>
                  <Typography
                    style={{
                      fontWeight: '500',
                      paddingRight: '6px',
                      borderRight: '1px solid pink',
                      width: '35px',
                      textAlign: 'end'
                    }}
                  >
                    A:
                  </Typography>
                  <Typography
                    style={{ fontWeight: '100', paddingLeft: '4px' }}
                  >{`${content.answer}`}</Typography>
                </div>
              </div>
            </ListItem>
          );
        })}
      </List>
    </Grid>
  );
};

export default DisplayQuizContents;
