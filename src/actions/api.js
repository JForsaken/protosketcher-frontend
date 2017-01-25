import 'whatwg-fetch';
import processResponse from '../utils/process-response';
import { get, put, remove } from '../persistence/storage';
import * as constants from './constants';

const BACKEND_API = 'http://localhost:5000/api/v1';


/* --- User Login --- */
export function loginPending() {
  return dispatch => dispatch({
    type: constants.LOGIN_PENDING,
    user: {},
    pending: true,
    error: {},
  });
}

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
          pending: false,
        });
      })
      .catch((data) => {
        dispatch({
          type: constants.LOGIN,
          user: {},
          pending: false,
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
    pending: false,
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
          pending: false,
        });
      })
      .catch((data) => {
        dispatch({
          type: constants.CREATE_USER,
          pending: false,
          user: {},
          error: {
            msg: data.msg,
            code: data.code,
          },
        });
      });
  };
}

export function createUserPending() {
  return dispatch => dispatch({
    type: constants.CREATE_USER_PENDING,
    user: {},
    pending: true,
    error: {},
  });
}


/* --- Auto Saving --- */
export function save() {
  const date = new Date();

  return dispatch => {
    // TODO: replace with the actual save call
    fetch(`${BACKEND_API}/users/`, {
      method: 'get',
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
