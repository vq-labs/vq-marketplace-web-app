import 'whatwg-fetch';
import { getToken } from './auth'
import { serializeQueryObj, parseJSON } from './util'
import CONFIG from '../generated/ConfigProvider.js'

const API_URL = CONFIG.API_URL;

export const doGet = (url, queryObject) => {
    url = API_URL + url;

    if (queryObject) {
        url += `?${serializeQueryObj(queryObject)}`;
    }

    const xAuthToken = getToken();

    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': xAuthToken
        }
    })
    .then(response => { 
        return parseJSON(response);
    });
};

export const doPost = (url, body) => fetch(API_URL + url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': getToken()
    },
    body: JSON.stringify(body || {})
})
.then(response => { 
        return parseJSON(response);
});

export const doPut = (url, body) => fetch(API_URL + url, {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': getToken()
    },
    body: JSON.stringify(body || {})
})
.then(response => { 
        return parseJSON(response);
});

export const doDelete = (url, body) => fetch(API_URL + url, {
    method: 'DELETE',
    headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': getToken()
    },
    body: JSON.stringify(body || {})
})
.then(response => { 
        return parseJSON(response);
});
