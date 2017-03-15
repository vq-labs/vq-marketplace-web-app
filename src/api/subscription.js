import * as communication from '../core/communication';

export const createItem = skill => communication.doPost('/payment/sub', skill);
