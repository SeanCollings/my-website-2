import React, { useState, Fragment } from 'react';

import ConfirmActionModal from '../modals/ConfirmActionModal';
import { MAX_QUESTION_LENGTH, MAX_ANSWER_LENGTH } from '../../utils/constants';
import './NewQuiz.css';

import { Grid, Button, ListItem, List, Typography } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/DeleteForever';
import UpdateIcon from '@material-ui/icons/Create';
import CloseIcon from '@material-ui/icons/Close';
import ConfirmIcon from '@material-ui/icons/Done';
import UnselectedIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import SelectedIcon from '@material-ui/icons/CheckBox';
import LockClosedIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen';

const buttonStyle = {
  background: '#0055dd',
  color: '#DEDEDE',
  border: '1px solid #DEDEDE'
};
const inputDivContainer = {
  width: '100%',
  marginBottom: '8px',
  display: 'flex'
};

const handleTitleChange = (setQuizTitle, updateQuizSignature) => e => {
  const text = e.target.value;
  const match = /\r|\n/.exec(text);

  if (match && match.length) e.preventDefault();
  else {
    setQuizTitle(text);
    updateQuizSignature(text);
  }
};

const handleQuestionChange = setQuizQuestion => e => {
  const text = e.target.value;
  const match = /\r|\n/.exec(text);

  if (!match || (match && match.index !== 0)) setQuizQuestion(text);
};

const handleAnswerChange = setQuizAnswer => e => {
  const text = e.target.value;
  setQuizAnswer(text);
};

const renderQuestionAnswers = (
  allQuestionsAnswers,
  toDeleteArrayQA,
  toggleDeleteQA,
  updateQuestionAnswer,
  updateQA,
  setUpdateQA,
  enableUpdate,
  deleting
) => {
  if (!allQuestionsAnswers.length) {
    return (
      <Typography style={{ padding: '12px 20px' }}>
        Add some questions...
      </Typography>
    );
  }

  return allQuestionsAnswers.map((content, i) => {
    const originalQuestion = content.question;
    const originalAnswer = content.answer;

    return (
      <ListItem
        key={i}
        style={{
          padding: '4px 12px 2px 12px',
          display: 'flex',
          borderBottom:
            allQuestionsAnswers.length !== i + 1 ? '1px dotted #dedede' : ''
        }}
      >
        <div style={{ display: 'block', width: '100%' }}>
          <div style={{ display: 'flex' }}>
            <Typography style={{ fontWeight: '500', paddingRight: '6px' }}>
              Q:
            </Typography>
            {updateQA.includes(i) && (
              <textarea
                className="update-textarea"
                defaultValue={content.question}
                onChange={updateQuestionAnswer(i, true, null, originalAnswer)}
                maxLength={MAX_QUESTION_LENGTH}
              ></textarea>
            )}
            {!updateQA.includes(i) && (
              <Typography>{`${content.question}`}</Typography>
            )}
          </div>
          <div style={{ display: 'flex' }}>
            <Typography style={{ fontWeight: '500', paddingRight: '6px' }}>
              A:
            </Typography>
            {updateQA.includes(i) && (
              <textarea
                className="update-textarea"
                defaultValue={content.answer}
                onChange={updateQuestionAnswer(i, true, originalQuestion, null)}
                maxLength={MAX_ANSWER_LENGTH}
              ></textarea>
            )}
            {!updateQA.includes(i) && (
              <Typography
                style={{ fontWeight: '100' }}
              >{`${content.answer}`}</Typography>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', width: '55px' }}>
          {!updateQA.includes(i) && (
            <Fragment>
              <UpdateIcon
                className="icon"
                onClick={() =>
                  enableUpdate(i, originalQuestion, originalAnswer)
                }
              />
              {!toDeleteArrayQA.includes(i) && (
                <UnselectedIcon
                  className={`${
                    deleting ? 'remove-select' : 'remove-disabled'
                  }`}
                  onClick={() => toggleDeleteQA(i)}
                />
              )}
              {deleting && toDeleteArrayQA.includes(i) && (
                <SelectedIcon
                  className={`remove-select`}
                  onClick={() => toggleDeleteQA(i)}
                />
              )}
            </Fragment>
          )}
          {updateQA.includes(i) && (
            <Fragment>
              <ConfirmIcon
                className="icon"
                onClick={updateQuestionAnswer(i, false, null, originalQuestion)}
              />
              <CloseIcon
                className="icon-remove"
                onClick={() => setUpdateQA([])}
              />
            </Fragment>
          )}
        </div>
      </ListItem>
    );
  });
};

const NewQuiz = ({ updateNewQuiz, savingQuiz, editGroup }) => {
  let editTitle;
  let editAllQuestionAnswers;
  let editPublic = true;

  if (editGroup && editGroup.length > 0) {
    const { group, content } = editGroup[0];
    editTitle = group.title;
    editPublic = group.isPublic;
    editAllQuestionAnswers = content;
  }

  const [quizTitle, setQuizTitle] = useState(editTitle || '');
  const [quizQuestion, setQuizQuestion] = useState('');
  const [quizAnswer, setQuizAnswer] = useState('');
  const [updateQA, setUpdateQA] = useState([]);
  const [deleting, setDeleting] = useState(false);
  const [toDeleteArrayQA, setToDeleteArrayQA] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [temp, setTemp] = useState({ question: '', answer: '' });
  const [quizPublic, setQuizPublic] = useState(editPublic);
  const [allQuestionsAnswers, setAllQuestionsAnswers] = useState(
    editAllQuestionAnswers || []
  );

  const addQuestionClicked = () => {
    const newQuestionsAnswers = [...allQuestionsAnswers];

    if (quizQuestion.length && quizAnswer.length) {
      newQuestionsAnswers.push({
        question: quizQuestion,
        answer: quizAnswer
      });
      setAllQuestionsAnswers(newQuestionsAnswers);
      setQuizQuestion('');
      setQuizAnswer('');

      const questionInput = document.getElementById('quiz-question');
      if (questionInput) {
        questionInput.focus();
        questionInput.select();
      }

      setDeleting(false);
      updateQuizSignature(null, newQuestionsAnswers, null);
    }
  };

  const updateQuestionAnswer = (index, updating, question, answer) => e => {
    if (updating) {
      const tempContent = temp;
      const text = e.target.value;

      setTemp({
        question: question ? tempContent.question : text,
        answer: answer ? tempContent.answer : text
      });
    } else {
      const newQuestionsAnswers = [...allQuestionsAnswers];
      newQuestionsAnswers[index] = temp;
      setAllQuestionsAnswers(newQuestionsAnswers);
      setUpdateQA([]);
      updateQuizSignature(null, newQuestionsAnswers, null);
    }
  };

  const enableUpdate = (i, question, answer) => {
    setTemp({ question, answer });
    setUpdateQA([i]);
  };

  const toggleDeleteQA = i => {
    if (deleting) {
      const newArray = [...toDeleteArrayQA];

      const index = newArray.indexOf(i);
      if (index > -1) newArray.splice(index, 1);
      else newArray.push(i);

      setToDeleteArrayQA(newArray);
    }
  };

  const handleDeleteAllQA = () => {
    if (!deleting) setDeleting(true);
    else {
      if (toDeleteArrayQA.length > 0) {
        setShowModal(true);
      } else {
        setDeleting(false);
      }
    }
  };

  const deleteQuestionAnswers = () => {
    const newQuestionsAnswers = [...allQuestionsAnswers];
    const toDeleteIndices = [...toDeleteArrayQA];

    toDeleteIndices.sort((a, b) => b - a);

    for (let i = 0; i < toDeleteIndices.length; i++) {
      newQuestionsAnswers.splice(toDeleteIndices[i], 1);
    }

    setAllQuestionsAnswers(newQuestionsAnswers);
    updateQuizSignature(null, newQuestionsAnswers, null);

    setDeleting(false);
    setToDeleteArrayQA([]);
  };

  const handleQuizPublicClick = () => {
    setQuizPublic(!quizPublic);
    updateQuizSignature(null, null, !quizPublic);
  };

  const updateQuizSignature = (title, contents, isPublic) => {
    updateNewQuiz({
      title: title || quizTitle,
      contents: contents || allQuestionsAnswers,
      isPublic: isPublic !== null ? isPublic : quizPublic
    });
  };

  return (
    <div className="quiz-container">
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        style={{ maxWidth: '900px', margin: '12px auto auto' }}
      >
        <div
          onClick={() => handleQuizPublicClick()}
          style={{ display: 'flex', marginBottom: '4px' }}
        >
          <Typography
            className="icon-light"
            style={{
              color: '#DEDEDE',
              margin: '4px auto auto',
              cursor: 'pointer',
              width: '48px',
              userSelect: 'none'
            }}
          >
            {quizPublic ? 'Public' : 'Private'}
          </Typography>
          {quizPublic ? (
            <LockOpenIcon className="icon-light" style={{ paddingLeft: '0' }} />
          ) : (
            <LockClosedIcon
              className="icon-light"
              style={{ paddingLeft: '0' }}
            />
          )}
        </div>
        <div style={{ ...inputDivContainer, marginTop: '4px' }}>
          <textarea
            id="quiz-title"
            name="quiz-title"
            type="text"
            className="quiz-input"
            value={quizTitle}
            onChange={handleTitleChange(setQuizTitle, updateQuizSignature)}
            placeholder="Quiz title..."
            maxLength="50"
            rows="1"
            style={{
              padding: '8px 20px',
              fontSize: '16px',
              fontWeight: '400'
            }}
          />
        </div>
        <div style={{ ...inputDivContainer, marginBottom: '4px' }}>
          <textarea
            id="quiz-question"
            name="quiz-question"
            type="text"
            className="quiz-input"
            value={quizQuestion}
            onChange={handleQuestionChange(setQuizQuestion)}
            placeholder="Add a question..."
            maxLength={MAX_QUESTION_LENGTH}
            autoComplete="off"
            rows="3"
          />
        </div>
        <div style={inputDivContainer}>
          <textarea
            id="quiz-answer"
            name="quiz-answer"
            type="text"
            className="quiz-input"
            value={quizAnswer}
            onChange={handleAnswerChange(setQuizAnswer)}
            placeholder="Add an answer..."
            maxLength={MAX_ANSWER_LENGTH}
            autoComplete="off"
            onKeyDown={e => (e.keyCode === 13 ? addQuestionClicked() : null)}
          />
        </div>
        <Button
          onClick={addQuestionClicked}
          style={{
            ...buttonStyle,
            width: '100%',
            padding: '2px 8px',
            background: '#9198e5',
            color: '#fffaf0',
            borderColor: 'pink'
          }}
        >
          Add
        </Button>
        <div style={{ marginTop: '16px', width: '100%', maxWidth: '900px' }}>
          {allQuestionsAnswers.length > 0 && (
            <div
              style={{
                position: 'relative',
                textAlign: 'right',
                paddingRight: '12px'
              }}
            >
              <Typography
                style={{ float: 'left', color: '#DEDEDE' }}
              >{`Total Questions: ${allQuestionsAnswers.length}`}</Typography>
              <DeleteIcon
                className="icon-light"
                onClick={() => handleDeleteAllQA()}
              />
              {deleting && (
                <CloseIcon
                  className="icon-light"
                  onClick={() => {
                    setDeleting(false);
                    setToDeleteArrayQA([]);
                  }}
                />
              )}
            </div>
          )}
          <List
            style={{
              background: 'aliceblue',
              padding: '0px',
              borderRadius: '8px',
              marginBottom: '40px'
            }}
          >
            {renderQuestionAnswers(
              allQuestionsAnswers,
              toDeleteArrayQA,
              toggleDeleteQA,
              updateQuestionAnswer,
              updateQA,
              setUpdateQA,
              enableUpdate,
              deleting
            )}
          </List>
        </div>
      </Grid>
      <ConfirmActionModal
        showModal={showModal}
        title={'Delete Questions?'}
        message={`Are you sure you want to delete the selected questions?`}
        confirmClick={() => {
          deleteQuestionAnswers();
          setShowModal(false);
        }}
        cancelClick={() => setShowModal(false)}
      />
    </div>
  );
};

export default NewQuiz;
