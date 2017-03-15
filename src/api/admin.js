import * as communication from '../core/communication'

export const users = {
    getItems: () => communication.doGet('/admin/user'),
};

export const overview = {
    getItems: () => communication.doGet('/admin/overview'),
}
