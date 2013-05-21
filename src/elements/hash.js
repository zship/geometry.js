define(function(require) {

	var $ = require('jquery');
	var fromAny = require('./fromAny');


	/**
	 * Return a unique ID for a DOM Element, regardless of the presence of an
	 * id attribute.
	 *
	 * @param {Element|jQuery|String} el
	 * @return {Number}
	 */
	var hash = function(el) {

		el = fromAny(el);

		var ex = $.expando;
		if (el[ex]) {
			return el[ex];
		}

		//no expando property? set one by setting arbitrary data
		$(el).data('joss-hash-gen', '');
		return el[ex];
	
	};


	return hash;

});
