define(function(require) {

	var Class = require('class/Class');


	//Abstraction of relative positioning information, modeled after jQuery UI
	//(more predictable) and jquery.qTip (more precise)
	var Position = Class.extend(/** @lends Position.prototype */ {

		__defaults: {
			x: null,
			y: null,
			precedence: null
		},


		/**
		 * @constructs
		 */
		constructor: function(opts) {

			if (opts && opts.constructor === String) {
				return Position.fromString(opts);
			}

			this._apply(opts);

		},


		/** @type {String} */
		x: { get: null, set: null },


		/** @type {String} */
		y: { get: null, set: null },


		/** @type {String} */
		precedence: { get: null, set: null },


		/** @type {Array<String>} */
		order: {
			get: function() {
				if (this.precedence === 'x') {
					return ['x', 'y'];
				}

				return ['y', 'x'];
			}
		},


		/** @type {Array<String>} */
		parts: {
			get: function() {
				if (this.precedence === 'x') {
					return [this.x, this.y];
				}

				return [this.y, this.x];
			}
		},


		/**
		 * @return {joss/geometry/Position}
		 */
		reverse: function() {
			var pos = this.clone();

			if (pos.x === 'left') {
				pos.x = 'right';
			}
			else if (pos.x === 'right') {
				pos.x = 'left';
			}
			else {
				pos.x = 'center';
			}

			if (pos.y === 'top') {
				pos.y = 'bottom';
			}
			else if (pos.y === 'bottom') {
				pos.y = 'top';
			}
			else {
				pos.y = 'center';
			}

			return pos;
		},


		/**
		 * @return {String}
		 */
		toString: function() {
			if (this.precedence === 'x') {
				return this.x + ' ' + this.y;
			}
			else {
				return this.y + ' ' + this.x;
			}
		}
	
	}); //Position


	/**
	 * translate something like 'left top' into a Position object. order
	 * doesn't matter.
	 * @param {String} str
	 * @return {joss/geometry/Position}
	 */
	Position.fromString = function(str) {
		var parts = str.split(' ');
		var axes = [];

		if (parts.length === 1) {
			parts[1] = 'center';
		}

		parts.forEach(function(part, i) {
			switch (part) {
				case 'left':
				case 'right':
					axes[i] = 'x';
					break;
				case 'top':
				case 'bottom':
					axes[i] = 'y';
					break;
				default:
					axes[i] = null;
					parts[i] = 'center';
					break;
			}
		});

		//each axis, if null ("center" was given), is the opposite of the other axis
		axes[0] = axes[0] || ((axes[1] === 'x') ? 'y' : 'x');
		axes[1] = axes[1] || ((axes[0] === 'x') ? 'y' : 'x');

		var pos = new Position();
		pos.precedence = axes[0];

		axes.forEach(function(axis, i) {
			switch(axis) {
				case 'x':
					pos.x = parts[i];
					break;
				case 'y':
					pos.y = parts[i];
					break;
			}
		});

		return pos;
	};

	return Position;

});
