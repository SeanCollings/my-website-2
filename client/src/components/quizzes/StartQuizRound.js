import React, { useState, useEffect } from 'react';
import MiniLoader from 'react-loader-spinner';
import { Typography, Grid, Button } from '@material-ui/core';

import './StartQuizRound.css';

const nextButtonStyle = {
  background: 'pink',
  color: '#581845',
  border: '1px solid #fffaf0',
  height: '52px',
  width: '105px'
};

const getPunchHoleLeft = Math.random() * (7 - 3) + 3;
const getPunchHoleTop = Math.random() * (51 - 26) + 26;
const getFirefoxBrowser = typeof InstallTrigger !== 'undefined';

const PreviousButton = ({ previousQuestion, disable }) => (
  <Button
    disabled={disable}
    onClick={previousQuestion}
    style={{
      ...nextButtonStyle,
      opacity: disable ? '0.6' : '1',
      marginRight: '24px'
    }}
  >
    Back
  </Button>
);

const NextButton = ({ nextQuestion, disable }) => (
  <Button
    disabled={disable}
    onClick={nextQuestion}
    style={{
      ...nextButtonStyle,
      opacity: disable ? '0.6' : '1'
    }}
  >
    Next
  </Button>
);

const StartQuizRound = ({
  nextQuestion,
  previousQuestion,
  randomContent,
  completed,
  allRoundQuestions,
  completedQuestions
}) => {
  const [showFront, setShowFront] = useState(true);
  const [quickTransition, setQuickTransition] = useState(false);
  const [hideContent, setHideContent] = useState(false);
  const [punchHoleLeft] = useState(getPunchHoleLeft);
  const [punchHoleTop] = useState(getPunchHoleTop);
  const [isBrowserFirefox] = useState(getFirefoxBrowser);

  useEffect(() => {
    setHideContent(false);
  }, [randomContent]);

  if (!randomContent || (randomContent && !randomContent.content))
    return (
      <Grid container direction="column" justify="center" alignItems="center">
        <Typography style={{ color: '#DEDEDE', marginTop: '12px' }}>
          Loading content...
        </Typography>
        <div style={{ marginTop: '12px' }}>
          <MiniLoader type="ThreeDots" color="#fffaf0" height={60} width={60} />
        </div>
      </Grid>
    );

  const handleNextQuestionClick = () => {
    setHideContent(true);
    nextQuestion(randomContent._id);
    setShowFront(true);
    setQuickTransition(true);
  };

  const handlePreviousQuestionClick = () => {
    previousQuestion();
    setShowFront(true);
    setQuickTransition(true);
  };

  const handleCardClick = () => {
    setQuickTransition(false);
    setShowFront(!showFront);
  };

  const {
    content: { question, answer },
    name
  } = randomContent;

  const questionContent = `${hideContent ? 'refreshing...' : question}`;
  const answerContent = `${hideContent ? '' : answer}`;
  const userName = name && !hideContent ? `- ${name}` : '';

  return (
    <Grid container direction="column" justify="center" alignItems="center">
      <Typography
        style={{ color: '#dedede', marginTop: '12px' }}
      >{`Question: ${completed}/${allRoundQuestions}`}</Typography>
      <div className="line" style={{ marginTop: '12px' }}></div>

      <div className={`scene scene--card no-select`} onClick={handleCardClick}>
        <div
          className={`card no-select`}
          style={{
            transition: `transform ${quickTransition ? '0s' : '0.6s'}`,
            WebkitTransition: `transform ${quickTransition ? '0s' : '0.6s'}`,
            transform: !showFront ? 'rotateY(180deg)' : ''
          }}
        >
          <div
            className="card__face card__face--front no-select"
            style={{
              background:
                'repeating-linear-gradient(#fffaf0, white 24px, #9198e5 26px, #9198e5 16px)',
              backgroundPosition: '0px 13px',
              overflow: 'auto',
              backfaceVisibility: isBrowserFirefox ? 'hidden' : ''
            }}
          >
            <div className="card-content-container">
              <div className="left-margin">.</div>
              <div className="right-margin">.</div>
              <div
                className="punch-hole"
                style={{ left: `${punchHoleLeft}%`, top: `${punchHoleTop}%` }}
              ></div>
              <div style={{ display: 'block', width: '85%' }}>
                <div style={{ display: 'flex' }}>
                  <Typography
                    variant={'h5'}
                    className="card-title"
                    style={{ fontSize: '26px' }}
                  >
                    Question:
                  </Typography>
                  <Typography
                    variant={'h6'}
                    style={{
                      fontSize: '22px',
                      textDecoration: 'underline',
                      position: 'absolute',
                      right: '16%',
                      transform: 'rotateY(-180deg)',
                      opacity: '0.1',
                      paddingTop: '12px'
                    }}
                  >
                    Answer:
                  </Typography>
                </div>
                <Typography
                  className="card-content"
                  style={{ fontSize: '16px', lineHeight: '1.63' }}
                >
                  {questionContent}
                </Typography>
                <Typography
                  style={{
                    position: 'absolute',
                    right: '0',
                    float: 'right',
                    bottom: '3px',
                    width: '25%',
                    fontWeight: '100',
                    fontStyle: 'italic'
                  }}
                >
                  {userName}
                </Typography>
              </div>
            </div>
          </div>

          <div
            className="card__face card__face--back no-select"
            style={{
              width: '100%',
              position: 'absolute',
              transform: 'rotateY(180deg)',
              background:
                'repeating-linear-gradient(#fffaf0, white 24px, #9198e5 26px, #9198e5 16px)',
              backgroundPosition: '0px 13px',
              overflow: 'auto',
              backfaceVisibility: isBrowserFirefox ? 'hidden' : ''
            }}
          >
            <div className="card-content-container">
              <div className="left-margin">.</div>
              <div className="right-margin">.</div>
              <div
                className="punch-hole"
                style={{ right: `${punchHoleLeft}%`, top: `${punchHoleTop}%` }}
              ></div>
              <div style={{ display: 'block', width: '85%' }}>
                <div style={{ display: 'flex' }}>
                  <Typography
                    variant={'h6'}
                    className="card-title"
                    style={{
                      paddingTop: '12px',
                      fontSize: '22px'
                    }}
                  >
                    Answer:
                  </Typography>
                  <Typography
                    variant={'h5'}
                    style={{
                      fontSize: '26px',
                      textDecoration: 'underline',
                      position: 'absolute',
                      right: '16%',
                      transform: 'rotateY(-180deg)',
                      opacity: '0.1',
                      paddingTop: '10px'
                    }}
                  >
                    Question:
                  </Typography>
                </div>
                <Typography
                  className="card-content"
                  style={{
                    fontSize: '16px',
                    lineHeight: '1.63',
                    paddingTop: '22px'
                  }}
                >
                  {answerContent}
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="line" style={{ marginBottom: '24px' }}></div>
      <div style={{ display: 'flex' }}>
        <PreviousButton
          previousQuestion={handlePreviousQuestionClick}
          disable={completedQuestions < 1}
        />
        <NextButton
          nextQuestion={handleNextQuestionClick}
          disable={hideContent}
        />
      </div>
    </Grid>
  );
};

export default StartQuizRound;
