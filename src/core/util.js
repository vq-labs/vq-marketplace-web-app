export const serializeQueryObj = (obj, prefix) => {
  let str = [], p;

  for (p in obj) {
    if (obj.hasOwnProperty(p)) {
      var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
      if (typeof v !== 'undefined') {
         str.push((v !== null && typeof v === "object") ?
            serializeQueryObj(v, k) :
            encodeURIComponent(k) + "=" + encodeURIComponent(v));
      }
    }
  }

  return str.join("&");
};

export const updateQueryStringParameter = (keyOrQuery, value, url) => {
  if (typeof keyOrQuery === 'object') {
    Object.keys(keyOrQuery).forEach(key => updateQueryStringParameter(key, keyOrQuery[key]));
  }

  const key = keyOrQuery;

  if (!url) url = window.location.href;
    var re = new RegExp("([?&])" + key + "=.*?(&|#|$)(.*)", "gi"),
        hash;

    if (re.test(url)) {
        if (typeof value !== 'undefined' && value !== null)
            return url.replace(re, '$1' + key + "=" + value + '$2$3');
        else {
            hash = url.split('#');
            url = hash[0].replace(re, '$1$3').replace(/(&|\?)$/, '');
            if (typeof hash[1] !== 'undefined' && hash[1] !== null) 
                url += '#' + hash[1];
            return url;
        }
    }
    else {
        if (typeof value !== 'undefined' && value !== null) {
            var separator = url.indexOf('?') !== -1 ? '&' : '?';
            hash = url.split('#');
            url = hash[0] + separator + key + '=' + value;
            if (typeof hash[1] !== 'undefined' && hash[1] !== null) 
                url += '#' + hash[1];
            return url;
        }
        else
            return url;
    }
}

export const formatGeoResults = locations => {
		const results = locations.map(item => {
			const address = {};
            
			for (var i = 0; i < item.address_components.length; i++) {
				address.seq_id = i;
                
				var addr = item.address_components[i];

				if (addr.types[0] === 'country')
					address.countryCode = addr.short_name;
				else if (addr.types[0] === "sublocality")
					address.sublocality = addr.long_name;
				else if (addr.types[0] === 'route')
					address.route = addr.long_name;
				else if (addr.types[0] === 'street_number')
					address.streetNumber = addr.long_name;
				else if (addr.types[0] === 'administrative_area_level_1')
					address.region = addr.long_name;
				else if (addr.types[0] === 'locality')
					address.city = addr.long_name;
				else if (addr.types[0] === 'location')
					address.location = addr.location;
				else if (addr.types[0] === 'postal_code')
					address.postalCode = addr.long_name;
			}

			address.formattedAddress = "";
			
            if (address.route) {
				address.formattedAddress = address.route;
				address.formattedAddress += ", ";
			}

			if (address.postalCode) {
				address.formattedAddress = address.postalCode;
				address.formattedAddress += " ";
			}

			address.formattedAddress += address.city;
			address.lat = item.geometry.location.lat();
			address.lng = item.geometry.location.lng();

			return address;
		}).filter(item => {
			return item;
		});

		return results;
};
