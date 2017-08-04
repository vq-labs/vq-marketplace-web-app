import STYLE from '../generated/Style.js'

const CONFIG = null;

const listeners = [];

export const get = fieldKey => STYLE[fieldKey.toUpperCase()];