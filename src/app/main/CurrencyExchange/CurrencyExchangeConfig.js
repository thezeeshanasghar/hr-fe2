import CurrencyExchange from './CurrencyExchange';

export const CurrencyExchangeConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/currencyexchange',
            component: CurrencyExchange
        }
    ]
};