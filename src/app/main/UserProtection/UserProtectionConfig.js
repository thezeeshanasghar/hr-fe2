import UserProtection from './UserProtection';

export const UserProtectionConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/userprotection',
            component: UserProtection
        }
    ]
};
