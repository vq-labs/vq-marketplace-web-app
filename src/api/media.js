import * as coreMedia from '../core/media';
import CONFIG from '../generated/ConfigProvider.js';

const API_URL = CONFIG.API_URL;

export const upload = coreMedia.uploadImageFactory(API_URL + '/upload/image');

export const uploadFile = coreMedia.uploadImageFactory(API_URL + '/upload/file');
