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
  getStartedQuizRounds
} from '../actions/quizActions';
import { updateHeading } from '../actions/appActions';
import {
  NEW_QUIZ_PATH,
  QUIZZES_PATH,
  VIEW_QUIZ_PATH,
  EDIT_QUIZ_PATH
} from '../utils/constants';

import { withStyles } from '@material-ui/core/styles';
import { Grid, Button, Fab, Typography, List } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import ConfirmActionModal from './modals/ConfirmActionModal';
import DisplayQuizContents from './quizzes/DisplayQuizContents';

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
  // marginBottom: '12px',
  border: '1px solid #ffc300'
};
const linkStyle = { textDecoration: 'none', color: '#ffc300', width: '100%' };

class QuizzesPage extends Component {
  state = {
    creatingNewQuiz: false,
    newQuiz: null,
    showModal: false,
    savingQuiz: false,
    selectedGroup: null,
    editGroup: null
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
          this.setState({ selectGroup: groupId });
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
        this.setState({ selectGroup: groupId });
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

    if (nextProps.snackBar.open && this.state.savingQuiz) {
      this.setState({
        ...this.state,
        savingQuiz: false,
        editGroup: null,
        newQuiz: null
      });
      history.push(QUIZZES_PATH);
      this.props.getSavedQuizzes();
      this.props.getTotalQuestions();
    }

    return true;
  }

  componentDidUpdate(props) {
    const { location, updateHeading } = this.props;
    const { createNewQuiz, selectGroup } = this.state;

    if (props.location.pathname !== location.pathname) {
      if (
        location.pathname === QUIZZES_PATH &&
        (createNewQuiz || selectGroup)
      ) {
        updateHeading(null);
        this.setState({
          ...this.state,
          createNewQuiz: false,
          selectGroup: null
        });
      } else if (location.pathname.includes(VIEW_QUIZ_PATH)) {
        const groupId = location.pathname.split('view/')[1];
        this.setState({ selectGroup: groupId });
      } else if (location.pathname === NEW_QUIZ_PATH) {
        this.setState({ createNewQuiz: true });
      }
    }
  }

  resetQuiz = savingQuiz => {
    const { history } = this.props;

    if (savingQuiz) {
      this.setState({
        savingQuiz
      });
    } else {
      history.push(QUIZZES_PATH);

      this.setState({
        ...this.state,
        newQuiz: null,
        createNewQuiz: false,
        showModal: false,
        savingQuiz: false,
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
      console.log('newQuiz', {
        ...newQuiz,
        createdDate: new Date().toString()
      });
      this.props.saveQuiz({ ...newQuiz, createdDate: new Date().toString() });
      this.resetQuiz(true);
    } else if (editGroup) {
      const groupId = editGroup[0].group._id;
      console.log('newQuiz', { ...newQuiz, groupId });
      this.props.updateQuiz({ ...newQuiz, groupId });
      this.resetQuiz(true);
    }
  };

  startQuiz = () => {
    const { createNewQuiz } = this.state;

    if (createNewQuiz) {
      this.setState({ createNewQuiz: false });
    }
  };

  createNewQuiz = () => {
    const { createNewQuiz } = this.state;
    this.setState({ createNewQuiz: !createNewQuiz });
  };

  handleQuizUpdate = newQuiz => {
    this.setState({ newQuiz });
  };

  selectGroupClick = groupId => {
    const { history } = this.props;

    this.setState({ selectGroup: groupId });
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
          selectGroup={() => this.selectGroupClick(group._id)}
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
      savingQuiz,
      selectGroup,
      editGroup
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
      quiz => quiz.group._id === selectGroup
    );

    return (
      <div style={{ marginTop: '12px' }}>
        <Loader showLoader={savingQuiz} spinnerColor={'#ffc300'} hideSpinner>
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
            style={{ opacity: savingQuiz ? '0.7' : '1' }}
          >
            {selectGroup ? (
              <DisplayQuizContents quiz={selectedQuiz} />
            ) : (
              <Fragment>
                {!createNewQuiz && !editGroup && (
                  <Button
                    onClick={this.startQuiz}
                    style={{
                      ...buttonStyle,
                      background: '#581845',
                      marginBottom: '12px'
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
                      style={{
                        ...buttonStyle,
                        background: '#fffaf0',
                        marginRight: '12px',
                        borderColor: 'pink'
                      }}
                    >
                      <NavLink
                        to={newQuiz ? NEW_QUIZ_PATH : QUIZZES_PATH}
                        onClick={this.cancelClicked}
                        style={{ ...linkStyle, color: '#9198e5' }}
                      >
                        Cancel
                      </NavLink>
                    </Button>
                    <Loader
                      showLoader={savingQuiz}
                      spinnerColor={'#ffc300'}
                      small
                    >
                      <Button
                        style={{
                          ...buttonStyle,
                          background: '#fffaf0',
                          opacity:
                            disableUpdateButton && disableSaveButton
                              ? '0.6'
                              : '1',
                          borderColor: 'pink'
                        }}
                        disabled={disableUpdateButton && disableSaveButton}
                      >
                        <NavLink
                          to={NEW_QUIZ_PATH}
                          onClick={this.saveUpdateQuizClicked}
                          style={{ ...linkStyle, color: '#9198e5' }}
                        >
                          {createNewQuiz ? 'Save Quiz' : 'Update Quiz'}
                        </NavLink>
                      </Button>
                    </Loader>
                  </Grid>
                )}
                {(createNewQuiz || editGroup) && (
                  <NewQuiz
                    updateNewQuiz={newQuiz => this.handleQuizUpdate(newQuiz)}
                    savingQuiz={savingQuiz}
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
                        borderBottom: '1px solid #DEDEDE',
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
                      Start a new qizz above. Have fun!
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
        {!createNewQuiz && !editGroup && !selectGroup && pererittoUser && (
          <NavLink to={'/quizzes/new'}>
            <Fab
              onClick={this.createNewQuiz}
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
          title={'Cancel Quiz?'}
          message={`Are you sure you want to cancel the current quiz? You may have unsaved changes.`}
          confirmClick={() => {
            this.resetQuiz();
          }}
          cancelClick={() =>
            this.setState({
              ...this.state,
              showModal: false
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
  updateQuiz
})(withRouter(withStyles(styles)(QuizzesPage)));
