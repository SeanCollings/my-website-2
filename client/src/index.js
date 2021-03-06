import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import { BrowserRouter } from 'react-router-dom';
import { composeWithDevTools } from 'redux-devtools-extension';
import * as serviceWorker from './serviceWorker';

import { RESIZE_SCREEN, BEFORE_INSTALL_PROMPT } from './actions/types';
import { MOBILE_SCREEN_SIZE } from './utils/constants';
import App from './components/App';
import reducers from './reducers';

const compose =
  process.env.NODE_ENV === 'development' ? composeWithDevTools : f => f;

const store = createStore(reducers, {}, compose(applyMiddleware(reduxThunk)));

const resizeScreen = mobileWidth => {
  return {
    type: RESIZE_SCREEN,
    payload: mobileWidth
  };
};

const mobileWidth = () => {
  return window.innerWidth > MOBILE_SCREEN_SIZE ? false : true;
};

store.dispatch(resizeScreen(mobileWidth()));

window.addEventListener('resize', () => {
  store.dispatch(resizeScreen(mobileWidth()));
});

let deferredPrompt;
window.addEventListener('beforeinstallprompt', event => {
  console.log('beforeinstallprompt fired');
  event.preventDefault();
  deferredPrompt = event;
  store.dispatch({ type: BEFORE_INSTALL_PROMPT, payload: deferredPrompt });
  return false;
});

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

serviceWorker.register();
