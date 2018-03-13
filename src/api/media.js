import * as coreMedia from '../core/media';
import CONFIG from '../generated/ConfigProvider.js';

export const upload = coreMedia.uploadImageFactory(CONFIG.VQ_API_URL + '/upload/image');

export const uploadFile = coreMedia.uploadImageFactory(CONFIG.VQ_API_URL + '/upload/file');
