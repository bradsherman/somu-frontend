import { USER_LOGGED_IN, USER_LOGGED_OUT, SPOTIFY_USER_LOGGED_IN } from '../types';

export default function user(state = {}, action = {}) {
  switch(action.type) {
    case USER_LOGGED_IN:
      return action.user;
    case USER_LOGGED_OUT:
      return {};
    case SPOTIFY_USER_LOGGED_IN:
      return {...state, ...action.user};
    default: return state;
  }
}
