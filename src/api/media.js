import * as coreMedia from '../core/media';
import CONFIG from '../generated/ConfigProvider.js';

const API_URL = typeof window.VQ_API_URL === 'undefined' ? CONFIG.API_URL : window.VQ_API_URL;

export const upload = coreMedia.uploadImageFactory(API_URL + '/upload/image');

export const uploadFile = coreMedia.uploadImageFactory(API_URL + '/upload/file');
