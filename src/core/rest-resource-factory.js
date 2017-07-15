import * as communication from './communication'

export const create = (resource, transformers) => {
    let cache = localStorage.getItem(`VQ_CACHE_${resource.toUpperCase()}`);
    
    cache = cache ? JSON.parse(cache) : {};
   
    return {
        getItem: itemId => communication.doGet(`/${resource}/${itemId}`),
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
        updateItem: (itemId, data) => communication.doPut(`/${resource}/${itemId}`, data),
        deleteItem: (itemId, data) => communication.doDelete(`/${resource}/${itemId}`),
    };
};