import { browserHistory } from 'react-router';
import { serializeQueryObj } from './util';

let BASE = '';

export const setBase = base => BASE = `/${base}`;

export const goTo = url => browserHistory.push(`${BASE}${url}`);

export const getAppPath = url => `${BASE}${url}`;

export const goBack = () => browserHistory.goBack();

export const setQueryParams = query => {
    browserHistory.push(`${location.pathname}?${serializeQueryObj(query)}`);
};
