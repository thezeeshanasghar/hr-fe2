import CostCenter from './CostCenter';

export const CostCenterConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/costcenter',
            component: CostCenter
        }
    ]
};