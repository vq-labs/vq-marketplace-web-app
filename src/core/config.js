let listeners = [];

export let CONFIG = {};

export const set = config => {
    CONFIG = config;

    listeners
        .forEach(fn => fn(config));

    listeners = [];
};

export const getConfigAsync = cb => {
    if (CONFIG) {
        return cb(CONFIG);
    }

    listeners.push(cb);
};
