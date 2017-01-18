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
      errors: false,
      pending: true,
    },
  }),
  [constants.LOGIN_SUCCESS]: (state, action) => ({
    login: {
      user: action.user,
      lastAction: action.type,
      errors: false,
      pending: false,
    },
  }),
  [constants.LOGIN_FAILED]: (state, action) => ({
    login: {
      user: {},
      lastAction: action.type,
      errors: true,
      pending: false,
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

};

export default createReducer(initialState, actionHandlers);
