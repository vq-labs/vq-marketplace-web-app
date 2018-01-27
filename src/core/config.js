let listeners = [];

export let ready = false;
export let CONFIG = {};

export const set = config => {
    CONFIG = config;
    ready = true;

    listeners
        .forEach(fn => fn(config));

    listeners = [];
};

export const getConfigAsync = cb => {
    if (CONFIG && ready) {
        return cb(CONFIG);
    }

    listeners.push(cb);
};
