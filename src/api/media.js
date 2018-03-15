import * as coreMedia from '../core/media';
import VQ_API_URL from '../generated/ConfigProvider.js';

// VQ_API_URL is defined in production mode
let API_URL = window.VQ_API_URL;

if (!API_URL) {
    API_URL = VQ_API_URL;
}

export const upload = coreMedia.uploadImageFactory(API_URL + '/upload/image');

export const uploadFile = coreMedia.uploadImageFactory(API_URL + '/upload/file');
