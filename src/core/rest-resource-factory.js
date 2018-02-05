import * as communication from './communication'

export const create = (resource, transformers) => {
    let cache = localStorage.getItem(`VQ_CACHE_${resource.toUpperCase()}`);
    var outstandingUpdate;

    cache = cache ? JSON.parse(cache) : {};
   
    return {
        getItem: (itemId, byProp, query) => communication.doGet(`/${resource}/${itemId}${byProp ? '/' + byProp : ''}`, query),
        getItems: (query, params) => new Promise((resolve, reject) => {
            let resolved = false;

            params = params || {};

            const url = `/${resource}`;

            if (!params.force && params.cache && cache[url]) {
                resolved = true;

                resolve(cache[url]);
            }

            communication.doGet(`/${resource}`, query).then(data => {
                const getItemsTransformer = transformers ? transformers.getItems : data => data;

                data = getItemsTransformer(data, params.returnRaw);

                if (params.cache) {
                   cache[url] = data;
                   localStorage.setItem(`VQ_CACHE_${resource.toUpperCase()}`, JSON.stringify(cache));
                }

                return !resolved && resolve(data);
            }, err => reject(err));
        }),
        createItem: data => communication.doPost(`/${resource}`, data),
        updateItem: (itemId, data, delay) => new Promise((resolve, reject) => {
            if (delay) {
                clearTimeout(outstandingUpdate);
                outstandingUpdate = null;

                outstandingUpdate = setTimeout(() => {
                    communication.doPut(`/${resource}/${itemId}`, data);

                    return resolve();
                }, delay);

                return;
            }

            communication.doPut(`/${resource}/${itemId}`, data)
            .then(resolve, reject);
        }),
        deleteItem: (itemId, data) => communication.doDelete(`/${resource}/${itemId}`),
    };
};