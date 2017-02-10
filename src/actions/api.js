import 'whatwg-fetch';
import processResponse from '../utils/process-response';
import { put, remove } from '../persistence/storage';
import * as constants from './constants';

const BACKEND_API = 'http://localhost:5000/api/v1';


/* --- User Login --- */

export function login(loginAttempt) {
  const date = new Date();

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
          time: date.toUTCString(),
          error: {},
        });
      })
      .catch((data) => {
        dispatch({
          type: constants.LOGIN,
          user: {},
          time: date.toUTCString(),
          error: {
            msg: data.msg,
            code: data.code,
          },
        });
      });
  };
}

export function fetchMe(token) {
  const date = new Date();

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
          time: date.toUTCString(),
          error: {},
        });
      })
      .catch((data) => {
        remove('token');

        dispatch({
          type: constants.FETCH_ME,
          user: {},
          time: date.toUTCString(),
          error: {
            msg: data.msg,
            code: data.code,
          },
        });
      });
  };
}

/* --- Create User --- */
export function createUser(userCredentials) {
  const date = new Date();

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
          time: date.toUTCString(),
          error: {},
        });
      })
      .catch((data) => {
        dispatch({
          type: constants.CREATE_USER,
          user: {},
          time: date.toUTCString(),
          error: {
            msg: data.msg,
            code: data.code,
          },
        });
      });
  };
}


/* --- Prototypes --- */
export function getPrototypes(token) {
  const date = new Date();

  return dispatch => {
    fetch(`${BACKEND_API}/prototypes`, {
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
          delete cur.__v;
        });

        dispatch({
          type: constants.GET_PROTOTYPES,
          prototypes: data.body,
          time: date.toUTCString(),
          error: {},
        });
      })
      .catch((data) => {
        dispatch({
          type: constants.GET_PROTOTYPES,
          prototypes: {},
          time: date.toUTCString(),
          error: {
            msg: data.msg,
            code: data.code,
          },
        });
      });
  };
}

export function createPrototype(prototype, token) {
  const date = new Date();

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
        const proto = data.body;
        proto.id = proto._id;
        delete proto._id;
        delete proto.__v;

        dispatch({
          type: constants.CREATE_PROTOTYPE,
          prototype: proto,
          time: date.toUTCString(),
          error: {},
        });
      })
      .catch((data) => {
        dispatch({
          type: constants.CREATE_PROTOTYPE,
          prototype: {},
          time: date.toUTCString(),
          error: {
            msg: data.msg,
            code: data.code,
          },
        });
      });
  };
}
