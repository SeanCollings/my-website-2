import React, { Fragment } from 'react';

import { MAX_QUESTION_LENGTH, MAX_ANSWER_LENGTH } from '../../utils/constants';

import { ListItem, Typography } from '@material-ui/core';
import UpdateIcon from '@material-ui/icons/Create';
import CloseIcon from '@material-ui/icons/Close';
import ConfirmIcon from '@material-ui/icons/Done';
import UnselectedIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import SelectedIcon from '@material-ui/icons/CheckBox';

const EditQuestionAnswerList = ({
  allQuestionsAnswers,
  toDeleteArrayQA,
  toggleDeleteQA,
  updateQuestionAnswer,
  updateQA,
  setUpdateQA,
  enableUpdate,
  deleting
}) => {
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

export default EditQuestionAnswerList;
