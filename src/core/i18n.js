const TRANSLATIONS = {};
const defaultLang = 'en';
let LANG = localStorage.getItem('ST_LANG');

if (!LANG) {
    LANG = defaultLang;
    localStorage.setItem('ST_LANG', LANG);
}

export const addLang = (langKey, translations) => TRANSLATIONS[langKey] = translations;

export const translate = fieldKey => {
    if (typeof TRANSLATIONS[LANG][fieldKey.toUpperCase()] === 'undefined') {
        return fieldKey;
    }

    return TRANSLATIONS[LANG][fieldKey.toUpperCase()] || '';
}