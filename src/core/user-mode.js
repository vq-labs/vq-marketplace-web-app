const userModes = {
    GENERAL: 0,
    DEMAND: 1,
    SUPPLY: 2
};

let activeMode;

const fns = [];

export const registerModeChange = fn => {
    fns.push(fn);
};

export const init = userType => {
    if (userType === 1 || userType === 2) {
        localStorage.setItem('VQ_USER_MODE', userType);

        activeMode = String(userType);

        return;
    }

    activeMode = localStorage.getItem('VQ_USER_MODE');

    if (!activeMode) {
        activeMode = "1";

        localStorage.setItem('VQ_USER_MODE', activeMode);
    }

    fns.forEach(fn => fn(activeMode));
};

export const switchMode = userMode => {
    activeMode = userMode;

    localStorage.setItem('VQ_USER_MODE', activeMode);
};

export const getMode = () => {
    if (!activeMode) {
        init()
    }

    return activeMode;
};
