import { goTo } from './navigation';
import { translate } from './i18n';

export const factory = () => err => {
    alert(err.code);

    return goTo('/');
};


export const displayErrorFactory = () => err => {
    alert(translate(err.code));
};