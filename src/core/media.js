import 'whatwg-fetch';
import { serializeQueryObj, parseJSON } from './util'
import { getToken } from './auth'

export const uploadImageFactory = url => (file, queryObject) => new Promise((resolve, reject) => {
    const data = new FormData()
    let urlWithQuery = url;

    queryObject = queryObject || {};
    queryObject.json = true;

    if (queryObject) {
        urlWithQuery += `?${serializeQueryObj(queryObject)}`;
    }

    data.append('file', file, file.name);

    fetch(urlWithQuery, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'X-Auth-Token': getToken()
          },
          body: data
      })
    .then(parseJSON)
    .then(result => resolve(result))
    .catch(err => reject(err));
  });
