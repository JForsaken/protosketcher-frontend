import * as constants from '../actions/constants';
import createReducer from '../utils/create-reducer';
import { isEmpty, omit } from 'lodash';

const initialState = {
  token: null,
  locale: 'en',
  locales: [
    'en',
    'fr',
  ],
  error: null,
  user: null,
  selectedPrototype: null,
  selectedPage: null,
  prototypes: {},
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

  const currentPrototypes = state.prototypes || {};

  return {
    prototypes: {
      ...currentPrototypes,
      ...dict,
    },
  };
}

function onCreatePrototype(state, action) {
  if (!isEmpty(action.error)) {
    return { ...state };
  }

  const newProto = {};
  newProto[action.prototype.id] = omit(action.prototype, ['user', 'id']);

  return {
    prototypes: {
      ...state.prototypes,
      ...newProto,
    },
  };
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
  [constants.GET_PROTOTYPES]: (state, action) => onGetPrototypes(state, action),
  [constants.CREATE_PROTOTYPE]: (state, action) => onCreatePrototype(state, action),
};

export default createReducer(initialState, actionHandlers);
