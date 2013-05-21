define(function(require) {

	var $ = require('jquery');


	/**
	 * @namespace
	 */
	var Elements = {
		defaultDimensions: require('./elements/defaultDimensions'),
		fromAny: require('./elements/fromAny'),
		fromPoint: require('./elements/fromPoint'),
		getDimensions: require('./elements/getDimensions'),
		getStyles: require('./elements/getStyles'),
		hash: require('./elements/hash'),
		setStyles: require('./elements/setStyles'),
		toJquery: require('./elements/toJquery')
	};


	/**
	 * Shortcut for {joss/util/Elements.hash}
	 * @return {Number}
	 */
	$.fn.hash = function() {
		return Elements.hash(this);
	};


	/**
	 * Shortcut for {joss/util/Elements.getDimensions}
	 * @return {Object}
	 */
	$.fn.dimensions = function() {
		return Elements.getDimensions(this[0]);
	};


	return Elements;

});
