import * as communication from '../core/communication'

export const createUserAccount = networkId =>
    communication.doPost(`/user/payment/account/${networkId}`);

export const getUserAccount = networkId =>
    communication.doGet(`/user/payment/account/${networkId}`);

export const createAccount = networkId =>
    communication.doPost(`/payment/account/${networkId}`, {});

export const getAccount = networkId =>
    communication.doGet(`/payment/account/${networkId}`, {});

export const createItem = (provider, type, data) =>
    communication.doPost(`/payment-object/${provider}/${type}`, {
        obj: data.obj,
        objId: data.objId,
        orderId: data.orderId
    });

export const getItems = (provider, type) =>
    communication.doGet(`/payment-object/${provider}/${type}`);
