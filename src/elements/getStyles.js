define(function(require) {

	var $ = require('jquery');


	/**
	 * Performant way to get multiple CSS styles all at once.
	 *
	 * @param {Element} el
	 * @param {Array} styles : Style names
	 * @return {Object} : Map of style name -> CSS 'used' value
	 */
	var getStyles = function(el, styles) {

		if (!el) {
			return null;
		}

		for (var i = 0; i < styles.length; i++ ) {
			if (styles[i] === 'float') {
				styles[i] = $.support.cssFloat ? 'cssFloat' : 'styleFloat';
			}
		}

		if (window.getComputedStyle) {
			return _getStylesUsingComputedStyle(el, styles);
		}

		return _getStylesUsingCurrentStyle(el, styles);

	};


	// Used for matching numbers
	var rNumber = /[\-+]?(?:\d*\.|)\d+(?:[eE][\-+]?\d+|)/.source;
	// Number not ending in 'px'
	var rNonPixelLengthValue = new RegExp( "^(" + rNumber + ")(?!px)[a-z%]+$", "i" );


	// modern browsers
	var _getStylesUsingComputedStyle = function(el, styles) {

		var results = {};
		var computed = window.getComputedStyle(el, null);

		for (var i = 0; i < styles.length; i++) {
			var name = styles[i];
			var val = computed[name];

			// We should always get a number back from opacity
			if (name === 'opacity' && val === '') {
				val = '1';
			}

			// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
			// getComputedStyle returns percent when specified for top/left/bottom/right
			// rather than make the css module depend on the offset module, we just check for it here
			if ( /^(top|left)$/.test(name) && rNonPixelLengthValue.test( val ) ) {
				val = $(el).position()[name];
			}

			// A tribute to the 'awesome hack by Dean Edwards'
			// Chrome < 17 and Safari 5.0 uses 'computed value' instead of 'used value' for margin-right
			// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
			// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
			if ( /^margin/.test(name) && rNonPixelLengthValue.test( val ) ) {
				var width = el.style.width;
				var minWidth = el.style.minWidth;
				var maxWidth = el.style.maxWidth;

				el.style.minWidth = el.style.maxWidth = el.style.width = val;
				val = computed.width;

				el.style.width = width;
				el.style.minWidth = minWidth;
				el.style.maxWidth = maxWidth;
			}

			results[name] = val;
		}

		return results;

	};


	// IE < 9
	var _getStylesUsingCurrentStyle = function(el, styles) {

		var results = {};
		var styleObject = el.currentStyle;

		for (var i = 0; i < styles.length; i++) {
			var name = styles[i];
			var val = styleObject[name];

			if (val === null && el.style && el.style[name] ) {
				val = el.style[name];
			}

			// From the awesome hack by Dean Edwards
			// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

			// If we're not dealing with a regular pixel number
			// but a number that has a weird ending, we need to convert it to pixels
			// but not position css attributes, as those are proportional to the parent element instead
			// and we can't measure the parent instead because it might trigger a 'stacking dolls' problem
			if ( rNonPixelLengthValue.test(val) && !/^(top|right|bottom|left)$/.test(name) ) {

				// Remember the original values
				var left = el.style.left;
				var rsLeft = el.runtimeStyle && el.runtimeStyle.left;

				// Put in the new values to get a computed value out
				if ( rsLeft ) {
					el.runtimeStyle.left = el.currentStyle.left;
				}
				el.style.left = (name === 'fontSize') ? '1em' : val;
				val = el.style.pixelLeft + 'px';

				// Revert the changed values
				el.style.left = left;
				if ( rsLeft ) {
					el.runtimeStyle.left = rsLeft;
				}
			}

			results[name] = (val === '') ? 'auto' : val;
		}

		return results;

	};


	return getStyles;

});
