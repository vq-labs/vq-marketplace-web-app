import * as async from 'async';
import * as _ from 'underscore';

import apiTask from '../api/task';
import * as apiTaskImage from '../api/task-image';
import * as apiTaskLocation from '../api/task-location';
import * as apiTaskCategory from '../api/task-category';
import * as apiTaskTiming from '../api/task-timing';
import { CONFIG } from '../core/config';

export const createListing = (task, cb) => async
    .waterfall([
        // will create empty task
        cb => {
            apiTask
            .createItem({})
            .then(rTask => {
                task.id = rTask.id;

                return cb();
            }, cb);
        },
        // will connect it to the chosen categories
        cb => {
            apiTaskCategory
            .createItem(task.id, task.categories)
            .then(() => cb(), cb);
        },
        // will update the title, description, price etc.
        cb =>
            apiTask
            .updateItem(task.id, task)
            .then(() => cb(), cb),
        // will connect it to the chosen location
        cb => {
            if (CONFIG.LISTING_GEOLOCATION_MODE !== "1") {
                return cb();
            }

            apiTaskLocation
            .createItem(task.id, task.location)
            .then(() => {
                cb();
            }, cb);
        },
        // will add images
        cb => {
            if (CONFIG.LISTING_IMAGES_MODE !== "1") {
                return cb();
            }

            apiTaskImage
            .createItem(task.id, task.images)
            .then(() => {
                cb();
            }, cb);
        },
        // will add date and duration
        cb => {
            if (CONFIG.LISTING_TIMING_MODE !== "1") {
                return cb();
            }

            const localStart = task.timing[0].date;
            const localEnd = task.timing[0].endDate;
            const selectedDate = {
                date: Date.UTC(localStart.getFullYear(), localStart.getMonth(), localStart.getDate(), 0, 0, 0, 0) / 1000,
                endDate: Date.UTC(localEnd.getFullYear(), localEnd.getMonth(), localEnd.getDate(), 23, 59, 59, 0) / 1000
            };

            const data = {};

            data.dates = [ selectedDate ];

            if (CONFIG.LISTING_DURATION_MODE === "1") {
                data.duration = task.duration;
            }

            apiTaskTiming
            .createItem(task.id, data)
            .then(() => {
                cb();
            }, cb);
        },
        // make the task public
        cb => apiTask.updateItem(task.id, {
            status: 0
        }).then(() => cb(), cb)
    ], cb);
                             