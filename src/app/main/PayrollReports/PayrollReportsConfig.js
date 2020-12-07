import PayrollReports from './PayrollReports';
export const PayrollReportsConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/PayrollReports',
            component: PayrollReports
        }
    ]
};