import { browserHistory } from 'react-router';

let BASE = '';

 export const setBase = base => BASE = `/${base}`;

 export const goTo = url => browserHistory.push(`${BASE}${url}`);

 export const goBack = () => browserHistory.goBack();
