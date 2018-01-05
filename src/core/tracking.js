import ReactGA from 'react-ga';
import { getConfigAsync } from '../core/config';

let ready = false;

getConfigAsync(config => {
    debugger;
    ready = true;
    ReactGA.initialize(config.GOOGLE_ANALYTICS_ID);
}, true);


export const pageView = () => {
    if (!ready) {
        return;
    }
    debugger;

    return ReactGA.pageview(window.location.pathname);
};
