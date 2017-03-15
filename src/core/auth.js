const listeners = {
    logout: [],
    login: []
};

let user = null;
let userId = null;
let token = null;

const emitChange = eventName => {
    listeners[eventName].forEach(fn => fn());
};

export const addListener = (eventName, fn) => {
    listeners[eventName].push(fn);
};

export const loadFromLocalStorage = () => {
    userId = localStorage.getItem('ST_AUTH_USERID');
    token = localStorage.getItem('ST_AUTH_TOKEN');

    if (userId && token) {
        emitChange('login');
    }
};

export const setUser = _user => {
    user = _user;
};

export const setUserId = id => {
    localStorage.setItem('ST_AUTH_USERID', id);
    userId = id;
};

export const setToken = tk => {
    localStorage.setItem('ST_AUTH_TOKEN', tk);
    token = tk;

    tk && emitChange('login');
};

export const isAdmin = () => user && user.isAdmin;

export const getUserId = () => userId;

export const getToken = () => token;

export const destroy = () => {
    setToken(null);
    setUserId(null);

    emitChange('logout');
};