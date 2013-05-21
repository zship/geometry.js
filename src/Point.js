define(function(require) {

	var Class = require('class/Class');


	//Describes a point in two-dimensional space
	var Point = Class.extend(/** @lends Point.prototype */ {

		/**
		 * Point describes a point in a plane. It is used as a very basic building
		 * block in most of the joss geometry classes.
		 * @param {Number} x
		 * @param {Number} y
		 * @constructs
		 */
		constructor: function(x, y) {
			this.x = x || 0;
			this.y = y || 0;
			return this;
		},


		/**
		 * Move a point
		 * @param {Number} dx Pixels to translate horizontally
		 * @param {Number} dy Pixels to translate vertically
		 * @return {joss/geometry/Point}
		 */
		translate: function(dx, dy) {
			this.x += dx;
			this.y += dy;
			return this;
		},


		/**
		 * Move a point towards or away from another point
		 * @param {Number} val : Pixels to translate
		 * @param {String} direction : 'awayFrom' or 'towards'
		 * @param {joss/geometry/Point} target
		 * @return {joss/geometry/Point}
		 */
		moveBy: function(val, direction, target) {
			var length = Math.sqrt(Math.pow(target.x - this.x, 2) + Math.pow(target.y - this.y, 2));
			var percentage = val / length;
			var dx = (target.x - this.x) * percentage;
			var dy = (target.y - this.y) * percentage;

			if (direction === 'towards') {
				this.translate(dx, dy);
			}
			else {
				this.translate(-dx, -dy);
			}
			return this;
		},


		round: function() {
			this.x = Math.round(this.x);
			this.y = Math.round(this.y);
			return this;
		}

	});

	return Point;

});
