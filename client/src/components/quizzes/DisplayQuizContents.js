import React from 'react';
import { Typography, Grid } from '@material-ui/core';
import DownloadIcon from '@material-ui/icons/CloudDownload';

const textContentStyle = { paddingLeft: '4px', width: '90%' };

const downloadQuiz = quiz => {
  if (quiz && quiz.length > 0) {
    const content = quiz[0].content.map(c => {
      const endsInQuestionMark =
        c.question.charAt(c.question.length - 1) === '?';

      return `${c.question.trim()}${
        endsInQuestionMark ? '' : '?'
      } ${c.answer.trim()}\n`;
    });

    const element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(content.join(''))
    );
    element.setAttribute('download', quiz[0].group.title);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }
};

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
            textDecoration: 'underline',
            width: '90%',
            lineHeight: `20px`,
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
      <ul
        style={{
          margin: `${isFirefoxBrowser ? '-40px' : '-42px'} 0px 0px`,
          width: '100%',
          maxWidth: '700px',
          padding: '1px 0px 0px 0px',
          listStyle: 'none'
        }}
      >
        {[
          { first: 'first' },
          { second: 'second' },
          ...contents,
          { last: 'last' }
        ].map((content, i) => {
          if (content.first)
            return (
              <li
                key={content.first}
                style={{
                  padding: '0px 12px 0 0',
                  background:
                    'repeating-linear-gradient(#fffaf0, white 24px, #9198e5 26px, #9198e5 26px)',
                  backgroundPosition: '0px 22px'
                }}
              >
                <div style={{ display: 'block', width: '100%' }}>
                  <div style={{ display: 'flex', height: '49px' }}>
                    <DownloadIcon
                      onClick={() => downloadQuiz(quiz)}
                      style={{
                        position: 'absolute',
                        left: '16px',
                        top: '28px',
                        color: '#777777b3',
                        cursor: 'pointer'
                      }}
                    />
                    <div
                      style={{
                        width: '66px',
                        borderRight: '1px solid pink',
                        height: '70px'
                      }}
                    >
                      <Typography
                        style={{
                          fontWeight: '500',
                          paddingRight: '6px',
                          width: questionsOver100 ? '60px' : '90%',
                          textAlign: 'end',
                          height: '58px',
                          color: 'transparent',
                          lineHeight: `20px`,
                          fontSize: '0.875rem'
                        }}
                      >
                        {`Q${i}:`}
                      </Typography>
                    </div>
                    <Typography
                      variant="h6"
                      style={{
                        textDecoration: 'underline',
                        width: '90%',
                        lineHeight: `20px`,
                        padding: '28px 0 0 4px'
                      }}
                    >
                      {group.title}
                    </Typography>
                  </div>
                </div>
              </li>
            );

          if (content.second) {
            return (
              <li
                key={content.second}
                style={{
                  padding: '0px 12px 0 0',
                  background:
                    'repeating-linear-gradient(#fffaf0, white 19px, #9198e5 20px, #9198e5 20px)'
                }}
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
                          lineHeight: `20px`,
                          fontSize: '0.875rem'
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
                        lineHeight: `20px`,
                        fontSize: '0.875rem'
                      }}
                    >
                      sneak
                    </Typography>
                  </div>
                </div>
              </li>
            );
          }

          if (content.last) {
            return (
              <li
                key={content.last}
                style={{
                  padding: '0px 12px 0 0',
                  background:
                    'repeating-linear-gradient(#fffaf0, white 19px, #9198e5 20px, #9198e5 20px)'
                }}
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
                          lineHeight: `20px`,
                          fontSize: '0.875rem'
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
                        lineHeight: `20px`,
                        fontSize: '0.875rem'
                      }}
                    >
                      sneak
                    </Typography>
                  </div>
                </div>
              </li>
            );
          }

          return (
            <li
              key={content._id}
              style={{
                padding: '0px 12px 0 0',
                background:
                  'repeating-linear-gradient(#fffaf0, white 19px, #9198e5 20px, #9198e5 20px)'
              }}
            >
              <div style={{ display: 'block', width: '100%' }}>
                <div style={{ display: 'flex' }}>
                  <div style={{ width: '66px', borderRight: '1px solid pink' }}>
                    <Typography
                      style={{
                        fontWeight: '500',
                        padding: '3px 6px 0px 0px',
                        width: questionsOver100 ? '60px' : '90%',
                        textAlign: 'end',
                        lineHeight: `20px`,
                        fontSize: '14px'
                      }}
                    >
                      {`Q${i - 1}:`}
                    </Typography>
                  </div>
                  <Typography
                    style={{
                      ...textContentStyle,
                      lineHeight: `20px`,
                      fontSize: '14px',
                      fontWeight: '500',
                      paddingTop: '3px'
                    }}
                  >{`${content.question}`}</Typography>
                </div>
                <div style={{ display: 'flex' }}>
                  <div style={{ width: '66px', borderRight: '1px solid pink' }}>
                    <Typography
                      style={{
                        fontWeight: '300',
                        paddingRight: '6px',
                        width: questionsOver100 ? '60px' : '90%',
                        textAlign: 'end',
                        lineHeight: `20px`,
                        fontSize: '14px'
                      }}
                    >
                      A:
                    </Typography>
                  </div>
                  <Typography
                    style={{
                      ...textContentStyle,
                      fontWeight: '100',
                      lineHeight: `20px`,
                      fontSize: '14px'
                    }}
                  >{`${content.answer}`}</Typography>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </Grid>
  );
};

export default DisplayQuizContents;
