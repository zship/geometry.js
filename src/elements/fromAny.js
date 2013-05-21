define(function(require) {

	var $ = require('jquery');
	var isString = require('mout/lang/isString');


	var isElement = function(obj) {
		return obj && typeof obj === "object" && obj.nodeType === 1 && typeof obj.nodeName==="string";
	};


	/**
	 * Coerce a *single* DOM Element out of a string or jQuery element
	 * @param {Element|String|jQuery} el
	 * @return {Element}
	 */
	var fromAny = function(el) {
		if (isElement(el)) {
			return el;
		}
		else if (el instanceof $) {
			return el[0];
		}
		else if (isString(el)) {
			return $(el)[0];
		}
	};


	return fromAny;

});
