import * as communication from '../core/communication'

export const getItems = query => communication.doGet('/app/dashboard', query);
