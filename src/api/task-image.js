import * as communication from '../core/communication'

export const createItem = (taskId, data) => communication.doPost(`/task/${taskId}/image`, data);