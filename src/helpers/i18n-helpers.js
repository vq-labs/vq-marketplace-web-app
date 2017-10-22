
import { appLabel } from '../api/config';
import { addLang, setLang } from '../core/i18n.js';

export const fetchAndAddLang = (lang, shouldForce, cb) => {
    appLabel
    .getItems({
      lang
    }, {
      cache: true,
      force: shouldForce
    })
    .then(labels => {
      const labelTranslations = {};
    
      labels.forEach(item => {
        labelTranslations[item.labelKey] = item.labelValue;
      });
    
      addLang(lang, labelTranslations);

      setLang(lang);

      if (cb) {
        cb();
      }
    });
};
