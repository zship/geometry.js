define(function(require) {

	var clone = require('mout/lang/deepClone');


	/**
	 * Blank dimensions object, suitable for a deep-mixin/extend operation
	 * @type {Object}
	 */
	var defaultDimensions = function() {
		return clone({
			positioning: 'static',
			precedence: {
				x: 'left',
				y: 'top'
			},
			offset: {
				top: 0,
				left: 0
			},
			position: {
				top: 0,
				right: 0,
				bottom: 0,
				left: 0
			},
			width: 0,
			height: 0,
			border: {
				top: 0,
				right: 0,
				bottom: 0,
				left: 0
			},
			margin: {
				top: 0,
				right: 0,
				bottom: 0,
				left: 0
			},
			padding: {
				top: 0,
				right: 0,
				bottom: 0,
				left: 0
			}
		});
	};


	return defaultDimensions;

});
