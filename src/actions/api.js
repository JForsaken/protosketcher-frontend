import 'whatwg-fetch';
import processResponse from '../utils/process-response';
import { put, remove } from '../persistence/storage';
import {
  LOGIN_PENDING,
  FETCH_ME,
  API_FAILED,
  LOGIN,
  LOGOUT,
} from './constants';

const BACKEND_API = 'http://localhost:5000/api/v1';

export function loginPending() {
  return dispatch => dispatch({
    type: LOGIN_PENDING,
    user: {},
    pending: true,
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
          token: data.body.token,
          user: data.body,
          pending: false,
        });
      })
      .catch(() => {
        remove('token');

        dispatch({
          type: API_FAILED,
          pending: false,
          msg: data.msg,
          code: data.code,
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
          user: { ...data.body, token },
        });
      })
      .catch((data) => {
        dispatch({
          type: API_FAILED,
          pending: false,
          msg: data.msg,
          code: data.code,
        });
      });
  };
}

export function logout() {
  remove('token');

  return dispatch => dispatch({
    type: LOGOUT,
    user: {},
    errors: false,
    pending: true,
  });
}
