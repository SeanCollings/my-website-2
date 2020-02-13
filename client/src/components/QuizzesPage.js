import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter, NavLink } from 'react-router-dom';

import Loader from '../components/components/loader';
import NewQuiz from './quizzes/NewQuiz';
import ListSavedQuizzes from './quizzes/ListSavedQuizzes';
import ConfirmActionModal from './modals/ConfirmActionModal';
import UploadQuizModal from './modals/UploadQuizModal';
import SelectStartQuizModal from './modals/SelectStartQuizModal';
import DisplayQuizContents from './quizzes/DisplayQuizContents';
import StartQuizRound from './quizzes/StartQuizRound';

import {
  getSavedQuizzes,
  getTotalQuestions,
  saveQuiz,
  updateQuiz,
  getStartedQuizRounds,
  deleteQuiz,
  updateQuestionRead,
  updatePreviousQuestion,
  resetQuizRound
} from '../actions/quizActions';
import { updateHeading } from '../actions/appActions';
import {
  NEW_QUIZ_PATH,
  QUIZZES_PATH,
  VIEW_QUIZ_PATH,
  EDIT_QUIZ_PATH,
  START_QUIZ_PATH,
  DEFAULT_QUIZ,
  CONTINUE_QUIZ
} from '../utils/constants';

import { withStyles } from '@material-ui/core/styles';
import { Grid, Button, Fab, Typography, List } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/DeleteForever';
import UploadIcon from '@material-ui/icons/CloudUpload';

const styles = theme => ({
  pageFill: {
    paddingBottom: '2.5rem'
  },
  root: {
    backgroundImage: 'linear-gradient(#b5318e, #ce6db2  60%)',
    borderRadius: '24px'
  }
});
const buttonStyle = {
  color: '#ffc300',
  width: '105px',
  border: '1px solid #ffc300'
};

const getRandomContent = round =>
  round[Math.floor(Math.random() * round.length)];

class QuizzesPage extends Component {
  state = {
    creatingNewQuiz: false,
    newQuiz: null,
    showModal: false,
    loading: false,
    selectedGroup: null,
    editGroup: null,
    deleting: false,
    startQuiz: false,
    startedRound: null,
    randomContent: null,
    showQuizModal: false,
    showStartModal: false,
    uploadedFile: null,
    completedQuestions: [],
    nextQuestions: [],
    selection: null
  };

  componentDidMount() {
    const { updateHeading, history, auth } = this.props;
    const { pathname } = this.props.location;

    if (auth && !auth.pererittoUser && pathname !== QUIZZES_PATH) {
      if (pathname === NEW_QUIZ_PATH) {
        if (!auth.pererittoUser) {
          updateHeading(null);
          history.push(QUIZZES_PATH);
        } else {
          this.setState({ createNewQuiz: true });
        }
      } else if (pathname.includes(VIEW_QUIZ_PATH)) {
        if (!auth.pererittoUser) {
          updateHeading(null);
          history.push(QUIZZES_PATH);
        } else {
          const groupId = pathname.split('view/')[1];
          this.setState({ selectedGroup: groupId });
        }
      } else if (pathname.includes(EDIT_QUIZ_PATH)) {
        updateHeading(null);
        history.push(QUIZZES_PATH);
      }
    } else if (pathname === START_QUIZ_PATH) {
      updateHeading(null);
      history.push(QUIZZES_PATH);
    }

    if (auth && auth.pererittoUser) {
      if (pathname === NEW_QUIZ_PATH) {
        this.setState({ createNewQuiz: true });
      } else if (pathname.includes(VIEW_QUIZ_PATH)) {
        const groupId = pathname.split('view/')[1];
        this.setState({ selectedGroup: groupId });
      } else if (pathname.includes(EDIT_QUIZ_PATH)) {
        updateHeading(null);
        history.push(QUIZZES_PATH);
      } else if (pathname === START_QUIZ_PATH) {
        updateHeading(null);
        history.push(QUIZZES_PATH);
      }

      this.props.getSavedQuizzes();
    }
    this.props.getTotalQuestions();
  }

  shouldComponentUpdate(nextProps) {
    const { history } = this.props;

    if (nextProps.snackBar.open && this.state.loading) {
      this.setState({
        ...this.state,
        loading: false,
        editGroup: null,
        newQuiz: null,
        uploadedFile: null
      });
      history.push(QUIZZES_PATH);
      this.props.getSavedQuizzes();
      this.props.getTotalQuestions();
    }

    return true;
  }

  componentDidUpdate(props, nextState) {
    const { location, updateHeading } = this.props;
    const {
      createNewQuiz,
      selectedGroup,
      editGroup,
      startQuiz,
      startedRound,
      randomContent,
      completedQuestions
    } = nextState;

    if (props.location.pathname !== location.pathname) {
      if (
        location.pathname === QUIZZES_PATH &&
        (createNewQuiz || selectedGroup || editGroup || startQuiz)
      ) {
        updateHeading(null);
        this.setState({
          ...this.state,
          createNewQuiz: false,
          selectedGroup: null,
          editGroup: null,
          startQuiz: false,
          uploadedFile: null,
          completedQuestions: [],
          nextQuestions: [],
          selection: null
        });
      } else if (location.pathname.includes(VIEW_QUIZ_PATH)) {
        const groupId = location.pathname.split('view/')[1];
        this.setState({ selectedGroup: groupId });
      } else if (location.pathname === NEW_QUIZ_PATH) {
        this.setState({ createNewQuiz: true });
      } else if (location.pathname.includes(EDIT_QUIZ_PATH)) {
      } else if (location.pathname === START_QUIZ_PATH) {
      }
    }

    const oldPropsStartedRound = props.quizzes.startedRound;
    const newPropsStartedRound = this.props.quizzes.startedRound;

    // Received updated batch startedRound
    if (
      oldPropsStartedRound &&
      newPropsStartedRound &&
      !!newPropsStartedRound.length &&
      oldPropsStartedRound.length !== newPropsStartedRound.length
    ) {
      const completedIds = completedQuestions.map(content => content._id);
      const updatedRound = newPropsStartedRound.filter(
        content => !completedIds.includes(content._id)
      );
      const newState = { ...this.state, startedRound: updatedRound };

      if (!randomContent) {
        this.setState({
          ...newState,
          randomContent: getRandomContent(newPropsStartedRound)
        });
      } else {
        this.setState(newState);
      }
    }

    if (!oldPropsStartedRound && newPropsStartedRound) {
      const randomContent = getRandomContent(newPropsStartedRound);
      this.setState({
        ...this.state,
        startedRound: newPropsStartedRound,
        randomContent
      });
    }

    if (startedRound && startedRound.length === 0) {
      this.setState({
        ...this.state,
        startedRound: oldPropsStartedRound,
        randomContent: getRandomContent(oldPropsStartedRound)
      });
    }

    const oldUpdatedRound = props.quizzes.updatedQuestions;
    const newUpdatedRound = this.props.quizzes.updatedQuestions;

    if (
      oldUpdatedRound &&
      newUpdatedRound &&
      !!newUpdatedRound.length &&
      oldUpdatedRound.length !== newUpdatedRound.length
    ) {
      const newState = { ...this.state, startedRound: newUpdatedRound };

      if (!randomContent) {
        this.setState({
          ...newState,
          randomContent: getRandomContent(newUpdatedRound)
        });
      } else {
        this.setState(newState);
      }
    }

    if (
      !props.quizzes.updatedQuestions &&
      this.props.quizzes.updatedQuestions
    ) {
      const round = this.props.quizzes.updatedQuestions;
      const randomContent = getRandomContent(round);
      this.setState({
        ...this.state,
        startedRound: round,
        randomContent,
        completedQuestions: [],
        nextQuestions: []
      });
    }
  }

  resetQuiz = loading => {
    const { history } = this.props;

    if (loading) {
      this.setState({
        loading
      });
    } else {
      history.push(QUIZZES_PATH);

      this.setState({
        ...this.state,
        newQuiz: null,
        createNewQuiz: false,
        showModal: false,
        loading: false,
        editGroup: null,
        uploadedFile: null
      });
    }
  };

  cancelClicked = () => {
    const { newQuiz } = this.state;
    if (newQuiz) this.setState({ showModal: true });
    else this.resetQuiz();
  };

  saveUpdateQuizClicked = () => {
    const { newQuiz, editGroup, createNewQuiz } = this.state;

    if (createNewQuiz) {
      this.props.saveQuiz({ ...newQuiz, createdDate: new Date().toString() });
      this.resetQuiz(true);
    } else if (editGroup) {
      const groupId = editGroup[0].group._id;
      this.props.updateQuiz({ ...newQuiz, groupId });
      this.resetQuiz(true);
    }
  };

  startQuizClicked = () => {
    const { auth, quizzes } = this.props;

    if (auth.pererittoUser && quizzes && quizzes.savedQuizzes.length > 0) {
      this.setState({ showStartModal: true });
    } else {
      this.selectQuizTypeClick(DEFAULT_QUIZ);
    }
  };

  selectQuizTypeClick = selection => {
    const { history } = this.props;

    if (selection !== CONTINUE_QUIZ && selection !== DEFAULT_QUIZ) {
      this.setState({
        ...this.state,
        showStartModal: false,
        startQuiz: true,
        randomContent: null,
        startedRound: null,
        completedQuestions: [],
        selection: null
      });
      this.props.resetQuizRound();
    } else {
      this.setState({
        ...this.state,
        showStartModal: false,
        startQuiz: true,
        selection,
        completedQuestions: []
      });
    }
    history.push(`${START_QUIZ_PATH}`);
    this.props.getStartedQuizRounds(selection);
  };

  nextQuestionClicked = id => {
    const { startedRound, completedQuestions, randomContent } = this.state;
    const nextQuestions = [...this.state.nextQuestions];
    const updatedCompletedQuestions = [...completedQuestions];

    const newStartedRound = startedRound.filter(content => content._id !== id);
    const postPopNextQuestionsLength = !!nextQuestions.length
      ? nextQuestions.length - 1
      : 0;
    const questionsLeft = newStartedRound.length + postPopNextQuestionsLength;

    updatedCompletedQuestions.push(randomContent);
    this.props.updateQuestionRead(id, questionsLeft);

    if (nextQuestions.length > 0) {
      const nextQuestion = nextQuestions.pop();

      this.setState({
        ...this.state,
        nextQuestions,
        randomContent: nextQuestion,
        startedRound: newStartedRound,
        completedQuestions: updatedCompletedQuestions
      });
    } else if (questionsLeft > 0) {
      const newRandomContent = getRandomContent(newStartedRound);

      this.setState({
        ...this.state,
        randomContent: newRandomContent,
        startedRound: newStartedRound,
        completedQuestions: updatedCompletedQuestions
      });
    } else {
      this.setState({
        ...this.state,
        selection: null,
        completedQuestions: []
      });
    }
  };
  previousQuestionClicked = () => {
    const { randomContent } = this.state;

    const nextQuestions = [...this.state.nextQuestions];
    const completedQuestions = [...this.state.completedQuestions];

    if (!!completedQuestions.length) {
      const previousQuestion = completedQuestions.pop();
      nextQuestions.push(randomContent);

      this.setState({
        ...this.state,
        completedQuestions,
        randomContent: previousQuestion,
        nextQuestions
      });
      this.props.updatePreviousQuestion(previousQuestion._id);
    }
  };

  createNewQuizClick = () => {
    const { createNewQuiz } = this.state;
    this.setState({ createNewQuiz: !createNewQuiz });
  };

  handleQuizUpdate = newQuiz => {
    this.setState({ ...this.setState, newQuiz, uploadedFile: null });
  };

  selectedGroupClick = groupId => {
    const { history } = this.props;

    this.setState({ selectedGroup: groupId });
    history.push(`${VIEW_QUIZ_PATH}${groupId}`);
  };

  editgroupClick = groupId => {
    const {
      history,
      quizzes: { savedQuizzes }
    } = this.props;

    const groupToEdit = savedQuizzes.filter(quiz => quiz.group._id === groupId);

    this.setState({ editGroup: groupToEdit });
    history.push(`${EDIT_QUIZ_PATH}${groupId}`);
  };

  handleFileUpload = e => {
    const file = e.target.files[0];

    if (file) {
      const { name, size } = file;
      if (size > 1024 * 30) return null;

      const reader = new FileReader();
      reader.readAsText(file, 'UTF-8');

      reader.onload = evt => {
        const text = evt.target.result;

        if (text && text.length > 0) {
          const splitLines = text.split('\n');

          const content = splitLines.reduce((result, line) => {
            const split = line.split('?');

            if (
              split.length === 2 &&
              split[0].trim().length > 0 &&
              split[1].trim().length > 0
            ) {
              result.push({
                question: `${split[0].trim()}?`,
                answer: split[1].trim()
              });
            }
            return result;
          }, []);

          const uploadedFile = [
            {
              group: {
                title: name.split('.txt')[0],
                isPublic: true
              },
              content
            }
          ];

          this.setState({ uploadedFile });
        }
      };
    }
  };

  confirmUploadQuizClick = () => {
    this.setState({ ...this.state, showQuizModal: false });
    const fileUpload = document.getElementById('upload-quiz-file');

    if (fileUpload) {
      fileUpload.addEventListener('change', this.handleFileUpload);
      fileUpload.click();
      fileUpload.onclick = event => {
        event.target.value = '';
      };
    }
  };

  deleteGroupClick = () => {
    const { editGroup } = this.state;

    if (editGroup && editGroup.length > 0) {
      this.setState({
        ...this.state,

        showModal: true,
        deleting: true
      });
    }
  };

  renderSavedQuizzes = () => {
    const {
      quizzes: { savedQuizzes }
    } = this.props;

    return savedQuizzes.map(quiz => {
      const { group, content } = quiz;
      const updatedGroup = { ...group, count: content.length };

      return (
        <ListSavedQuizzes
          key={group._id}
          group={updatedGroup}
          selectedGroup={() => this.selectedGroupClick(group._id)}
          editGroup={() => this.editgroupClick(group._id)}
        />
      );
    });
  };

  render() {
    const { auth, quizzes } = this.props;
    const {
      createNewQuiz,
      newQuiz,
      showModal,
      loading,
      selectedGroup,
      editGroup,
      deleting,
      startQuiz,
      randomContent,
      uploadedFile,
      showQuizModal,
      showStartModal,
      completedQuestions,
      selection
    } = this.state;

    const disableSaveButton =
      !uploadedFile &&
      (!newQuiz ||
        (newQuiz && !newQuiz.contents) ||
        (newQuiz.contents && newQuiz.contents.length === 0));

    const disableUpdateButton = !editGroup || !newQuiz;

    const noQuizzesToShow =
      !createNewQuiz && !editGroup && quizzes.savedQuizzes.length === 0;
    const showSavedQuizzes =
      !createNewQuiz && !editGroup && quizzes.savedQuizzes.length > 0;

    const selectedQuiz = quizzes.savedQuizzes.filter(
      quiz => quiz.group._id === selectedGroup
    );

    if (startQuiz) {
      const completed =
        selection && quizzes.currentQuestion
          ? quizzes.currentQuestion + completedQuestions.length
          : completedQuestions.length + 1;

      return (
        <div style={{ marginTop: '12px' }}>
          <StartQuizRound
            randomContent={randomContent}
            nextQuestion={this.nextQuestionClicked}
            previousQuestion={this.previousQuestionClicked}
            completed={completed}
            allRoundQuestions={quizzes.totalRoundQuestions}
            completedQuestions={completedQuestions.length}
          />
        </div>
      );
    }

    return (
      <div style={{ marginTop: '12px' }}>
        <Loader showLoader={loading} spinnerColor={'#ffc300'} hideSpinner>
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
            style={{ opacity: loading ? '0.7' : '1' }}
          >
            {selectedGroup ? (
              <DisplayQuizContents quiz={selectedQuiz} />
            ) : (
              <Fragment>
                {!createNewQuiz && !editGroup && (
                  <Button
                    onClick={this.startQuizClicked}
                    style={{
                      ...buttonStyle,
                      background: '#fffaf0',
                      marginBottom: '12px',
                      color: '#721342',
                      borderColor: '#581845',
                      height: '70px'
                    }}
                  >
                    Start Quiz
                  </Button>
                )}
                {(createNewQuiz || editGroup) && (
                  <Grid
                    container
                    direction="row"
                    justify="center"
                    alignItems="center"
                    id="top-button-grid"
                    style={{
                      maxWidth: '900px',
                      width: '90%',
                      position: 'relative'
                    }}
                  >
                    <Button
                      onClick={this.cancelClicked}
                      style={{
                        ...buttonStyle,
                        background: '#fffaf0',
                        marginRight: '12px',
                        borderColor: 'pink',
                        color: '#9198e5'
                      }}
                    >
                      Cancel
                    </Button>
                    <Loader showLoader={loading} spinnerColor={'#ffc300'} small>
                      <Button
                        onClick={this.saveUpdateQuizClicked}
                        style={{
                          ...buttonStyle,
                          background: '#fffaf0',
                          opacity:
                            disableUpdateButton && disableSaveButton
                              ? '0.6'
                              : '1',
                          borderColor: 'pink',
                          color: '#9198e5'
                        }}
                        disabled={disableUpdateButton && disableSaveButton}
                      >
                        {createNewQuiz ? 'Save Quiz' : 'Update Quiz'}
                      </Button>
                    </Loader>
                    {createNewQuiz && (
                      <div
                        title={`Upload quiz`}
                        style={{
                          position: 'absolute',
                          right: '0'
                        }}
                      >
                        <UploadIcon
                          onClick={() => this.setState({ showQuizModal: true })}
                          style={{ color: '#dedede', cursor: 'pointer' }}
                        />
                        <input
                          id="upload-quiz-file"
                          type="file"
                          accept={'.txt'}
                          style={{ display: 'none' }}
                        />
                      </div>
                    )}
                    {editGroup && (
                      <div
                        title={`Delete '${editGroup[0].group.title}'`}
                        style={{
                          position: 'absolute',
                          right: '0'
                        }}
                      >
                        <DeleteIcon
                          onClick={this.deleteGroupClick}
                          style={{ color: '#dedede', cursor: 'pointer' }}
                        />
                      </div>
                    )}
                  </Grid>
                )}
                {(createNewQuiz || editGroup) && (
                  <NewQuiz
                    updateNewQuiz={newQuiz => this.handleQuizUpdate(newQuiz)}
                    loading={loading}
                    editGroup={editGroup}
                    uploadedFile={uploadedFile}
                  />
                )}
                {!createNewQuiz && !editGroup && (
                  <Fragment>
                    <div
                      style={{
                        borderBottom: '1px solid #DEDEDE',
                        width: '100%',
                        marginBottom: '8px'
                      }}
                    ></div>
                    <div
                      style={{
                        borderBottom: '1px solid pink',
                        width: '100%'
                      }}
                    ></div>
                  </Fragment>
                )}
                {!createNewQuiz && !editGroup && (
                  <div style={{ display: 'block', textAlign: 'center' }}>
                    <Typography
                      style={{ marginTop: '12px', color: '#DEDEDe' }}
                    >{`Total public questions: ${quizzes.totalQuestions.all}`}</Typography>
                    {auth && auth.pererittoUser && (
                      <Typography
                        style={{ color: '#DEDEDe' }}
                      >{`Your public questions: ${quizzes.totalQuestions.you.public} / ${quizzes.totalQuestions.you.all}`}</Typography>
                    )}
                  </div>
                )}
                {noQuizzesToShow &&
                  (auth && auth.pererittoUser ? (
                    <Typography style={{ marginTop: '12px', color: '#DEDEDE' }}>
                      Looks like there are no quizzes to show, yet...
                    </Typography>
                  ) : (
                    <Typography style={{ marginTop: '12px', color: '#DEDEDE' }}>
                      Start a new quiz above. Have fun!
                    </Typography>
                  ))}
                {showSavedQuizzes > 0 && (
                  <List
                    style={{
                      marginTop: '0px',
                      width: '90%',
                      marginBottom: '40px'
                    }}
                  >
                    {this.renderSavedQuizzes()}
                  </List>
                )}
              </Fragment>
            )}
          </Grid>
        </Loader>
        {!createNewQuiz &&
          !editGroup &&
          !selectedGroup &&
          auth &&
          auth.pererittoUser && (
            <NavLink to={'/quizzes/new'}>
              <Fab
                onClick={this.createNewQuizClick}
                aria-label="add"
                style={{
                  color: '#581845',
                  background: '#fffaf0',
                  position: 'fixed',
                  bottom: '30px',
                  right: '-1px',
                  borderRadius: '50% 0 0 50%',
                  zIndex: '10',
                  border: '1px solid #581845'
                }}
              >
                <AddIcon />
              </Fab>
            </NavLink>
          )}
        <ConfirmActionModal
          showModal={showModal}
          title={deleting ? 'Warning!' : 'Cancel Quiz?'}
          message={
            deleting
              ? 'Are you sure you want to delete the current quiz? It will be permanently removed.'
              : `Are you sure you want to cancel the current quiz? You may have unsaved changes.`
          }
          confirmClick={() => {
            deleting
              ? this.props.deleteQuiz(editGroup[0].group._id) &&
                this.setState({
                  ...this.state,
                  loading: true,
                  showModal: false,
                  deleting: false
                })
              : this.resetQuiz();
          }}
          cancelClick={() =>
            this.setState({
              ...this.state,
              showModal: false,
              loading: false,
              deleting: false
            })
          }
        />
        <UploadQuizModal
          showModal={showQuizModal}
          confirmClick={this.confirmUploadQuizClick}
          cancelClick={() =>
            this.setState({ ...this.state, showQuizModal: false })
          }
        />
        <SelectStartQuizModal
          showModal={showStartModal}
          savedQuizzes={quizzes.savedQuizzes}
          selectQuizTypeClick={selection => this.selectQuizTypeClick(selection)}
          cancelClick={() =>
            this.setState({ ...this.state, showStartModal: false })
          }
        />
      </div>
    );
  }
}

function mapStateToProps({ auth, resizeScreen, snackBar, quizzes }) {
  return { auth, resizeScreen, snackBar, quizzes };
}

export default connect(mapStateToProps, {
  getSavedQuizzes,
  saveQuiz,
  getStartedQuizRounds,
  updateHeading,
  getTotalQuestions,
  updateQuiz,
  deleteQuiz,
  updateQuestionRead,
  updatePreviousQuestion,
  resetQuizRound
})(withRouter(withStyles(styles)(QuizzesPage)));
