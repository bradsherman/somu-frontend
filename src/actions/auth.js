import { USER_LOGGED_IN, USER_LOGGED_OUT, SPOTIFY_USER_LOGGED_IN, SPOTIFY_TOKEN_REFRESHED } from '../types';
import api from '../api';

export const userLoggedIn = user => ({
  type: USER_LOGGED_IN,
  user
});

export const userLoggedOut = () => ({
  type: USER_LOGGED_OUT
});

export const spotifyUserLoggedIn = user => {
  api.spotifyApi.setAccessToken(user.access_token);
  return {
    type: SPOTIFY_USER_LOGGED_IN,
    user
  }
};

export const spotifyTokenRefreshed = token => {
  api.spotifyApi.setAccessToken(token);
  localStorage.spotifyAccessToken = token;
  return {
    type: SPOTIFY_TOKEN_REFRESHED,
    token
  }
}

export const login = credentials => dispatch =>
  api.user.login(credentials).then(user => {
    localStorage.harmonizeJWT = user.token;
    dispatch(userLoggedIn(user));
  });

export const logout = () => dispatch => {
  localStorage.removeItem("harmonizeJWT");
  localStorage.removeItem("spotifyAccessToken");
  localStorage.removeItem("spotifyRefreshToken");
  localStorage.removeItem("spotifyId");
  localStorage.removeItem("tokenTime");
  dispatch(userLoggedOut());
};

export const confirm = token => dispatch =>
  api.user.confirm(token).then(user => {
    localStorage.harmonizeJWT = user.token;
    dispatch(userLoggedIn(user));
  });
