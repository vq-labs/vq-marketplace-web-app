import { goTo, convertToAppPath } from '../core/navigation';
import { CONFIG } from '../core/config';

export const getMeOutFromHereIfAmNotAuthorized = user => {
    if (!user) {
        goTo(`/login?redirectTo=${convertToAppPath(`${location.pathname}`)}`);
        
        return true;
    }
    console.log(user)

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

    if (
        (
            user.userType === 1 && CONFIG.USER_VERIFICATIONS_ENABLED_FOR_DEMAND === "1" && CONFIG.USER_VERIFICATIONS_REQUIRED_FOR_DEMAND === "1"
        ) ||
        (
            user.userType === 2 && CONFIG.USER_VERIFICATIONS_ENABLED_FOR_SUPPLY === "1" && CONFIG.USER_VERIFICATIONS_REQUIRED_FOR_SUPPLY === "1"
        ) ||
        (
            user.userType === 0 && (
                (
                    CONFIG.USER_VERIFICATIONS_ENABLED_FOR_DEMAND === "1" &&
                    CONFIG.USER_VERIFICATIONS_REQUIRED_FOR_DEMAND === "1"
                ) ||
                (

                    CONFIG.USER_VERIFICATIONS_ENABLED_FOR_SUPPLY === "1" &&
                    CONFIG.USER_VERIFICATIONS_REQUIRED_FOR_SUPPLY === "1"
                )
            )
        )
    ) {
        // users of type sellers are required to upload a document
        if (!user.userProperties.find(_ => _.propKey === 'studentIdUrl')) {
            goTo('/user-verifications');

            return true;
        }

        // user has not preferences
        if (!user.userPreferences.length) {
            goTo('/user-preferences');

            return true;
        }
    }

    return false;
};

