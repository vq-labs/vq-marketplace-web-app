import * as communication from '../core/communication'

export const users = {
    getItems: () => communication.doGet('/admin/user'),
};

export const report = {
    overview: () => communication.doGet('/admin/report')
};
