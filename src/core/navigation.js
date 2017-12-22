import { browserHistory } from 'react-router';
import { serializeQueryObj } from './util';

let BASE = '';

const history = [];

export const setBase = base => BASE = `/${base}`;

export const goTo = (url, shouldReload) => {
    const newUrl = `${BASE}${url}`;
    const oldUrl = location.pathname;
    
    

    // in production env. we want the admin to always access via https
    /**
    const TENANT_ID = typeof TENANT_ID !== "undefined" ? TENANT_ID : undefined;

    if (
        TENANT_ID
        && newUrl.indexOf('admin') > -1
        && location.hostname !== 'localhost'
        && location.hostname.indexOf('vqmarketplace.com') === -1
        && location.hostname.indexOf('viciqloud.com') === -1
        && location.hostname.indexOf('vq-labs.com') === -1) {
        // Production env. Note the https protocol.
        // eslint-disable-next-line

        if (location.hostname === "clickforwork.hu" || location.hostname === "www.clickforwork.hu") {
            return location.href = `https://${TENANT_ID}.vq-labs.com/app/admin`;
        }

        return location.href = `https://${TENANT_ID}.vqmarketplace.com/app/admin`;
    }
    */

    if (typeof shouldReload === 'function') {
        if (shouldReload(newUrl, oldUrl)) {
            return location.href=`${location.origin}${newUrl}`;
        }

        return browserHistory.push(`${newUrl}`);
    }

    if (shouldReload) {
        return location.href=`${location.origin}${newUrl}`;
    }

    browserHistory.push(`${newUrl}`);
};

export const goStartPage = () => {
    // history.push(`/`);
    // browserHistory.push(`/`);

    window.open('/', '_blank');

    // location.pathname = '/';
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
