import * as communication from './communication'

export const create = resource => {
    return {
        getItem: itemId => communication.doGet(`/${resource}/${itemId}`),
        getItems: query => communication.doGet(`/${resource}`, query),
        createItem: data => communication.doPost(`/${resource}`, data),
        updateItem: (itemId, data) => communication.doPut(`/${resource}/${itemId}`, data),
        deleteItem: (itemId, data) => communication.doDelete(`/${resource}/${itemId}`),
    };
};