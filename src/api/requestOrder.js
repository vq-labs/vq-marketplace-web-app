import * as communication from '../core/communication'

export const getCorrespondingRequestForOrder = orderId =>
    communication.doGet(`/order/${orderId}/request`);

export const getCorrespondingOrderForRequest = requestId =>
    communication.doGet(`/request/${requestId}/order`);
