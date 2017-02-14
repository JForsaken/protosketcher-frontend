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
            id: data.body.id,
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

export function logout() {
  const date = new Date();

  remove('token');

  return dispatch => dispatch({
    type: constants.LOGOUT,
    user: {},
    time: date.toUTCString(),
    error: {},
  });
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
    fetch(`${BACKEND_API}/prototypes?attributes=name,isMobile`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
    })
      .then(processResponse)
      .then(data => {
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
      method: 'POST',
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

/* --- Pages --- */
export function getPages(prototypeId, token) {
  const date = new Date();

  return dispatch => {
    fetch(`${BACKEND_API}/prototypes/${prototypeId}/pages?attributes=name,pageTypeId`, {
      method: 'GET',
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
          type: constants.GET_PAGES,
          pages: data.body,
          time: date.toUTCString(),
          error: {},
        });
      })
      .catch((data) => {
        dispatch({
          type: constants.GET_PAGES,
          pages: {},
          time: date.toUTCString(),
          error: {
            msg: data.msg,
            code: data.code,
          },
        });
      });
  };
}

export function getPageTypes(token) {
  const date = new Date();

  return dispatch => {
    fetch(`${BACKEND_API}/pagetypes?attributes=type`, {
      method: 'GET',
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
          type: constants.GET_PAGE_TYPES,
          pageTypes: data.body,
          time: date.toUTCString(),
          error: {},
        });
      })
      .catch((data) => {
        dispatch({
          type: constants.GET_PAGE_TYPES,
          pageTypes: {},
          time: date.toUTCString(),
          error: {
            msg: data.msg,
            code: data.code,
          },
        });
      });
  };
}

export function createPage(prototypeId, page, token) {
  const date = new Date();

  return dispatch => {
    fetch(`${BACKEND_API}/prototypes/${prototypeId}/pages?attributes=name,pageTypeId`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
      body: JSON.stringify(page),
    })
      .then(processResponse)
      .then((data) => {
        const el = data.body;
        el.id = el._id;
        delete el._id;
        delete el.__v;

        dispatch({
          type: constants.CREATE_PAGE,
          page: el,
          time: date.toUTCString(),
          error: {},
        });
      })
      .catch((data) => {
        dispatch({
          type: constants.CREATE_PAGE,
          page: {},
          time: date.toUTCString(),
          error: {
            msg: data.msg,
            code: data.code,
          },
        });
      });
  };
}

export function patchPage(prototypeId, pageId, page, token) {
  const date = new Date();

  return dispatch => {
    fetch(`${BACKEND_API}/prototypes/${prototypeId}/pages/${pageId}?attributes=name,pageTypeId`, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
      body: JSON.stringify(page),
    })
      .then(processResponse)
      .then((data) => {
        const el = data.body;
        el.id = el._id;
        delete el._id;
        delete el.__v;

        dispatch({
          type: constants.PATCH_PAGE,
          page: el,
          time: date.toUTCString(),
          error: {},
        });
      })
      .catch((data) => {
        dispatch({
          type: constants.PATCH_PAGE,
          page: {},
          time: date.toUTCString(),
          error: {
            msg: data.msg,
            code: data.code,
          },
        });
      });
  };
}

export function deletePage(prototypeId, pageId, token) {
  const date = new Date();

  return dispatch => {
    fetch(`${BACKEND_API}/prototypes/${prototypeId}/pages/${pageId}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
    })
      .then(processResponse)
      .then((data) => {
        const el = data.body;
        el.id = el._id;
        delete el._id;
        delete el.__v;

        dispatch({
          type: constants.DELETE_PAGE,
          page: el,
          time: date.toUTCString(),
          error: {},
        });
      })
      .catch((data) => {
        dispatch({
          type: constants.DELETE_PAGE,
          page: {},
          time: date.toUTCString(),
          error: {
            msg: data.msg,
            code: data.code,
          },
        });
      });
  };
}

/* --- Shapes ---*/
export function getShapes(prototypeId, pageId, token) {
  const date = new Date();

  return dispatch => {
    fetch(`${BACKEND_API}/prototypes/${prototypeId}/pages/${pageId}/shapes`, {
      method: 'GET',
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
          type: constants.GET_SHAPES,
          shapes: data.body,
          time: date.toUTCString(),
          error: {},
        });
      })
      .catch((data) => {
        dispatch({
          type: constants.GET_SHAPES,
          shapes: {},
          time: date.toUTCString(),
          error: {
            msg: data.msg,
            code: data.code,
          },
        });
      });
  };
}

/* --- Texts ---*/
export function getTexts(prototypeId, pageId, token) {
  const date = new Date();

  return dispatch => {
    fetch(`${BACKEND_API}/prototypes/${prototypeId}/pages/${pageId}/texts`, {
      method: 'GET',
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
          type: constants.GET_TEXTS,
          texts: data.body,
          time: date.toUTCString(),
          error: {},
        });
      })
      .catch((data) => {
        dispatch({
          type: constants.GET_TEXTS,
          texts: {},
          time: date.toUTCString(),
          error: {
            msg: data.msg,
            code: data.code,
          },
        });
      });
  };
}

