const CENT_CURRENCIES = [ 'PLN', 'EUR', 'USD' ];
const NOCENT_CURRENCIES = [ 'HUF' ];

const CURRENCY_LABELS = {
    PLN: 'PLN',
    EUR: 'EUR',
    USD: 'USD',
    HUF: 'Ft',
};


export const displayPrice = (amount, currencyCode, pricingModel) => {
    if (CENT_CURRENCIES.indexOf(currencyCode) !== -1) {
        return `${(amount / 100).toFixed(2)} ${currencyCode}`;
    }

    if (NOCENT_CURRENCIES.indexOf(currencyCode) !== -1) {
        return `${amount} ${CURRENCY_LABELS[currencyCode]}`;
    }
};
