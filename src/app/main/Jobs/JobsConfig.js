import Jobs from './Jobs';

export const JobsConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/job',
            component: Jobs
        }
    ]
};
