import CONFIG from '../generated/ConfigProvider.js'

const TRANSLATIONS = {};

let LANG = localStorage.getItem('ST_LANG');

if (!LANG) {
    LANG = CONFIG.LANG;

    localStorage.setItem('ST_LANG', LANG);
}

export const setLang = langKey => {
    TRANSLATIONS[langKey] = TRANSLATIONS[langKey] || {};
    LANG = langKey;

    localStorage.setItem('ST_LANG', langKey);
};

export const getLang = () => LANG;

export const addLang = (langKey, translations) => TRANSLATIONS[langKey] = translations;

export const translate = fieldKey => {
    if (typeof fieldKey === 'undefined') {
        return '';
    }

    if (typeof TRANSLATIONS[LANG][fieldKey.toUpperCase()] === 'undefined') {
        return fieldKey;
    }

    return TRANSLATIONS[LANG][fieldKey.toUpperCase()] || '';
}