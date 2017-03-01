import 'whatwg-fetch';
import processResponse from '../utils/process-response';
import { put, remove } from '../persistence/storage';
import * as constants from './constants';

const BACKEND_API = 'http://localhost:5000/api/v1';


/* --- User Login --- */

export function login(loginAttempt) {
  return dispatch => {
    fetch(`${BACKEND_API}/authenticate`, {
      method: 'POST',
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
          time: Date.now(),
          error: {},
        });
      })
      .catch((data) => {
        dispatch({
          type: constants.LOGIN,
          user: {},
          time: Date.now(),
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
          type: constants.FETCH_ME,
          user: {
            id: data.body.id,
            email: data.body.email,
            token,
          },
          time: Date.now(),
          error: {},
        });
      })
      .catch((data) => {
        remove('token');

        dispatch({
          type: constants.FETCH_ME,
          user: {},
          time: Date.now(),
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
  return dispatch => {
    fetch(`${BACKEND_API}/users`, {
      method: 'POST',
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
          time: Date.now(),
          error: {},
        });
      })
      .catch((data) => {
        dispatch({
          type: constants.CREATE_USER,
          user: {},
          time: Date.now(),
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
          time: Date.now(),
          error: {},
        });
      })
      .catch((data) => {
        dispatch({
          type: constants.GET_PROTOTYPES,
          prototypes: {},
          time: Date.now(),
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
          time: Date.now(),
          error: {},
        });
      })
      .catch((data) => {
        dispatch({
          type: constants.CREATE_PROTOTYPE,
          prototype: {},
          time: Date.now(),
          error: {
            msg: data.msg,
            code: data.code,
          },
        });
      });
  };
}

export function patchPrototype(prototype, token) {
  return dispatch => {
    fetch(`${BACKEND_API}/prototypes/${prototype.id}`, {
      method: 'PATCH',
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
          type: constants.PATCH_PROTOTYPE,
          prototype: data.body,
          time: Date.now(),
          error: {},
        });
      })
      .catch((data) => {
        dispatch({
          type: constants.PATCH_PROTOTYPE,
          prototype: {},
          time: Date.now(),
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
        dispatch({
          type: constants.GET_PAGES,
          pages: data.body,
          requestedPrototype: prototypeId,
          time: Date.now(),
          error: {},
        });
      })
      .catch((data) => {
        dispatch({
          type: constants.GET_PAGES,
          pages: {},
          requestedPrototype: prototypeId,
          time: Date.now(),
          error: {
            msg: data.msg,
            code: data.code,
          },
        });
      });
  };
}

export function getPageTypes(token) {
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
        dispatch({
          type: constants.GET_PAGE_TYPES,
          pageTypes: data.body,
          time: Date.now(),
          error: {},
        });
      })
      .catch((data) => {
        dispatch({
          type: constants.GET_PAGE_TYPES,
          pageTypes: {},
          time: Date.now(),
          error: {
            msg: data.msg,
            code: data.code,
          },
        });
      });
  };
}

export function createPage(prototypeId, page, token) {
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
        dispatch({
          type: constants.CREATE_PAGE,
          page: data.body,
          requestedPrototype: prototypeId,
          time: Date.now(),
          error: {},
        });
      })
      .catch((data) => {
        dispatch({
          type: constants.CREATE_PAGE,
          page: {},
          requestedPrototype: prototypeId,
          time: Date.now(),
          error: {
            msg: data.msg,
            code: data.code,
          },
        });
      });
  };
}

export function patchPage(prototypeId, pageId, page, token) {
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
        dispatch({
          type: constants.PATCH_PAGE,
          page: data.body,
          requestedPrototype: prototypeId,
          time: Date.now(),
          error: {},
        });
      })
      .catch((data) => {
        dispatch({
          type: constants.PATCH_PAGE,
          page: {},
          requestedPrototype: prototypeId,
          time: Date.now(),
          error: {
            msg: data.msg,
            code: data.code,
          },
        });
      });
  };
}

export function deletePage(prototypeId, pageId, token) {
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
        dispatch({
          type: constants.DELETE_PAGE,
          page: data.body,
          requestedPrototype: prototypeId,
          time: Date.now(),
          error: {},
        });
      })
      .catch((data) => {
        dispatch({
          type: constants.DELETE_PAGE,
          page: {},
          requestedPrototype: prototypeId,
          time: Date.now(),
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
        dispatch({
          type: constants.GET_SHAPES,
          shapes: data.body,
          requestedPrototype: prototypeId,
          requestedPage: pageId,
          time: Date.now(),
          error: {},
        });
      })
      .catch((data) => {
        dispatch({
          type: constants.GET_SHAPES,
          shapes: {},
          requestedPrototype: prototypeId,
          requestedPage: pageId,
          time: Date.now(),
          error: {
            msg: data.msg,
            code: data.code,
          },
        });
      });
  };
}

export function getShapeTypes(token) {
  return dispatch => {
    fetch(`${BACKEND_API}/shapetypes`, {
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
          type: constants.GET_SHAPE_TYPES,
          shapeTypes: data.body,
          time: Date.now(),
          error: {},
        });
      })
      .catch((data) => {
        dispatch({
          type: constants.GET_SHAPE_TYPES,
          shapeTypes: {},
          time: Date.now(),
          error: {
            msg: data.msg,
            code: data.code,
          },
        });
      });
  };
}


export function createShape(prototypeId, pageId, shape, token) {
  return dispatch => {
    fetch(`${BACKEND_API}/prototypes/${prototypeId}/pages/${pageId}/shapes`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
      body: JSON.stringify(shape),
    })
      .then(processResponse)
      .then(data => {
        dispatch({
          type: constants.CREATE_SHAPE,
          shape: data.body,
          requestedPrototype: prototypeId,
          requestedPage: pageId,
          time: Date.now(),
          error: {},
        });
      })
      .catch((data) => {
        dispatch({
          type: constants.CREATE_SHAPE,
          shape: {},
          requestedPrototype: prototypeId,
          requestedPage: pageId,
          time: Date.now(),
          error: {
            msg: data.msg,
            code: data.code,
          },
        });
      });
  };
}

export function patchShape(prototypeId, pageId, shapeId, shape, token) {
  return dispatch => {
    fetch(`${BACKEND_API}/prototypes/${prototypeId}/pages/${pageId}/shapes/${shapeId}`, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
      body: JSON.stringify(shape),
    })
      .then(processResponse)
      .then(data => {
        dispatch({
          type: constants.PATCH_SHAPE,
          shape: data.body,
          requestedPrototype: prototypeId,
          requestedPage: pageId,
          time: Date.now(),
          error: {},
        });
      })
      .catch((data) => {
        dispatch({
          type: constants.PATCH_SHAPE,
          shape: {},
          requestedPrototype: prototypeId,
          requestedPage: pageId,
          time: Date.now(),
          error: {
            msg: data.msg,
            code: data.code,
          },
        });
      });
  };
}

export function deleteShape(prototypeId, pageId, shapeId, token) {
  return dispatch => {
    fetch(`${BACKEND_API}/prototypes/${prototypeId}/pages/${pageId}/shapes/${shapeId}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
    })
      .then(processResponse)
      .then(data => {
        dispatch({
          type: constants.DELETE_SHAPE,
          shape: data.body,
          requestedPrototype: prototypeId,
          requestedPage: pageId,
          time: Date.now(),
          error: {},
        });
      })
      .catch((data) => {
        dispatch({
          type: constants.DELETE_SHAPE,
          shape: {},
          requestedPrototype: prototypeId,
          requestedPage: pageId,
          time: Date.now(),
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
        dispatch({
          type: constants.GET_TEXTS,
          texts: data.body,
          requestedPrototype: prototypeId,
          requestedPage: pageId,
          time: Date.now(),
          error: {},
        });
      })
      .catch((data) => {
        dispatch({
          type: constants.GET_TEXTS,
          texts: {},
          requestedPrototype: prototypeId,
          requestedPage: pageId,
          time: Date.now(),
          error: {
            msg: data.msg,
            code: data.code,
          },
        });
      });
  };
}

export function createText(prototypeId, pageId, text, token) {
  return dispatch => {
    fetch(`${BACKEND_API}/prototypes/${prototypeId}/pages/${pageId}/texts`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
      body: JSON.stringify(text),
    })
      .then(processResponse)
      .then(data => {
        dispatch({
          type: constants.CREATE_TEXT,
          text: data.body,
          requestedPrototype: prototypeId,
          requestedPage: pageId,
          time: Date.now(),
          error: {},
        });
      })
      .catch((data) => {
        dispatch({
          type: constants.CREATE_TEXT,
          text: {},
          requestedPrototype: prototypeId,
          requestedPage: pageId,
          time: Date.now(),
          error: {
            msg: data.msg,
            code: data.code,
          },
        });
      });
  };
}
