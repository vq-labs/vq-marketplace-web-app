
import { stripHtml } from './util';

const CENT_CURRENCIES = [ 'PLN', 'EUR', 'USD' ];
const NOCENT_CURRENCIES = [ 'HUF' ];

const CURRENCY_LABELS = {
    PLN: 'PLN',
    EUR: 'EUR',
    USD: 'USD',
    HUF: 'Ft',
};

const TASK_STATUS = {
    ACTIVE: '0',
    INACTIVE: '103',
    CREATION_IN_PROGRESS: '10',
    BOOKED: '20',
    SPAM: '99'
};

const INVERSE_TASK_STATUS = {};
Object
    .keys(TASK_STATUS)
    .forEach(statusName => {
        INVERSE_TASK_STATUS[TASK_STATUS[statusName]] = statusName;
    });
 

export const displayTaskStatus = taskStatus => {
    return INVERSE_TASK_STATUS[taskStatus] ?
        INVERSE_TASK_STATUS[taskStatus] :
        'Unknown status';
};

export const displayListingDesc = desc => {
    if (desc) {
        return stripHtml(desc)
            .substring(0, 75) + '..';
    }

    return 'No description';
};

export const displayLocation = location => {
    if (location) {
        return `${location.street}, ${location.postalCode} ${location.city}`
    }

    return '';
};

export const displayPrice = (amount, currencyCode, pricingModel) => {
    if (pricingModel === 1) {
        if (CENT_CURRENCIES.indexOf(currencyCode) !== -1) {
            return `${(amount / 100).toFixed(2)} ${currencyCode}/h`;
        }
    
        if (NOCENT_CURRENCIES.indexOf(currencyCode) !== -1) {
            return `${amount} ${CURRENCY_LABELS[currencyCode]}/h`;
        }
    }

    if (CENT_CURRENCIES.indexOf(currencyCode) !== -1) {
        return `${(amount / 100).toFixed(2)} ${currencyCode}`;
    }

    if (NOCENT_CURRENCIES.indexOf(currencyCode) !== -1) {
        return `${amount} ${CURRENCY_LABELS[currencyCode]}`;
    }
};
