import * as communication from '../core/communication'

export const createUserAccount = networkId =>
    communication.doPost(`/user/payment/account/${networkId}`);

export const getUserAccount = networkId =>
    communication.doGet(`/user/payment/account/${networkId}`);

export const createAccount = networkId =>
    communication.doPost(`/payment/account/${networkId}`, {});

export const getAccount = networkId =>
    communication.doGet(`/payment/account/${networkId}`, {});
