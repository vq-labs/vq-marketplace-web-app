import * as RestResourceFactory from '../core/rest-resource-factory';

export const appLabel = RestResourceFactory.create('app_label', {
    getItems: (data, returnRaw) => data
});

export const appUserProperty = RestResourceFactory.create('app_user_property', {
    getItems: (data, returnRaw) => data
});

export const categories = RestResourceFactory.create('app_task_categories');

export const appConfig = RestResourceFactory.create('app_config', {
    getItems: data => {
        const dataObj = {};

        data
        .forEach(item => {
            dataObj[item.fieldKey] = item.fieldValue;
        });

        return dataObj;
    }
});