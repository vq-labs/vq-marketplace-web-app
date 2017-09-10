import * as communication from '../core/communication'

export const createItem = (taskId, data) =>
    communication.doPost(`/task/${taskId}/location`, data);


export const getLast = () =>
    communication.doGet(`/task/location/last`);
