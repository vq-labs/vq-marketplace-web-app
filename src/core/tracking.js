import ReactGA from 'react-ga';
import CONFIG from '../generated/ConfigProvider.js'
import { getConfigAsync } from '../core/config';

let ready = false;

getConfigAsync(config => {
    ready = true;
    ReactGA.initialize(CONFIG.GOOGLE_ANALYTICS_ID);
});


export const pageView = () => {
    if (!ready) {
        return;
    }

    return ReactGA.pageview(window.location.pathname);
};
