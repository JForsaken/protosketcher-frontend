import 'whatwg-fetch';
import processResponse from '../utils/process-response';
import { put } from '../persistence/storage';
import {
  LOGIN_PENDING,
  LOGIN_SUCCESS,
  LOGIN_FAILED,
} from './constants';

const BACKEND_API = 'http://localhost:5000/api/v1';

export function loginPending() {
  return dispatch => dispatch({
    type: LOGIN_PENDING,
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
          type: LOGIN_SUCCESS,
          user: data.body,
          errors: false,
        });
      })
      .catch(() => {
        dispatch({
          type: LOGIN_FAILED,
          errors: true,
          pending: false,
        });
      });
  };
}
