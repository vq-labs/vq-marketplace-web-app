import { goTo } from './navigation';
import { translate } from './i18n';

export const factory = () => err => {
    alert(err.code);

    return goTo('/');
};

export const displayErrorFactory = params => err => {
    params = params || {};
    params.ignoreCodes = params.ignoreCodes || [];
    
    if (params.self) {
        params.self.setState({
            isLoading: false
        });
    }

    if (params.ignoreCodes.indexOf(err.code) > -1) {
        return;
    }

    alert(translate(err.code));
};
