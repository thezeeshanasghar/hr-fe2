import BulkUpload from './BulkUpload';

export const BulkUploadConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/bulkupload',
            component: BulkUpload
        }
    ]
};