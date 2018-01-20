let listeners = [];

export let ready = false;
export let CONFIG = {};

export const set = config => {
    CONFIG = config;
    ready = true;

    CONFIG.LISTING_RANGE_FILTER_ENABLED = "1";
    CONFIG.LISTING_RANGE_FILTER_DEFAULT_VALUE = 5000;
    CONFIG.LISTING_RANGE_FILTER_MIN = 2000;
    CONFIG.LISTING_RANGE_FILTER_MAX = 8000;
    CONFIG.LISTING_RANGE_FILTER_STEP = 500;
    CONFIG.LISTING_RANGE_FILTER_DEFAULT_UNIT = 'meters';


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
