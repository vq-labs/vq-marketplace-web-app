import * as communication from '../core/communication';

export const users = {
    getItems: queryObj => communication.doGet('/admin/user', queryObj),
    getUserProperties: userId => communication.doGet(`/user/${userId}/property`),
    getUserEmail: userId => communication.doGet(`/admin/user/${userId}/emails`),
    blockUser: userId => communication.doPut(`/admin/user/${userId}/block`, {}),
    unblockUser: userId => communication.doPut(`/admin/user/${userId}/unblock`, {}),
    removeVerifications: userId => communication.doDelete(`/admin/user/${userId}/verifications`, {}),
};

export const tenant = {
    getTenant: () => communication.doGet('/admin/tenant'),
    signOnToCustomerPortal: () => communication.doPost(`/admin/subscription-portal`),
    upgradeSubscription: taskId => communication.doPost(`/admin/tenant/subscription`)
};

export const task = {
    getItems: () => communication.doGet('/admin/task'),
    markAsSpam: taskId => communication.doPut(`/admin/task/${taskId}/spam`)
};

export const request = {
    getItems: () =>
        communication.doGet('/admin/request'),
    getRequestMessages: requestId =>
        communication.doGet(`/admin/request/${requestId}/messages`),
};

export const order = {
    getItems: () => communication.doGet('/admin/order'),
};

export const report = {
    overview: () => communication.doGet('/admin/report')
};
