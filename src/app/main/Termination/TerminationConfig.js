import Termination from './Termination';

export const TerminationConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/termination',
            component: Termination
        }
    ]
};
