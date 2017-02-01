import * as constants from '../actions/constants';
import createReducer from '../utils/create-reducer';

const initialState = {
  login: {
    user: {},
    lastAction: null,
    error: {},
  },
  createUser: {
    user: {},
    lastAction: null,
    error: {},
  },
  getPrototypes: {
    prototypes: {},
    lastAction: null,
    error: {},
  },
  createPrototype: {
    prototype: {},
    lastAction: null,
    error: {},
  },
};

const actionHandlers = {

  /* --- User Login --- */
  [constants.LOGIN]: (state, action) => ({
    login: {
      user: action.user,
      lastAction: action.type,
      error: action.error,
    },
  }),
  [constants.LOGOUT]: (state, action) => ({
    login: {
      user: action.user,
      lastAction: action.type,
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

  /* --- Create User --- */
  [constants.CREATE_USER]: (state, action) => ({
    createUser: {
      user: action.user,
      lastAction: action.type,
      error: action.error,
    },
  }),

  /* --- Prototypes */
  [constants.GET_PROTOTYPES]: (state, action) => ({
    getPrototypes: {
      prototypes: action.prototypes,
      lastAction: action.type,
      error: action.error,
    },
  }),
  [constants.CREATE_PROTOTYPE]: (state, action) => ({
    createPrototype: {
      prototypes: action.prototype,
      lastAction: action.type,
      error: action.error,
    },
  }),

  /* --- Auto Saving --- */
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
