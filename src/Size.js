define(function(require) {

	var Class = require('class/Class');
	var defaults = require('mout/lang/defaults');


	//Defines the size of a two-dimensional object
	var Size = Class.extend(/** @lends Size.prototype */ {

		/**
		 * @param {Number} width
		 * @param {Number} height
		 * @constructs
		 */
		constructor: function(opts) {
			if (!arguments.length) {
				opts = {
					width: 0,
					height: 0
				};
			}

			this.width = defaults(opts.width, opts.w);
			this.height = defaults(opts.height, opts.h);
		},


		/** @type {Number} */
		width: null,


		/** @type {Number} */
		height: null,


		/**
		 * Scales the size to a rectangle with the given `other` size,
		 * according to `mode`.
		 * @param {joss/geometry/Size} other
		 * @param {joss/geometry/Size.ScaleMode} mode
		 * @return {joss/geometry/Size}
		 */
		scale: function(other, mode) {

			if (mode === Size.ScaleMode.Equal) {
				this.width = other.width;
				this.height = other.height;
				return this;
			}

			var useHeight = false;
			var aspectRatio = this.width / this.height;
			var scaledWidth = other.height * aspectRatio;

			if (mode === Size.ScaleMode.Contain) {
				useHeight = (scaledWidth <= other.width);
			}
			else { // mode == Size.ScaleMode.Cover
				useHeight = (scaledWidth >= other.width);
			}

			if (useHeight) {
				this.width = scaledWidth;
				this.height = other.height;
			}
			else {
				this.width = other.width;
				this.height = other.width * (1 / aspectRatio);
			}

			return this;

		},


		/**
		 * Swaps the width and height values.
		 * @return {joss/geometry/Size}
		 */
		transpose: function() {
			var tmp = this.width;
			this.width = this.height;
			this.height = tmp;
			return this;
		}

	});


	/** @type {Object} */
	Size.ScaleMode = {
		Equal: 1,
		Contain: 2,
		Cover: 3
	};


	return Size;

});
