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
        body: bodyCopy,
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
