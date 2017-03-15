import * as communication from '../core/communication'

export const getItems = () => communication.doGet('/skills');

export const createItem = skill => communication.doPost('/user/skills', skill);

export const updateItem = skill => communication.doPut('/user/skills', skill);

export const deleteItem = (userId, skillId) => communication.doDelete(`/user/${userId}/skills/${skillId}`);
