let CONFIG = null;

let listeners = [];

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
