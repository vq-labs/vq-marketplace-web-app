import * as communication from '../core/communication'

export const getItems = queryObj =>
    communication.doGet('/request', queryObj);

export const getItem = requestId =>
    communication.doGet(`/request/${requestId}`, undefined, { noCache: true });

export const createItem = data =>
    communication.doPost('/request', data);

export const updateItem = (requestId, data) =>
    communication.doPut(`/request/${requestId}`, data);

export const createItemMessage = (requestId, data) =>
    communication.doPost(`/request/${requestId}/message`, data);
