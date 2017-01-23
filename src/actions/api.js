import 'whatwg-fetch';
import processResponse from '../utils/process-response';
import { get, put, remove } from '../persistence/storage';
import {
  LOGIN_PENDING,
  FETCH_ME,
  LOGIN,
  LOGOUT,
  SAVE,
} from './constants';

const BACKEND_API = 'http://localhost:5000/api/v1';

export function loginPending() {
  return dispatch => dispatch({
    type: LOGIN_PENDING,
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
          type: LOGIN,
          user: { token: data.body.token },
          error: {},
          pending: false,
        });
      })
      .catch((data) => {
        remove('token');

        dispatch({
          type: LOGIN,
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
          type: FETCH_ME,
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
          type: FETCH_ME,
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
    type: LOGOUT,
    user: {},
    error: {},
    pending: false,
  });
}

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
          type: SAVE,
          users: data.body,
          time: date.toUTCString(),
          error: {},
        });
      })
      .catch((data) => {
        dispatch({
          type: SAVE,
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
