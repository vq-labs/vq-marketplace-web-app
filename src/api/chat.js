import * as communication from '../core/communication'

export const getItems = () => communication.doGet('/messages/');

export const getItem = chatId => communication.doGet('/messages/application/' + chatId);

export const createItem = (chatId, data) => communication.doPost('/messages/application/' + chatId, data);

export const updateItem = skill => communication.doPut('/user/skills', skill);

export const deleteItem = (userId, skillId) => communication.doDelete(`/user/${userId}/skills/${skillId}`);
