import STYLE from '../generated/Style.js'

export const get = fieldKey => STYLE[fieldKey.toUpperCase()];