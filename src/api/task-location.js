import * as communication from '../core/communication'

export const createItem = (taskId, data) =>
    communication.doPost(`/task/${taskId}/location`, data);

export const updateDefaultItem = data =>
    communication.doPost(`/task-location`, data);
    
export const getLast = () =>
    communication.doGet(`/task/location/last`);

export const getItems = query =>
    communication.doGet(`/task-location`, query);
