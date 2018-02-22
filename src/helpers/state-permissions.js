import { CONFIG } from '../core/navigation';
import { goTo, convertToAppPath } from '../core/navigation';

import _ from 'underscore';

export default class StatePermitter {

    static permitState(nextState, user) {
        const currentLocation = nextState.location.pathname;    
        
        const isAdminRoute = [
            currentLocation.indexOf('admin') !== -1,
            currentLocation.indexOf('post') !== -1
        ];

        const isTaskOrListingRoute = [
            currentLocation.indexOf('task') !== -1,
            currentLocation.indexOf('listings') !== -1,
            currentLocation === '/app',
            currentLocation === '/app/',
            /^app?/i.test(currentLocation),
            /^app\/?/i.test(currentLocation)
        ];

        const isLoggedInRoute = [
            currentLocation.indexOf('account') !== -1,
            currentLocation.indexOf('dashboard') !== -1,
            currentLocation.indexOf('change-password') !== -1,
            currentLocation.indexOf('my-listings') !== -1,
            currentLocation.indexOf('user-preferences') !== -1,
            currentLocation.indexOf('user-documents') !== -1,
            currentLocation.indexOf('user-verifications') !== -1,
            currentLocation.indexOf('new-listing') !== -1,
            currentLocation.indexOf('premium') !== -1,
            currentLocation.indexOf('chat') !== -1,
            currentLocation.indexOf('request') !== -1,
            currentLocation.indexOf('order') !== -1,
            currentLocation.indexOf('email-not-verified') !== -1,
            currentLocation.indexOf('task') !== -1,
            currentLocation.indexOf('profile') !== -1
        ];

        const isAuthRoute = [
            currentLocation.indexOf('signup') !== -1,
            currentLocation.indexOf('login') !== -1
        ];

        // inside the arrays the lower the index, the higher the priority of going to the route
        // because they run first in the loop
        // place your checks accordingly
        const userChecks = {
            general: [
                {
                    check: user.status === '20',
                    route: '/login'
                },
                {
                    check: user.status !== '10',
                    route: '/email-not-verified'
                },
                {
                    check: !user.userProperties.find(_ => _.propKey === 'studentIdUrl') &&
                            (
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
                            ),
                    route: '/user-verifications'
                },
                {
                    check: !user.userPreferences.length,
                    route: '/user-preferences'
                }
            ],
            admin: [
                {
                    check: (
                        !user ||
                        (
                            user &&
                            !user.isAdmin
                        )
                    ),
                    route: `/login?redirectTo=${convertToAppPath(nextState.location.pathname)}`
                }
            ],
            task: [
                {
                    check: (
                        !user ||
                        CONFIG.LISTING_ENABLE_PUBLIC_VIEW !== 1
                    ),
                    route: `/login?redirectTo=${convertToAppPath(nextState.location.pathname)}`
                }
            ],
            loggedIn: [
                {
                    check: user,
                    route: `/profile/${user.id}`
                }
            ]
        };

        switch(true) {
            case (_.any(isAdminRoute)): {

            }
            case (_.any(isTaskOrListingRoute)): {

            }
            case (_.any(isLoggedInRoute)): {

            }
            case (_.any(isAuthRoute)): {

            }
        }
    }
}