import PaymentDetail from './PaymentDetail';
export const PaymentDetailConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/PaymentDetail/:Id',
            component: PaymentDetail
        }
    ]
};