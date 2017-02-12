import * as constants from '../actions/constants';
import createReducer from '../utils/create-reducer';

const initialState = {
  lastAction: null,
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
  getPages: {
    pages: {},
    lastAction: null,
    time: null,
    error: {},
  },
};

const actionHandlers = {

  /* --- User Login --- */
  [constants.LOGIN]: (state, action) => ({
    lastAction: action.type,
    login: {
      user: action.user,
      lastAction: action.type,
      time: action.time,
      error: action.error,
    },
  }),
  [constants.LOGOUT]: (state, action) => ({
    lastAction: action.type,
    login: {
      user: action.user,
      lastAction: action.type,
      time: action.time,
      error: action.error,
    },
  }),
  [constants.FETCH_ME]: (state, action) => ({
    lastAction: action.type,
    login: {
      user: action.user,
      lastAction: action.type,
      time: action.time,
      error: action.error,
    },
  }),

  /* --- Create User --- */
  [constants.CREATE_USER]: (state, action) => ({
    lastAction: action.type,
    createUser: {
      user: action.user,
      lastAction: action.type,
      time: action.time,
      error: action.error,
    },
  }),

  /* --- Prototypes */
  [constants.GET_PROTOTYPES]: (state, action) => ({
    lastAction: action.type,
    getPrototypes: {
      prototypes: action.prototypes,
      lastAction: action.type,
      time: action.time,
      error: action.error,
    },
  }),
  [constants.CREATE_PROTOTYPE]: (state, action) => ({
    lastAction: action.type,
    createPrototype: {
      prototypes: action.prototype,
      lastAction: action.type,
      time: action.time,
      error: action.error,
    },
  }),

  /* --- Pages --- */
  [constants.GET_PAGES]: (state, action) => ({
    lastAction: action.type,
    getPages: {
      pages: action.pages,
      lastAction: action.type,
      time: action.time,
      error: action.error,
    },
  }),

/* --- Shapes ---*/
  [constants.GET_SHAPES]: (state, action) => ({
    lastAction: action.type,
    getShapes: {
      shapes: action.shapes,
      lastAction: action.type,
      time: action.time,
      error: action.error,
    },
  }),

/* --- Texts ---*/
  [constants.GET_TEXTS]: (state, action) => ({
    lastAction: action.type,
    getTexts: {
      texts: action.texts,
      lastAction: action.type,
      time: action.time,
      error: action.error,
    },
  }),

};

export default createReducer(initialState, actionHandlers);
