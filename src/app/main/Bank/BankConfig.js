import Bank from './Bank';

export const BankConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/Bank',
            component: Bank
        }
    ]
};