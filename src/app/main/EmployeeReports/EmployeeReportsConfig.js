import EmployeeReports from './EmployeeReports';

export const EmployeeReportsConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/EmployeeReports',
            component: EmployeeReports
        }
    ]
};