import * as communication from '../core/communication'

export const getItems = (userId, propertyType) =>
    communication.doGet(`/user/${userId}/property`);

export const createItem = (userId, propKey, propValue) =>
    communication.doPost(`/user/${userId}/property`, {
        propValue,
        propKey
    });
