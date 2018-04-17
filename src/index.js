import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import "semantic-ui-css/semantic.min.css";
import App from './App';
import rootReducer from './rootReducer';
import { userLoggedIn } from './actions/auth';

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));

if (localStorage.harmonizeJWT) {
  const user = { token: localStorage.harmonizeJWT };
  store.dispatch(userLoggedIn(user));
}

ReactDOM.render(
    <BrowserRouter>
        <Provider store={ store }><App /></Provider>
    </BrowserRouter>,
    document.getElementById('root'));
