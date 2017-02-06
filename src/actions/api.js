import 'whatwg-fetch';
import processResponse from '../utils/process-response';
import { get, put, remove } from '../persistence/storage';
import * as constants from './constants';

const BACKEND_API = 'http://localhost:5000/api/v1';


/* --- User Login --- */

export function login(loginAttempt) {
  return dispatch => {
    fetch(`${BACKEND_API}/authenticate`, {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginAttempt),
    })
      .then(processResponse)
      .then(data => {
        put('token', data.body.token);

        dispatch({
          type: constants.LOGIN,
          user: { token: data.body.token },
          error: {},
        });
      })
      .catch((data) => {
        dispatch({
          type: constants.LOGIN,
          user: {},
          error: {
            msg: data.msg,
            code: data.code,
          },
        });
      });
  };
}

export function fetchMe(token) {
  return dispatch => {
    fetch(`${BACKEND_API}/users/me`, {
      method: 'get',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
    })
      .then(processResponse)
      .then(data => {
        dispatch({
          type: constants.FETCH_ME,
          user: {
            id: data.body._id,
            email: data.body.email,
            token,
          },
          error: {},
        });
      })
      .catch((data) => {
        remove('token');

        dispatch({
          type: constants.FETCH_ME,
          user: {},
          error: {
            msg: data.msg,
            code: data.code,
          },
        });
      });
  };
}

export function logout() {
  remove('token');

  return dispatch => dispatch({
    type: constants.LOGOUT,
    user: {},
    error: {},
  });
}


/* --- Create User --- */
export function createUser(userCredentials) {
  return dispatch => {
    fetch(`${BACKEND_API}/users`, {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userCredentials),
    })
      .then(processResponse)
      .then(() => {
        dispatch({
          type: constants.CREATE_USER,
          user: { email: userCredentials.email },
          error: {},
        });
      })
      .catch((data) => {
        dispatch({
          type: constants.CREATE_USER,
          user: {},
          error: {
            msg: data.msg,
            code: data.code,
          },
        });
      });
  };
}


/* --- Prototypes --- */
export function getPrototypes(userId, token) {
  return dispatch => {
    fetch(`${BACKEND_API}/prototypes?user=${userId}`, {
      method: 'get',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
    })
      .then(processResponse)
      .then(data => {
        // rename _id to id
        data.body.forEach((d) => {
          const cur = d;
          cur.id = cur._id;
          delete cur._id;
        });

        dispatch({
          type: constants.GET_PROTOTYPES,
          prototypes: data.body,
          error: {},
        });
      })
      .catch((data) => {
        dispatch({
          type: constants.GET_PROTOTYPES,
          prototypes: {},
          error: {
            msg: data.msg,
            code: data.code,
          },
        });
      });
  };
}

export function createPrototype(prototype, token) {
  return dispatch => {
    fetch(`${BACKEND_API}/prototypes`, {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
      body: JSON.stringify(prototype),
    })
      .then(processResponse)
      .then((data) => {
        dispatch({
          type: constants.CREATE_PROTOTYPE,
          prototype: data.body,
          error: {},
        });
      })
      .catch((data) => {
        dispatch({
          type: constants.CREATE_PROTOTYPE,
          prototype: {},
          error: {
            msg: data.msg,
            code: data.code,
          },
        });
      });
  };
}

/* --- Auto Saving --- */
export function save() {
  const date = new Date();

  return dispatch => {
    // TODO: replace with the actual save call
    fetch(`${BACKEND_API}/users/`, {

      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': get('token'),
      },
    })
      .then(processResponse)
      .then(data => {
        dispatch({
          type: constants.SAVE,
          users: data.body,
          time: date.toUTCString(),
          error: {},
        });
      })
      .catch((data) => {
        dispatch({
          type: constants.SAVE,
          users: {},
          time: date.toUTCString(),
          error: {
            msg: data.msg,
            code: data.code,
          },
        });
      });
  };
}
