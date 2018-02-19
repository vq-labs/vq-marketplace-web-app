export const LANGUAGES = [
    {
      "value": "cs",
      "label": "Czech"
    },
    {
      "value": "da",
      "label": "Danish"
    },
    {
      "value": "nl",
      "label": "Dutch"
    },
    {
      "value": "en",
      "label": "English"
    },
    {
      "value": "et",
      "label": "Estonian"
    },
    {
      "value": "fi",
      "label": "Finnish"
    },
    {
      "value": "fr",
      "label": "French"
    },
    {
      "value": "de",
      "label": "German"
    },
    {
      "value": "hu",
      "label": "Magyar"
    },
    {
      "value": "it",
      "label": "Italian"
    },
    {
      "value": "pl",
      "label": "Polish"
    },
    {
      "value": "pt",
      "label": "Portuguese"
    },
    {
      "value": "ru",
      "label": "Russian"
    },
    {
      "value": "es",
      "label": "Spanish"
    },
    {
      "value": "sv",
      "label": "Swedish"
    }
];

const _LANG_CODES = {};
LANGUAGES.forEach(_ => {
    _LANG_CODES[_.value] = _.label;
});

export const LANG_CODES = _LANG_CODES;