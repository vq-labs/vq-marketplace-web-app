const CENT_CURRENCIES = [
    'PLN',
    'EUR',
    'USD'
];

const CURRENCY_LABELS = {
    PLN: 'zł',
    EUR: '€',
    USD: '$',
    HUF: 'Ft'
};

const TASK_STATUS = {
    ACTIVE: '0',
    INACTIVE: '103',
    CREATION_IN_PROGRESS: '10',
    BOOKED: '20',
    SPAM: '99'
};

const INVERSE_TASK_STATUS = {};
Object
    .keys(TASK_STATUS)
    .forEach(statusName => {
        INVERSE_TASK_STATUS[TASK_STATUS[statusName]] = statusName;
    });
 
export const displayTaskStatus = taskStatus => {
    return INVERSE_TASK_STATUS[taskStatus] ?
        INVERSE_TASK_STATUS[taskStatus] :
        'Unknown status';
};

export const displayTotalPrice = (price, timings, currencyCode) => {
    try {
        const amount = price * timings[0].duration;
        
        return `${amount} ${CURRENCY_LABELS[currencyCode]}`;
    } catch (err) {
        return '?';
    }
};

export const displayListingDesc = desc => {
    if (desc) {
        return stripHTML(desc)
            .substring(0, 80) + '..';
    }

    return 'No description';
};

export const displayLocation = (location, showDetails) => {
    if (location) {
        let neededFields = [
            'street',
            'streetNumber',
            ',',
            'postalCode',
            'city'
        ];

        if (!showDetails) {
            neededFields = [
                'street',
                ',',
                'postalCode',
                'city'
            ];
        }

        let renderedLocation = "";

        neededFields.forEach((field, index) => {
            if (field === ',') {
                renderedLocation = renderedLocation.substr(0, renderedLocation.length - 1);
                renderedLocation += field + ' '
            } else if (location[field] !== undefined && location[field] !== null) {
                renderedLocation += location[field] + ' '
            }
        });

        return renderedLocation;
    }

    return '';
};

export const displayPrice = (amount, currencyCode, pricingModel) => {
    if (amount === undefined || amount === null) {
      amount = '';
    }

    // per hour
    if (pricingModel === 1) {
        return `${amount} ${CURRENCY_LABELS[currencyCode] || currencyCode}/h`;
    }

    // per unit
    if (pricingModel === 3) {
        return `${amount} ${CURRENCY_LABELS[currencyCode] || currencyCode}`;
    }

    return `${amount} ${CURRENCY_LABELS[currencyCode] || currencyCode}`;
};


export const trimSpaces = string => {
  return string.replace(/\s+/g,' ').replace(/&nbsp;/gi,'').trim();
};


export const stripHTML = (html, noOfChars) => {
   const tmp = document.createElement("DIV");

   tmp.innerHTML = html;

   const text = (tmp.textContent || tmp.innerText || "")
    .replace(/\s+$/, '');

   if (noOfChars && text.length > noOfChars) {
       return `${text.substring(0, noOfChars)}...`;
   }

   return text;
};

export const displayUnit = (amount, unit) => {
    if (amount === undefined || amount === null) {
      amount = '';
    }

    return `${amount} ${unit}`;
};

export const luminateColor = (hex, lum) => {

	// validate hex string
	hex = String(hex).replace(/[^0-9a-f]/gi, '');
	if (hex.length < 6) {
		hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
	}
	lum = lum || 0;

	// convert to decimal and change luminosity
	let rgb = "#", c, i;
	for (i = 0; i < 3; i++) {
		c = parseInt(hex.substr(i*2,2), 16);
		c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
		rgb += ("00"+c).substr(c.length);
	}

	return rgb;
}

export const getRGBColors = (color) => {
    let r, g, b;

    if (color.match(/^rgb/)) {
        color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
        r = color[1];
        g = color[2];
        b = color[3];
      } else {
        color = +("0x" + color.slice(1).replace( // thanks to jed : http://gist.github.com/983661
            color.length < 5 && /./g, '$&$&'
          )
        );
        r = color >> 16;
        g = color >> 8 & 255;
        b = color & 255;
      }
      return [r, g, b];
}

export const lightOrDark = (color) => {
        let hsp;
        let a = color;

        const [r, g, b] = getRGBColors(color);
        
        
        hsp = Math.sqrt( // HSP equation from http://alienryderflex.com/hsp.html
          0.299 * (r * r) +
          0.587 * (g * g) +
          0.114 * (b * b)
        );
        if (hsp>127.5) {
          return 'light'
        } else {
          return 'dark'
        }
}

/* export const getReadableTextColor = (color1, color2) => {
    if (lightOrDark(color1) === 'dark' && lightOrDark(color2) === 'light') {
        return color2;
    } else if (lightOrDark(color1) === 'light' && lightOrDark(color2) === 'dark') {
        return color1;
    } else if (lightOrDark(color1) === 'dark' && lightOrDark(color2) === 'dark') {
        return '#FFF';
    } else if (lightOrDark(color1) === 'light' && lightOrDark(color2) === 'light') {
        return '#000';
    }
} */

export const getReadableTextColor = (color) => {
        const [r, g, b] = getRGBColors(color);
      
        // http://www.w3.org/TR/AERT#color-contrast
        var o = Math.round(((parseInt(r) * 299) +
                            (parseInt(g) * 587) +
                            (parseInt(b) * 114)) / 1000);
        var fore = (o > 125) ? 'black' : 'white';
        return fore;
        
}

export const sluggify = (text) => {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}