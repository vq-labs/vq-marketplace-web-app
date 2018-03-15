import * as coreMedia from '../core/media';

// VQ_API_URL is defined in production mode
const API_URL = window.VQ_API_URL;

export const upload = coreMedia.uploadImageFactory(API_URL + '/upload/image');

export const uploadFile = coreMedia.uploadImageFactory(API_URL + '/upload/file');
