import { USER_LOGGED_IN, USER_LOGGED_OUT } from '../types';
import api from '../api';

export const userLoggedIn = user => ({
  type: USER_LOGGED_IN,
  user
});

export const userLoggedOut = () => ({
  type: USER_LOGGED_OUT
})

export const login = credentials => dispatch =>
  api.user.login(credentials).then(user => {
    localStorage.harmonizeJWT = user.token;
    // console.log(user);
    // var u = {
    //   email: user.email,
    // }
    dispatch(userLoggedIn(user));
  });

export const logout = () => dispatch =>
  api.user.confirm(token).then(user => {
    localStorage.removeItem("harmonizeJWT");
    dispatch(userLoggedOut());
  });

export const confirm = token => dispatch =>
  api.user.confirm(token).then(user => {
    localStorage.harmonizeJWT = user.token;
    dispatch(userLoggedIn(user));
  });
