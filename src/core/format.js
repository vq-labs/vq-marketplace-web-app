import { stripHtml } from './util';

const CENT_CURRENCIES = [
    'PLN',
    'EUR',
    'USD'
];

const CURRENCY_LABELS = {
    PLN: 'zł',
    EUR: '€',
    USD: '$',
    HUF: 'Ft'
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

export const displayTotalPrice = (price, timings, currencyCode) => {
    try {
        const amount = price * timings[0].duration;
        
        return `${amount} ${CURRENCY_LABELS[currencyCode]}`;
    } catch (err) {
        return '?';
    }
};

export const displayListingDesc = desc => {
    if (desc) {
        return stripHtml(desc)
            .substring(0, 75) + '..';
    }

    return 'No description';
};

export const displayLocation = (location, showDetails) => {
    if (location) {
        return showDetails ?
        `${location.street} ${location.streetNumber}, ${location.postalCode} ${location.city}` :
        `${location.street}, ${location.postalCode} ${location.city}`
    }

    return '';
};

export const displayPrice = (amount, currencyCode, pricingModel) => {
    amount = amount || '';

    // per hour
    if (pricingModel === 1) {
        return `${amount} ${CURRENCY_LABELS[currencyCode] || currencyCode}/h`;
    }

    // per unit
    if (pricingModel === 3) {
        return `${amount} ${CURRENCY_LABELS[currencyCode] || currencyCode}`;
    }

    return `${amount} ${CURRENCY_LABELS[currencyCode] || currencyCode}`;
};

export const displayUnit = (amount, unit) => {
    amount = amount || '';
      return `${amount} ${unit}`;
};
