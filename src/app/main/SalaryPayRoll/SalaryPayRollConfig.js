import SalaryPayRoll from './SalaryPayRoll';

export const SalaryPayRollConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/salarypayroll',
            component: SalaryPayRoll
        }
    ]
};