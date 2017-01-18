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
        statusCode: response.status,
        statusText: response.statusText,
        url: response.url,
      };
    }

    const objectToThrow = {
      body: bodyCopy,
      url: response.url,
      statusText: response.statusText,
      statusCode: response.status,
    };

    throw objectToThrow;
  });
}
