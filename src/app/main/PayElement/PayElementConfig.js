import PayElement from './PayElement';

export const PayElementConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/payelement',
            component: PayElement
        }
    ]
};
