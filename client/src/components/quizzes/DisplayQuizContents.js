import React from 'react';
import { Typography, List, ListItem, Grid } from '@material-ui/core';

const textContentStyle = { paddingLeft: '4px', width: '90%' };

const DisplayQuizContents = ({ quiz }) => {
  const isFirefoxBrowser = typeof InstallTrigger !== 'undefined';

  if (!quiz || quiz.length === 0) {
    return (
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        style={{
          maxWidth: '700px',
          width: '90%',
          backgroundColor: '#fffaf0',
          background:
            'repeating-linear-gradient(#fffaf0, white 19px, #9198e5 20px, #9198e5 16px)',
          backgroundPosition: `0px ${isFirefoxBrowser ? '0px' : '16px'}`
        }}
      >
        <Typography
          variant="h6"
          style={{
            fontFamily: 'cursive',
            textDecoration: 'underline',
            width: '90%',
            lineHeight: '20px',
            padding: '16px 0 22px 4px',
            marginLeft: '66px',
            borderLeft: '1px solid pink'
          }}
        >
          Nothing to show
        </Typography>
        <Typography
          style={{
            margin: 'auto',
            padding: '0 12px 20px 4px',
            maxWidth: '90%',
            marginLeft: '66px',
            borderLeft: '1px solid pink'
          }}
        >
          This quiz has no questions to display. You can add questions by
          editing this quiz, or by creating another.
        </Typography>
      </Grid>
    );
  }

  const { group, content: contents } = quiz[0];
  const questionsOver100 = contents.length > 99;

  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
      style={{
        marginBottom: '40px',
        maxWidth: '700px',
        width: '90%',
        backgroundColor: '#fffaf0',
        background:
          'repeating-linear-gradient(#fffaf0, white 19px, #9198e5 20px, #9198e5 16px)',
        backgroundPosition: `0px ${isFirefoxBrowser ? '0px' : '16px'}`,
        filter: 'drop-shadow(2px 2px 6px black)'
      }}
    >
      <Typography
        variant="h6"
        style={{
          padding: '10px 12px 0px',
          color: 'transparent'
        }}
      >
        Sneak
      </Typography>
      <List
        style={{
          margin: `${isFirefoxBrowser ? '-40px' : '-42px'} 0px 0px`,
          width: '100%',
          maxWidth: '700px',
          padding: '0px'
        }}
      >
        {[{ first: 'first' }, ...contents, { last: 'last' }].map(
          (content, i) => {
            if (content.first)
              return (
                <ListItem
                  key={content.first}
                  style={{ padding: '0px 12px 0 0' }}
                >
                  <div style={{ display: 'block', width: '100%' }}>
                    <div style={{ display: 'flex' }}>
                      <div
                        style={{ width: '66px', borderRight: '1px solid pink' }}
                      >
                        <Typography
                          style={{
                            fontWeight: '500',
                            paddingRight: '6px',
                            width: questionsOver100 ? '60px' : '90%',
                            textAlign: 'end',
                            height: '58px',
                            color: 'transparent',
                            lineHeight: '1.43'
                          }}
                        >
                          {`Q${i}:`}
                        </Typography>
                      </div>
                      <Typography
                        variant="h6"
                        style={{
                          fontFamily: 'cursive',
                          textDecoration: 'underline',
                          width: '90%',
                          lineHeight: '20px',
                          padding: '16px 0 0 4px'
                        }}
                      >
                        {group.title}
                      </Typography>
                    </div>
                  </div>
                </ListItem>
              );

            if (content.last) {
              return (
                <ListItem
                  key={content.last}
                  style={{ padding: '0px 12px 0 0' }}
                >
                  <div style={{ display: 'block', width: '100%' }}>
                    <div style={{ display: 'flex' }}>
                      <div
                        style={{ width: '66px', borderRight: '1px solid pink' }}
                      >
                        <Typography
                          style={{
                            fontWeight: '500',
                            paddingRight: '6px',
                            width: questionsOver100 ? '60px' : '90%',
                            textAlign: 'end',
                            color: 'transparent',
                            lineHeight: '1.43'
                          }}
                        >
                          {`Q${i}:`}
                        </Typography>
                      </div>
                      <Typography
                        style={{
                          width: '90%',
                          padding: '0px 0 0 4px',
                          color: 'transparent',
                          lineHeight: '1.43'
                        }}
                      >
                        sneak
                      </Typography>
                    </div>
                  </div>
                </ListItem>
              );
            }

            return (
              <ListItem key={content._id} style={{ padding: '0px 12px 0 0' }}>
                <div style={{ display: 'block', width: '100%' }}>
                  <div style={{ display: 'flex' }}>
                    <div
                      style={{ width: '66px', borderRight: '1px solid pink' }}
                    >
                      <Typography
                        style={{
                          fontWeight: '500',
                          paddingRight: '6px',
                          width: questionsOver100 ? '60px' : '90%',
                          textAlign: 'end',
                          lineHeight: '1.43'
                        }}
                      >
                        {`Q${i}:`}
                      </Typography>
                    </div>
                    <Typography
                      style={{ ...textContentStyle, lineHeight: '1.43' }}
                    >{`${content.question}`}</Typography>
                  </div>
                  <div style={{ display: 'flex' }}>
                    <div
                      style={{ width: '66px', borderRight: '1px solid pink' }}
                    >
                      <Typography
                        style={{
                          fontWeight: '400',
                          paddingRight: '6px',
                          width: questionsOver100 ? '60px' : '90%',
                          textAlign: 'end',
                          lineHeight: '1.43'
                        }}
                      >
                        A:
                      </Typography>
                    </div>
                    <Typography
                      style={{
                        ...textContentStyle,
                        fontWeight: '100',
                        lineHeight: '1.43'
                      }}
                    >{`${content.answer}`}</Typography>
                  </div>
                </div>
              </ListItem>
            );
          }
        )}
      </List>
    </Grid>
  );
};

export default DisplayQuizContents;
