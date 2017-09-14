import apiOrder from './order';
import * as communication from '../core/communication'

export const settleOrder = orderId => {
    return apiOrder
        .updateItem(orderId);
};

export const closeOrder = orderId => {
    return communication.doPut(
        `/order/${orderId}/actions/close`
    );
};

export const revokeAutoSettlement = orderId => {
    return communication.doPut(
        `/order/${orderId}/actions/cancel-autosettlement`
    );
};
