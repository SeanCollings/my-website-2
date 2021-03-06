import React, { useState, useEffect } from 'react';

import {
  MAX_QUESTION_LENGTH,
  MAX_ANSWER_LENGTH,
  EDIT_DELETE_CONTENT,
  EDIT_UPDATE_CONTENT
} from '../../utils/constants';
import ConfirmActionModal from '../modals/ConfirmActionModal';
import EditQuestionAnswerList from './EditQuestionAnswerList';
import './NewQuiz.css';

import { Grid, Button, List, Typography } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/DeleteForever';
import CloseIcon from '@material-ui/icons/Close';
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

const handleQuestionChange = setQuizQuestion => e => {
  const text = e.target.value;
  const match = /\r|\n/.exec(text);

  if (!match || (match && match.index !== 0)) setQuizQuestion(text);
};

const handleAnswerChange = setQuizAnswer => e => {
  const text = e.target.value;
  setQuizAnswer(text);
};

const NewQuiz = ({ updateNewQuiz, editGroup, uploadedFile }) => {
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
  const [updatedItems, setUpdatedItems] = useState({
    [EDIT_DELETE_CONTENT]: [],
    [EDIT_UPDATE_CONTENT]: []
  });

  useEffect(() => {
    if (uploadedFile && uploadedFile.length > 0) {
      const { group, content } = uploadedFile[0];
      setQuizTitle(group.title.trim());
      setAllQuestionsAnswers(content);

      updateNewQuiz({
        title: group.title,
        contents: content,
        isPublic: true
      });
    }
  }, [uploadedFile, updateNewQuiz]);

  const addQuestionClicked = () => {
    const newQuestionsAnswers = [...allQuestionsAnswers];

    if (quizQuestion.length && quizAnswer.length) {
      newQuestionsAnswers.push({
        question: quizQuestion.trim(),
        answer: quizAnswer.trim()
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
    const newUpdatedItems = { ...updatedItems };

    if (updating) {
      const tempContent = temp;
      const text = e.target.value;

      setTemp({
        question: question ? tempContent.question.trim() : text.trim(),
        answer: answer ? tempContent.answer.trim() : text.trim()
      });
    } else {
      const newQuestionsAnswers = [...allQuestionsAnswers];
      newQuestionsAnswers[index] = {
        ...newQuestionsAnswers[index],
        ...temp
      };

      if (
        newQuestionsAnswers[index]._id &&
        !newUpdatedItems[EDIT_UPDATE_CONTENT].includes(
          newQuestionsAnswers[index]._id
        )
      ) {
        newUpdatedItems[EDIT_UPDATE_CONTENT].push(
          newQuestionsAnswers[index]._id
        );
      }

      setUpdatedItems(newUpdatedItems);
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
    const newUpdatedItems = { ...updatedItems };

    toDeleteIndices.sort((a, b) => b - a);

    for (let i = 0; i < toDeleteIndices.length; i++) {
      if (newQuestionsAnswers[toDeleteIndices[i]]._id) {
        newUpdatedItems[EDIT_DELETE_CONTENT].push(
          newQuestionsAnswers[toDeleteIndices[i]]._id
        );
      }

      newQuestionsAnswers.splice(toDeleteIndices[i], 1);
    }

    setUpdatedItems(newUpdatedItems);
    setAllQuestionsAnswers(newQuestionsAnswers);
    updateQuizSignature(null, newQuestionsAnswers, null);

    setDeleting(false);
    setToDeleteArrayQA([]);
  };

  const handleQuizPublicClick = () => {
    setQuizPublic(!quizPublic);
    updateQuizSignature(null, null, !quizPublic);
  };

  const handleTitleChange = updateQuizSignature => e => {
    const text = e.target.value;
    const match = /\r|\n/.exec(text);

    if (match && match.length) e.preventDefault();
    else {
      setQuizTitle(text);
      updateQuizSignature(text, null, null);
    }
  };

  const updateQuizSignature = (title, contents, isPublic) => {
    const setUpdatedItems = editGroup || uploadedFile ? updatedItems : null;

    updateNewQuiz({
      title: title || quizTitle.trim(),
      contents: contents || allQuestionsAnswers,
      isPublic:
        isPublic !== undefined && isPublic !== null ? isPublic : quizPublic,
      updatedItems: setUpdatedItems
    });
  };

  return (
    <div className="quiz-container">
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        style={{
          maxWidth: '900px',
          margin: '12px auto auto',
          borderTop: '1px solid #dedede'
        }}
      >
        <div
          onClick={() => handleQuizPublicClick()}
          style={{ display: 'flex', margin: '12px 0 8px' }}
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
            onChange={handleTitleChange(updateQuizSignature)}
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
            <EditQuestionAnswerList
              allQuestionsAnswers={allQuestionsAnswers}
              toDeleteArrayQA={toDeleteArrayQA}
              toggleDeleteQA={toggleDeleteQA}
              updateQuestionAnswer={updateQuestionAnswer}
              updateQA={updateQA}
              setUpdateQA={setUpdateQA}
              enableUpdate={enableUpdate}
              deleting={deleting}
            />
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
