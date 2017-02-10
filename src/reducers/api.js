import * as constants from '../actions/constants';
import createReducer from '../utils/create-reducer';

const initialState = {
  login: {
    user: {},
    lastAction: null,
    time: null,
    error: {},
  },
  createUser: {
    user: {},
    lastAction: null,
    time: null,
    error: {},
  },
  getPrototypes: {
    prototypes: {},
    lastAction: null,
    time: null,
    error: {},
  },
  createPrototype: {
    prototype: {},
    lastAction: null,
    time: null,
    error: {},
  },
};

const actionHandlers = {

  /* --- User Login --- */
  [constants.LOGIN]: (state, action) => ({
    login: {
      user: action.user,
      lastAction: action.type,
      time: action.time,
      error: action.error,
    },
  }),
  [constants.FETCH_ME]: (state, action) => ({
    login: {
      user: action.user,
      lastAction: action.type,
      time: action.time,
      error: action.error,
    },
  }),

  /* --- Create User --- */
  [constants.CREATE_USER]: (state, action) => ({
    createUser: {
      user: action.user,
      lastAction: action.type,
      time: action.time,
      error: action.error,
    },
  }),

  /* --- Prototypes */
  [constants.GET_PROTOTYPES]: (state, action) => ({
    getPrototypes: {
      prototypes: action.prototypes,
      lastAction: action.type,
      time: action.time,
      error: action.error,
    },
  }),
  [constants.CREATE_PROTOTYPE]: (state, action) => ({
    createPrototype: {
      prototypes: action.prototype,
      lastAction: action.type,
      time: action.time,
      error: action.error,
    },
  }),
};

export default createReducer(initialState, actionHandlers);
