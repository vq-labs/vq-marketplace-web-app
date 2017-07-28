import * as communication from '../core/communication'

export const createItem = (taskId, data) => communication.doPost(`/task/${taskId}/comment`, data);

export const getItems = (taskId, query) => communication.doGet(`/task/${taskId}/comment`, query);
