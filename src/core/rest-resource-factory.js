import * as communication from './communication'

export const create = resource => {

    const cache = {};

    return {
        getItem: itemId => communication.doGet(`/${resource}/${itemId}`),
        getItems: (query, params) => new Promise((resolve, reject) => {
            params = params || {};

            const url = `/${resource}`;

            if (!params.force && params.cache && cache[url]) {
                return resolve(cache[url]);
            }

            communication.doGet(`/${resource}`, query).then(data => {
                if (params.cache) {
                   cache[url] = data;
                }
                

                return resolve(data);
            }, err => reject(err));
        }),
        createItem: data => communication.doPost(`/${resource}`, data),
        updateItem: (itemId, data) => communication.doPut(`/${resource}/${itemId}`, data),
        deleteItem: (itemId, data) => communication.doDelete(`/${resource}/${itemId}`),
    };
};