import * as communication from '../core/communication'

export const users = {
    getItems: () => communication.doGet('/admin/user'),
};

export const weekReport = {
    task: () => communication.doGet('/report/week/task'),
    request: () => communication.doGet('/report/week/request'),
    message: () => communication.doGet('/report/week/message'),
};

export const report = {
    task: () => communication.doGet('/report/task'),
    user: () => communication.doGet('/report/user')
};
