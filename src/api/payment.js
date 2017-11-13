import * as communication from '../core/communication'

export const createUserAccount = networkId =>
    communication.doPost(`/user/payment/account/${networkId}`);

export const getUserAccount = networkId =>
    communication.doGet(`/user/payment/account/${networkId}`);

export const createAccount = () =>
    communication.doPost('/payment/account', {});

export const getAccount = () =>
    communication.doGet('/payment/account', {});
