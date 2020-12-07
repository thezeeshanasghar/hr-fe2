import EmployeeVarianceReport from './EmployeeVarianceReport';

export const EmployeeVarianceReportConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/EmployeeVarianceReport',
            component: EmployeeVarianceReport
        }
    ]
};