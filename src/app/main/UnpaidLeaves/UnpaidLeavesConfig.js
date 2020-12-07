import UnpaidLeaves from './UnpaidLeaves';

export const UnpaidLeavesConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/unpaidleaves',
            component: UnpaidLeaves
        }
    ]
};
