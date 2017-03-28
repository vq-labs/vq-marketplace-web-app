const TRANSLATIONS = {};

export const addLang = (langKey, translations) => TRANSLATIONS[langKey] = translations;

export const translate = fieldKey => TRANSLATIONS['en'][fieldKey.toUpperCase()] || fieldKey;