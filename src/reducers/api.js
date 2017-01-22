import * as constants from '../actions/constants';
import createReducer from '../utils/create-reducer';

const initialState = {
  login: {
    user: {},
    lastAction: null,
    errors: false,
    pending: false,
  },
};

const actionHandlers = {
  /* LOGIN */
  [constants.LOGIN_PENDING]: (state, action) => ({
    login: {
      user: action.user,
      lastAction: action.type,
      pending: action.pending,
    },
  }),
  [constants.LOGIN]: (state, action) => ({
    login: {
      user: action.user,
      lastAction: action.type,
      pending: action.pending,
    },
    error: {
      lastAction: action.type,
      errors: true,
      msg: action.msg,
      code: action.code,
    }
  }),
  [constants.LOGOUT]: (state, action) => ({
    login: {
      user: action.user,
      lastAction: action.type,
      errors: action.errors,
      pending: action.pending,
    },
  }),
  [constants.FETCH_ME]: (state, action) => ({
    login: {
      user: {
        id: action.user._id,
        email: action.user.email,
        token: action.user.token,
      },
    },
  }),

  /* Generic Errors */
  [constants.API_FAILED]: (state, action) => ({
    error: {
      lastAction: action.type,
      msg: action.msg,
      code: action.code,
    },
  }),
};

export default createReducer(initialState, actionHandlers);
