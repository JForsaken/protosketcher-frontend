/* eslint no-underscore-dangle: "off" */

import { has, isArray } from 'lodash';

const cleanBody = (body) => {
  const ref = body;

  const cleanObj = (obj) => {
    const cur = obj;
    if (has(cur, '_id')) {
      cur.id = cur._id;
      delete cur._id;
    }
    if (has(cur, '__v')) {
      delete cur.__v;
    }
  };

  if (isArray(ref)) {
    ref.forEach((o) => cleanObj(o));
  } else {
    cleanObj(ref);
  }

  return ref;
};

export default function processResponse(response) {
  let isOk = response.ok;

  return response.text()
  .then(body => {
    let bodyCopy = body;
    try {
      bodyCopy = JSON.parse(body);
    } catch (error) {
      if (isOk) {
        isOk = false;
      }
    }

    if (isOk) {
      return {
        body: cleanBody(bodyCopy),
        code: response.status,
        msg: response.statusText,
        url: response.url,
      };
    }

    const objectToThrow = {
      body: bodyCopy,
      url: response.url,
      msg: response.statusText,
      code: response.status,
    };

    throw objectToThrow;
  });
}
