import { browserHistory } from 'react-router';
import { serializeQueryObj } from './util';

let BASE = '';

const history = [];

export const setBase = base => BASE = `/${base}`;

export const goTo = (url, shouldReload) => {
    const newUrl = `${BASE}${url}`;
    const oldUrl = location.pathname;

    history.push(`${BASE}${url}`);
    browserHistory.push(`${BASE}${url}`);

    if (typeof shouldReload === 'function') {
        if (shouldReload(newUrl, oldUrl)) {
            return location.reload();
        }

        return;
    }

    if (shouldReload) {
        return location.reload();
    }
};

export const goStartPage = () => {
    // history.push(`/`);
    // browserHistory.push(`/`);
    location.pathname = '/';
    // location.reload();
};

export const getAppPath = url => `${BASE}${url}`;

export const convertToAppPath = url => {
    return url.replace(BASE, ''); 
};

export const goBack = () => {
    history.pop();
    browserHistory.goBack()
};

export const tryGoBack = url => {
    if (history.length > 0) {
        browserHistory.goBack();
    } else {
        browserHistory.push(`${BASE}${url}`);
    }

    history.pop();
}

export const setQueryParams = query => {
    browserHistory.push(`${location.pathname}?${serializeQueryObj(query)}`);
};
