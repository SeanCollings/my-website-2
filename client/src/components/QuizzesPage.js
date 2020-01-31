import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter, NavLink } from 'react-router-dom';

import Loader from '../components/components/loader';
import NewQuiz from './quizzes/NewQuiz';
import ListSavedQuizzes from './quizzes/ListSavedQuizzes';
import {
  getSavedQuizzes,
  getTotalQuestions,
  saveQuiz,
  updateQuiz,
  getStartedQuizRounds,
  deleteQuiz
} from '../actions/quizActions';
import { updateHeading } from '../actions/appActions';
import {
  NEW_QUIZ_PATH,
  QUIZZES_PATH,
  VIEW_QUIZ_PATH,
  EDIT_QUIZ_PATH
} from '../utils/constants';
import ConfirmActionModal from './modals/ConfirmActionModal';
import DisplayQuizContents from './quizzes/DisplayQuizContents';

import { withStyles } from '@material-ui/core/styles';
import { Grid, Button, Fab, Typography, List } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/DeleteForever';

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

class QuizzesPage extends Component {
  state = {
    creatingNewQuiz: false,
    newQuiz: null,
    showModal: false,
    loading: false,
    selectedGroup: null,
    editGroup: null,
    deleting: false
  };

  componentDidMount() {
    const {
      updateHeading,
      history,
      auth: { pererittoUser }
    } = this.props;
    const { pathname } = this.props.location;

    if (!pererittoUser && pathname !== QUIZZES_PATH) {
      if (pathname === NEW_QUIZ_PATH) {
        if (!pererittoUser) {
          updateHeading(null);
          history.push(QUIZZES_PATH);
        } else {
          this.setState({ createNewQuiz: true });
        }
      } else if (pathname.includes(VIEW_QUIZ_PATH)) {
        if (!pererittoUser) {
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
    }

    if (pererittoUser) {
      if (pathname === NEW_QUIZ_PATH) {
        this.setState({ createNewQuiz: true });
      } else if (pathname.includes(VIEW_QUIZ_PATH)) {
        const groupId = pathname.split('view/')[1];
        this.setState({ selectedGroup: groupId });
      } else if (pathname.includes(EDIT_QUIZ_PATH)) {
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
        newQuiz: null
      });
      history.push(QUIZZES_PATH);
      this.props.getSavedQuizzes();
      this.props.getTotalQuestions();
    }

    return true;
  }

  componentDidUpdate(props, nextState) {
    const { location, updateHeading } = this.props;
    const { createNewQuiz, selectedGroup, editGroup } = nextState;

    if (props.location.pathname !== location.pathname) {
      if (
        location.pathname === QUIZZES_PATH &&
        (createNewQuiz || selectedGroup || editGroup)
      ) {
        updateHeading(null);
        this.setState({
          ...this.state,
          createNewQuiz: false,
          selectedGroup: null,
          editGroup: null
        });
      } else if (location.pathname.includes(VIEW_QUIZ_PATH)) {
        const groupId = location.pathname.split('view/')[1];
        this.setState({ selectedGroup: groupId });
      } else if (location.pathname === NEW_QUIZ_PATH) {
        this.setState({ createNewQuiz: true });
      }
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
        editGroup: null
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
    const { createNewQuiz } = this.state;

    if (createNewQuiz) {
      this.setState({ createNewQuiz: false });
    }
  };

  createNewQuizClick = () => {
    const { createNewQuiz } = this.state;
    this.setState({ createNewQuiz: !createNewQuiz });
  };

  handleQuizUpdate = newQuiz => {
    this.setState({ newQuiz });
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
    const {
      auth: { pererittoUser },
      quizzes
    } = this.props;
    const {
      createNewQuiz,
      newQuiz,
      showModal,
      loading,
      selectedGroup,
      editGroup,
      deleting
    } = this.state;

    const disableSaveButton =
      !newQuiz ||
      (newQuiz && !newQuiz.contents) ||
      (newQuiz.contents && newQuiz.contents.length === 0);
    const disableUpdateButton = !editGroup || !newQuiz;

    const noQuizzesToShow =
      !createNewQuiz && !editGroup && quizzes.savedQuizzes.length === 0;
    const showSavedQuizzes =
      !createNewQuiz && !editGroup && quizzes.savedQuizzes.length > 0;

    const selectedQuiz = quizzes.savedQuizzes.filter(
      quiz => quiz.group._id === selectedGroup
    );

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
                    {editGroup && (
                      <div
                        title={`Delete '${editGroup[0].group.title}'`}
                        style={{
                          position: 'absolute',
                          right: '0',
                          padding: '0 5%'
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
                  <Typography
                    style={{ marginTop: '12px', color: '#DEDEDe' }}
                  >{`Total app questions: ${quizzes.totalQuestions}`}</Typography>
                )}
                {noQuizzesToShow &&
                  (pererittoUser ? (
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
        {!createNewQuiz && !editGroup && !selectedGroup && pererittoUser && (
          <NavLink to={'/quizzes/new'}>
            <Fab
              onClick={this.createNewQuizClick}
              aria-label="add"
              style={{
                color: '#581845',
                background: '#fffaf0',
                position: 'fixed',
                bottom: '50px',
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
                  showModal: false
                })
              : this.resetQuiz();
          }}
          cancelClick={() =>
            this.setState({
              ...this.state,
              showModal: false,
              loading: false
            })
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
  deleteQuiz
})(withRouter(withStyles(styles)(QuizzesPage)));
