import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import decode from 'jwt-decode';
import { composeWithDevTools } from 'redux-devtools-extension';
import "semantic-ui-css/semantic.min.css";
import App from './App';
import rootReducer from './rootReducer';
import { userLoggedIn } from './actions/auth';

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));

if (localStorage.harmonizeJWT) {
  const payload = decode(localStorage.harmonizeJWT);
  const user = {
    token: localStorage.harmonizeJWT,
    email: payload.email,
    username: payload.username,
    first_name: payload.first_name,
    last_name: payload.last_name,
  }
  store.dispatch(userLoggedIn(user));
};


ReactDOM.render(
    <BrowserRouter>
        <Provider store={ store }>
          <Route component={App} />
        </Provider>
    </BrowserRouter>,
    document.getElementById('root'));
