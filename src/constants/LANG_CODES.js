import LANGUAGES from './LANGUAGES.js';

const LANG_CODES = {};

LANGUAGES.forEach(_ => {
    LANG_CODES[_.value] = _.label;
});

export default LANG_CODES;
