import * as communication from '../core/communication'

export const getItems = () => communication.doGet('/app_task_categories');

export const deleteItem = itemId => communication.doDelete('/app_task_categories', itemId);
