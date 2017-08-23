import { browserHistory } from 'react-router';
import { serializeQueryObj } from './util';

let BASE = '';

const history = [];

export const setBase = base => BASE = `/${base}`;

export const goTo = url => {
    history.push(`${BASE}${url}`);
    browserHistory.push(`${BASE}${url}`);
};

export const goStartPage = () => {
    history.push(`/`);
    browserHistory.push(`/`);
};

export const getAppPath = url => `${BASE}${url}`;

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
