/* eslint no-underscore-dangle: "off" */

import * as constants from '../actions/constants';
import createReducer from '../utils/create-reducer';
import { has, isEmpty, omit, merge } from 'lodash';

const initialState = {
  locale: 'en',
  locales: [
    'en',
    'fr',
  ],
  error: null,
  user: null,
  simulating: false,
  selectedPrototype: null,
  selectedPage: null,
  prototypes: {},
  workspace: {
    currentPos: {
      x: 0,
      y: 0,
    },
    drawColor: '#000000',
    menuHidden: true,
    action: null,
    actionValue: null,
    selectedItems: [],
  },
};

function onGetPrototypes(state, action) {
  if (!isEmpty(action.error)) {
    return { ...state };
  }

  const dict = action.prototypes.reduce((acc, current) => {
    const copy = acc;
    if (!state.prototypes || !state.prototypes[current.id]) {
      copy[current.id] = omit(current, ['user', 'id']);
    }
    return copy;
  }, {});

  merge(state, {
    prototypes: {
      ...dict,
    },
  });

  return state;
}

function onCreatePrototype(state, action) {
  if (!isEmpty(action.error)) {
    return { ...state };
  }

  merge(state, {
    prototypes: {
      [action.prototype.id]: omit(action.prototype, ['user', 'id']),
    },
  });

  return state;
}

function onGetPages(state, action) {
  if (!isEmpty(action.error)) {
    return { ...state };
  }

  const prototype = state.prototypes[action.requestedPrototype];

  const dict = action.pages.reduce((acc, current) => {
    const copy = acc;
    if (!prototype.pages || !prototype.pages[current.id]) {
      copy[current.id] = omit(current, ['id']);
    }
    return copy;
  }, {});

  merge(state, {
    prototypes: {
      [action.requestedPrototype]: {
        pages: {
          ...dict,
        },
      },
    },
  });

  return state;
}

function onCreatePage(state, action) {
  if (!isEmpty(action.error)) {
    return { ...state };
  }

  merge(state, {
    prototypes: {
      [action.requestedPrototype]: {
        pages: {
          [action.page.id]: omit(action.page, ['id']),
        },
      },
    },
  });

  return state;
}

function onPatchPage(state, action) {
  if (!isEmpty(action.error)) {
    return { ...state };
  }

  merge(state, {
    prototypes: {
      [action.requestedPrototype]: {
        pages: {
          [action.page.id]: omit(action.page, ['id']),
        },
      },
    },
  });

  return state;
}

function onDeletePage(state, action) {
  if (!isEmpty(action.error)) {
    return { ...state };
  }

  const data = state;
  delete data.prototypes[action.requestedPrototype].pages[action.page.id];

  return data;
}

function onGetShapes(state, action) {
  if (!isEmpty(action.error)) {
    return { ...state };
  }

  if (isEmpty(action.shapes)) {
    merge(state, {
      prototypes: {
        [action.requestedPrototype]: {
          pages: {
            [action.requestedPage]: {
              shapes: {},
            },
          },
        },
      },
    });
  } else {
    const page = state.prototypes[action.requestedPrototype].pages[action.requestedPage];

    const dict = action.shapes.reduce((acc, current) => {
      const copy = acc;
      if (!page.shapes || !page[current.id]) {
        // clean controls
        current.controls.forEach((o) => {
          const cur = o;
          if (has(cur, '_id')) {
            cur.id = cur._id;
            delete cur._id;
          }
          if (has(cur, '__v')) {
            delete cur.__v;
          }
        });
        copy[current.id] = omit(current, ['id', 'pageId']);
      }
      return copy;
    }, {});

    merge(state, {
      prototypes: {
        [action.requestedPrototype]: {
          pages: {
            [action.requestedPage]: {
              shapes: {
                ...dict,
              },
            },
          },
        },
      },
    });
  }

  return state;
}

function onCreateShape(state, action) {
  if (!isEmpty(action.error)) {
    return { ...state };
  }

  const page = state.prototypes[action.requestedPrototype].pages[action.requestedPage];
  const shapes = omit(page.shapes, action.shape.uuid);

  merge(state, {
    prototypes: {
      [action.requestedPrototype]: {
        pages: {
          [action.requestedPage]: {
            shapes: {
              ...shapes,
              [action.shape.id]: action.shape,
            },
          },
        },
      },
    },
  });

  return state;
}

function onPatchShape(state, action) {
  if (!isEmpty(action.error)) {
    return { ...state };
  }

  merge(state, {
    prototypes: {
      [action.requestedPrototype]: {
        pages: {
          [action.requestedPage]: {
            shapes: {
              [action.shape.id]: action.shape,
            },
          },
        },
      },
    },
  });

  return state;
}

function onDeleteShape(state, action) {
  if (!isEmpty(action.error)) {
    return { ...state };
  }

  const data = state;
  const { requestedPrototype, requestedPage, shape } = action;
  delete data.prototypes[requestedPrototype].pages[requestedPage].shapes[shape.id];

  return data;
}

function onGetTexts(state, action) {
  if (!isEmpty(action.error)) {
    return { ...state };
  }

  if (isEmpty(action.texts)) {
    merge(state, {
      prototypes: {
        [action.requestedPrototype]: {
          pages: {
            [action.requestedPage]: {
              texts: {},
            },
          },
        },
      },
    });
  } else {
    const page = state.prototypes[action.requestedPrototype].pages[action.requestedPage];

    const dict = action.texts.reduce((acc, current) => {
      const copy = acc;
      if (!page.texts || !page[current.id]) {
        copy[current.id] = omit(current, ['id', 'pageId']);
      }
      return copy;
    }, {});

    merge(state, {
      prototypes: {
        [action.requestedPrototype]: {
          pages: {
            [action.requestedPage]: {
              texts: {
                ...dict,
              },
            },
          },
        },
      },
    });
  }

  return state;
}

const actionHandlers = {
  /* --- Locale switcher --- */
  [constants.LOCALE_SWITCHED]: (_, action) => ({ locale: action.payload }),

  /* --- Error logging --- */
  [constants.SHOW_ERROR]: (state, action) => {
    const { payload, source } = action;
    return Object.assign({}, state, {
      error: {
        source,
        message: payload.message,
        statusCode: payload.statusCode || payload.code,
        body: payload.body ||
          (payload instanceof Error ? `${payload.toString()}\n${payload.stack}` : payload),
      },
    });
  },
  [constants.HIDE_ERROR]: state => ({ ...state, ...{ error: null } }),

  /* --- Session persistence --- */
  [constants.FETCH_ME]: (state, action) => ({
    user: {
      id: action.user.id,
      token: action.user.token,
      email: action.user.email,
    },
  }),
  [constants.SELECT_PROTOTYPE]: (state, action) => ({
    selectedPrototype: action.id,
  }),
  [constants.SELECT_PAGE]: (state, action) => ({
    selectedPage: action.id,
  }),
  [constants.UPDATE_WORKSPACE]: (state, action) => ({
    workspace: {
      ...state.workspace,
      ...action.data,
    },
  }),
  [constants.GET_PROTOTYPES]: (state, action) => onGetPrototypes(state, action),
  [constants.CREATE_PROTOTYPE]: (state, action) => onCreatePrototype(state, action),
  [constants.GET_PAGES]: (state, action) => onGetPages(state, action),
  [constants.CREATE_PAGE]: (state, action) => onCreatePage(state, action),
  [constants.PATCH_PAGE]: (state, action) => onPatchPage(state, action),
  [constants.DELETE_PAGE]: (state, action) => onDeletePage(state, action),
  [constants.GET_SHAPES]: (state, action) => onGetShapes(state, action),
  [constants.CREATE_SHAPE]: (state, action) => onCreateShape(state, action),
  [constants.PATCH_SHAPE]: (state, action) => onPatchShape(state, action),
  [constants.DELETE_SHAPE]: (state, action) => onDeleteShape(state, action),
  [constants.GET_TEXTS]: (state, action) => onGetTexts(state, action),

  [constants.LOGOUT]: () => ({
    user: null,
    selectedPrototype: null,
    selectedPage: null,
    prototypes: {},
  }),

  [constants.PATCH_PROTOTYPE]: (state, action) => {
    const { id, name } = action.prototype;
    const prototypes = state.prototypes;
    prototypes[id].name = name;

    return Object.assign({}, state, {
      prototypes,
    });
  },

  /* --- Menu --- */
  [constants.REDIRECT_DASHBOARD]: () => ({
    selectedPrototype: null,
    selectedPage: null,
  }),

  [constants.TOGGLE_SIMULATION]: (state) => ({
    simulating: !state.simulating,
  }),

};

export default createReducer(initialState, actionHandlers);
