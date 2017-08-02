import * as communication from '../core/communication'

export const getItems = () =>
    communication.doGet('/request');

export const getItem = requestId =>
    communication.doGet(`/request/${requestId}`);

export const createItem = data =>
    communication.doPost('/request', data);

export const updateItem = (requestId, data) =>
    communication.doPut(`/request/${requestId}`, data);

export const createItemMessage = (requestId, data) =>
    communication.doPost(`/request/${requestId}/message`, data);
