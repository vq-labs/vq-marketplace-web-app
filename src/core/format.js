const CENT_CURRENCIES = [ 'PLN', 'EUR', 'USD' ];
const NOCENT_CURRENCIES = [ 'HUF' ];

export const displayPrice = (amount, currencyCode) => {
    if (CENT_CURRENCIES.indexOf(currencyCode) !== -1) {
        return `${(amount / 100).toFixed(2)} ${currencyCode}`;
    }

    if (NOCENT_CURRENCIES.indexOf(currencyCode) !== -1) {
        return `${amount} ${currencyCode}`;
    }
};
