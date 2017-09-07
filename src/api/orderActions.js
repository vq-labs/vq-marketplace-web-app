import apiOrder from './order';

export const settleOrder = orderId => {
    return apiOrder
        .updateItem(orderId);
};


