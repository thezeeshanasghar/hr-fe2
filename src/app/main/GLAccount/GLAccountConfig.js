import GLAccount from './GLAccount';

export const GLAccountConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/glaccount',
            component: GLAccount
        }
    ]
};
