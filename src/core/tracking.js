import ReactGA from 'react-ga';
import CONFIG from '../generated/ConfigProvider.js'

ReactGA.initialize(CONFIG.GOOGLE_ANALYTICS_ID);

export const pageView = () => {
    return ReactGA.pageview(window.location.pathname);
};
