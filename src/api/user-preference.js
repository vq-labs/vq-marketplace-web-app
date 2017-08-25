import * as communication from '../core/communication'

export const getItems = (userId, preferenceType) =>
    communication.doGet(`/user/${userId}/preference/${preferenceType}`);

export const createItem = (userId, data) =>
    communication.doPost(`/user/${userId}/preference`, data);

export const deleteItem = (userId, preferenceId) =>
    communication.doDelete(`/user/${userId}/preference/${preferenceId}`);
