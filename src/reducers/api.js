import * as constants from '../actions/constants';
import createReducer from '../utils/create-reducer';

const initialState = {
  login: {
    user: {},
    lastAction: null,
    pending: false,
    error: {},
  },
};

const actionHandlers = {
  /* LOGIN */
  [constants.LOGIN_PENDING]: (state, action) => ({
    login: {
      user: action.user,
      lastAction: action.type,
      pending: action.pending,
      error: action.error,
    },
  }),
  [constants.LOGIN]: (state, action) => ({
    login: {
      user: action.user,
      lastAction: action.type,
      pending: action.pending,
      error: action.error,
    },
  }),
  [constants.LOGOUT]: (state, action) => ({
    login: {
      user: action.user,
      lastAction: action.type,
      pending: action.pending,
      error: action.error,
    },
  }),
  [constants.FETCH_ME]: (state, action) => ({
    login: {
      user: action.user,
      lastAction: action.type,
      error: action.error,
    },
  }),

  /* API */
  [constants.SAVE]: (state, action) => ({
    saving: {
      users: action.users,
      time: action.time,
      lastAction: action.type,
      error: action.error,
    },
  }),

};

export default createReducer(initialState, actionHandlers);
