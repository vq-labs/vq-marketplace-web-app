import { goTo } from './navigation';

export const factory = () => err => {
    alert(err.code);

    return goTo('/');
};