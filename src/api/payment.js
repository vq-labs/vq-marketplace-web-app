import * as communication from '../core/communication'

export const createAccount = data =>
    communication.doPost('/payment/account', data);
