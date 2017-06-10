import * as communication from '../core/communication'

export const getItems = (userId, propertyType) =>
    communication.doGet(`/user/${userId}/${propertyType}`);
