import { goTo } from '../core/navigation';

export const getMeOutFromHereIfAmNotAuthorized = user => {
    if (!user) {
        goTo('/login');

        return true;
    }

    // user is blocked
    if (user.status === '20') {
        alert("You are blocked");
        
        goTo('/login')

        return true;
    }

    // email has not been verified
    if (user.status !== '10') {
        goTo('/email-not-verified');

        return true;
    }

    if (Number(user.userType) === 1) {
        return false;
    }

    // studentId has not been submitted
    if (!user.userProperties.find(_ => _.propKey === 'studentIdUrl')) {
        goTo('/user-verifications');

        return true;
    }

    return false;
};

