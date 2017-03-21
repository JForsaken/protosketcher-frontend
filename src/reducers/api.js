import * as constants from '../actions/constants';
import createReducer from '../utils/create-reducer';

const initialState = {
  lastAction: null,
  lastCallError: null,
  login: {
    user: {},
    lastAction: null,
    time: null,
    error: {},
  },
  createUser: {
    user: {},
    time: null,
    error: {},
  },
  getPrototypes: {
    prototypes: {},
    time: null,
    error: {},
  },
  createPrototype: {
    prototype: {},
    time: null,
    error: {},
  },
  deletePrototype: {
    prototypeId: null,
    time: null,
    error: {},
  },
  getPages: {
    pages: {},
    time: null,
    error: {},
  },
  getPageTypes: {
    pageTypes: {},
    time: null,
    error: {},
  },
  createPage: {
    pages: {},
    time: null,
    error: {},
  },
  getShapes: {
    pages: {},
    requestedPage: null,
    time: null,
    error: {},
  },
  getShapeTypes: {
    shapeTypes: {},
    time: null,
    error: {},
  },
  createShape: {
    shape: {},
    time: null,
    error: {},
  },
  patchShape: {
    shape: {},
    time: null,
    error: {},
  },
  deleteShape: {
    shape: {},
    time: null,
    error: {},
  },
  getTexts: {
    texts: {},
    requestedPage: null,
    time: null,
    error: {},
  },
  createText: {
    text: {},
    time: null,
    error: {},
  },
  patchText: {
    text: {},
    time: null,
    error: {},
  },
  deleteText: {
    text: {},
    time: null,
    error: {},
  },
  getActionTypes: {
    actionTypes: {},
    time: null,
    error: {},
  },
};

const actionHandlers = {

  /* --- User Login --- */
  [constants.LOGIN]: (state, action) => ({
    lastAction: action.type,
    lastCallError: action.error,
    login: {
      user: action.user,
      lastAction: action.type,
      time: action.time,
      error: action.error,
    },
  }),
  [constants.LOGOUT]: (state, action) => ({
    lastAction: action.type,
    lastCallError: action.error,
    login: {
      user: action.user,
      lastAction: action.type,
      time: action.time,
      error: action.error,
    },
  }),
  [constants.FETCH_ME]: (state, action) => ({
    lastAction: action.type,
    lastCallError: action.error,
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
    lastCallError: action.error,
    createUser: {
      user: action.user,
      time: action.time,
      error: action.error,
    },
  }),

  /* --- Prototypes */
  [constants.GET_PROTOTYPES]: (state, action) => ({
    lastAction: action.type,
    lastCallError: action.error,
    getPrototypes: {
      prototypes: action.prototypes,
      time: action.time,
      error: action.error,
    },
  }),
  [constants.CREATE_PROTOTYPE]: (state, action) => ({
    lastAction: action.type,
    lastCallError: action.error,
    createPrototype: {
      prototypes: action.prototype,
      time: action.time,
      error: action.error,
    },
  }),
  [constants.DELETE_PROTOTYPE]: (state, action) => ({
    lastAction: action.type,
    lastCallError: action.error,
    deletePrototype: {
      prototypeId: action.prototypeId,
      time: action.time,
      error: action.error,
    },
  }),

  /* --- Pages --- */
  [constants.GET_PAGES]: (state, action) => ({
    lastAction: action.type,
    lastCallError: action.error,
    getPages: {
      pages: action.pages,
      time: action.time,
      error: action.error,
    },
  }),
  [constants.GET_PAGE_TYPES]: (state, action) => ({
    lastAction: action.type,
    lastCallError: action.error,
    getPageTypes: {
      pageTypes: action.pageTypes.reduce((acc, curr) => ({
        ...acc,
        [curr.id]: curr.type,
      }), {}),
      time: action.time,
      error: action.error,
    },
  }),
  [constants.CREATE_PAGE]: (state, action) => ({
    lastAction: action.type,
    lastCallError: action.error,
    createPage: {
      page: action.page,
      time: action.time,
      error: action.error,
    },
  }),

/* --- Shapes ---*/
  [constants.GET_SHAPES]: (state, action) => ({
    lastAction: action.type,
    lastCallError: action.error,
    getShapes: {
      shapes: action.shapes,
      requestedPage: action.requestedPage,
      time: action.time,
      error: action.error,
    },
  }),
  [constants.GET_SHAPE_TYPES]: (state, action) => ({
    lastAction: action.type,
    lastCallError: action.error,
    getShapeTypes: {
      shapeTypes: action.shapeTypes.reduce((acc, curr) => ({
        ...acc,
        [curr.id]: curr.type,
      }), {}),
      time: action.time,
      error: action.error,
    },
  }),
  [constants.CREATE_SHAPE]: (state, action) => ({
    lastAction: action.type,
    lastCallError: action.error,
    createShape: {
      shape: action.shape,
      time: action.time,
      error: action.error,
    },
  }),
  [constants.PATCH_SHAPE]: (state, action) => ({
    lastAction: action.type,
    lastCallError: action.error,
    patchShape: {
      shape: action.shape,
      time: action.time,
      error: action.error,
    },
  }),
  [constants.DELETE_SHAPE]: (state, action) => ({
    lastAction: action.type,
    lastCallError: action.error,
    deleteShape: {
      shape: action.shape,
      time: action.time,
      error: action.error,
    },
  }),

/* --- Texts ---*/
  [constants.GET_TEXTS]: (state, action) => ({
    lastAction: action.type,
    lastCallError: action.error,
    getTexts: {
      texts: action.texts,
      requestedPage: action.requestedPage,
      time: action.time,
      error: action.error,
    },
  }),
  [constants.CREATE_TEXT]: (state, action) => ({
    lastAction: action.type,
    lastCallError: action.error,
    createText: {
      text: action.text,
      time: action.time,
      error: action.error,
    },
  }),
  [constants.PATCH_TEXT]: (state, action) => ({
    lastAction: action.type,
    lastCallError: action.error,
    patchText: {
      text: action.text,
      time: action.time,
      error: action.error,
    },
  }),
  [constants.DELETE_TEXT]: (state, action) => ({
    lastAction: action.type,
    lastCallError: action.error,
    deleteText: {
      text: action.text,
      time: action.time,
      error: action.error,
    },
  }),

  /* CONTROLS */
  [constants.GET_ACTION_TYPES]: (state, action) => ({
    lastAction: action.type,
    lastCallError: action.error,
    getActionTypes: {
      actionTypes: action.actionTypes.reduce((acc, curr) => ({
        ...acc,
        [curr.id]: curr.type,
      }), {}),
      time: action.time,
      error: action.error,
    },
  }),
};

export default createReducer(initialState, actionHandlers);
