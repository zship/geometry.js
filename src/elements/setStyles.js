define(function(require) {

	var forOwn = require('mout/object/forOwn');


	var cssPxLength = {
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	};


	/**
	 * Performant way to set multiple CSS styles all at once.
	 *
	 * @param {Element} el
	 * @param {Object} styles : Map of style names to style values
	 */
	var setStyles = function(el, styles) {

		forOwn(styles, function(val, name) {
			var type = typeof val;

			if ( val === null || type === "number" && isNaN(val) ) {
				return;
			}

			if (type === 'number' && !cssPxLength[name]) {
				val += "px";
			}

			el.style[name] = val;
		});

	};


	return setStyles;

});
