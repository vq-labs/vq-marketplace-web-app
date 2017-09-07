import * as communication from '../core/communication'

export const users = {
    getItems: () => communication.doGet('/admin/user'),
    getUserEmail: userId => communication.doGet(`/admin/user/${userId}/emails`),
    blockUser: userId => communication.doPut(`/admin/user/${userId}/block`, {}),
    unblockUser: userId => communication.doPut(`/admin/user/${userId}/unblock`, {}),
};

export const request = {
    getItems: () => communication.doGet('/admin/request'),
};

export const order = {
    getItems: () => communication.doGet('/admin/order'),
};

export const report = {
    overview: () => communication.doGet('/admin/report')
};
