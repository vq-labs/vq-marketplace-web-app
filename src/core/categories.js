let CATEGORIES = null;

let listeners = [];

export const set = categories => {
    CATEGORIES = categories;

    listeners
        .forEach(fn => fn(categories));

    listeners = [];
};

export const getCategoriesAsync = cb => {
    if (CATEGORIES) {
        return cb(CATEGORIES);
    }

    listeners.push(cb);
};
