define(function(require) {

	var $ = require('jquery');


	/**
	 * Create a jQuery element from **el**. Avoids calling jQuery if **el** is
	 * already a jQuery object.
	 * @param {Element|jQuery|String|Array<Element>} el
	 * @return {jQuery}
	 */
	var toJquery = function(el) {
		if (el instanceof $) {
			return el;
		}
		return $(el);
	};


	return toJquery;

});
