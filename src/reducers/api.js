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
      user: {},
      lastAction: action.type,
      pending: true,
    },
  }),
  [constants.LOGIN_SUCCESS]: (state, action) => ({
    login: {
      user: {
        token: action.token,
      },
      lastAction: action.type,
      pending: true,
    },
  }),
  [constants.LOGIN_FAILED]: (state, action) => ({
    login: {
      user: {},
      lastAction: action.type,
      pending: false,
    },
    error: {
      lastAction: action.type,
      errors: true,
      msg: action.msg,
      code: action.code,
    },
  }),
  [constants.LOGOUT]: (state, action) => ({
    login: {
      user: {},
      lastAction: action.type,
      errors: false,
      pending: false,
    },
  }),
  [constants.FETCH_ME]: (state, action) => ({
    login: {
      user: {
        id: action.user._id,
        email: action.user.email,
        token: action.user.token,
      },
      pending: false,
    },
  }),

  /* Generic Errors */
  [constants.API_FAILED]: (state, action) => ({
    error: {
      lastAction: action.type,
      errors: true,
      msg: action.msg,
      code: action.code,
    },
  }),

};

export default createReducer(initialState, actionHandlers);
