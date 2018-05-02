import { USER_LOGGED_IN, USER_LOGGED_OUT, SPOTIFY_USER_LOGGED_IN, SPOTIFY_TOKEN_REFRESHED } from '../types';

export default function user(state = {}, action = {}) {
  switch(action.type) {
    case USER_LOGGED_IN:
      return {...state, ...action.user};
    case USER_LOGGED_OUT:
      return {};
    case SPOTIFY_USER_LOGGED_IN:
      return {...state, ...action.user};
    case SPOTIFY_TOKEN_REFRESHED:
      return {...state, user: { access_token: action.token }};
    default: return state;
  }
}
