import Grades from './Grades';

export const GradesConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/grades',
            component: Grades
        }
    ]
};
