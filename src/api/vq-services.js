import * as communication from '../core/communication'

export const validateAddress = data =>
    communication.doPost('/vq-services/address-validation', data);

