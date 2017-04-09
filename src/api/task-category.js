import * as communication from '../core/communication'
import * as RestResourceFactory from '../core/rest-resource-factory';

export const createItem = (taskId, data) => communication.doPost(`/task/${taskId}/category`, data);
