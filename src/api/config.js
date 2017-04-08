import * as RestResourceFactory from '../core/rest-resource-factory';

export const appLabel = RestResourceFactory.create('app_label', {
    getItems: data => {
        const dataObj = {};

        data.map(item => {
            debugger;
            dataObj[item.labelKey] = item.labelValue;
        })

        return dataObj;
    }
});

export const categories = RestResourceFactory.create('app_task_categories');

export const appConfig = RestResourceFactory.create('app_config', {
    getItems: data => {
        const dataObj = {};

        data.map(item => {
            dataObj[item.fieldKey] = item.fieldValue;
        })

        return dataObj;
    }
});