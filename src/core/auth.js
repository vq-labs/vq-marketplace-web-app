const listeners = {
    logout: [],
    login: []
};

const authCb = [];
const nullableAuthCb = [];

let user = null;
let userId = null;
let token = null;

const emitChange = eventName => {
    listeners[eventName].forEach(fn => fn());
};

export const getUserAsync = (cb, nullable) => {
    if (user) {
        return cb(user);
    }

    if (nullable) {
        nullableAuthCb.push(cb);
    } else {
        authCb.push(cb);
    }
};

export const EVENTS = {
    'login': 'login',
    'logout': 'logout',
    'auth': 'auth'
};

export const addListener = (eventName, fn, tryExecuteNow) => {
    listeners[eventName]
    .push(fn);

    if (tryExecuteNow) {
        fn();
    }
};

export const loadFromLocalStorage = () => {
    user = JSON.parse(localStorage.getItem('VQ_USER'));
    userId = localStorage.getItem('ST_AUTH_USERID');
    token = localStorage.getItem('ST_AUTH_TOKEN');

    if (user === 'null' || token === 'null') {
        return;
    }

    if (userId && token) {
        emitChange('login');
    }
};

export const setUser = _user => {
    if (user === 'null') {
        return;
    }

    user = _user;

    localStorage.setItem('VQ_USER', JSON.stringify(user));

    if (user) {
        authCb
        .forEach(fn => fn(user));
    } else {
        nullableAuthCb
        .forEach(fn => fn());
    }
};

export const getUser = () => user;

export const setUserId = id => {
    if (user === 'null') {
        return;
    }

    localStorage.setItem('ST_AUTH_USERID', id ? id : '');
    userId = id || '';
};

export const setToken = tk => {
    if (user === 'null') {
        return;
    }

    localStorage.setItem('ST_AUTH_TOKEN', tk ? tk : '');
    token = tk || '';

    tk && emitChange('login');
};

export const isAdmin = () => user && user.isAdmin;

export const getUserId = () => userId === 'null' ? null : userId;

export const getToken = () => token === 'null' ? null : token;

export const destroy = () => {
    setToken(null);
    setUserId(null);
    setUser(null);

    emitChange('logout');
};