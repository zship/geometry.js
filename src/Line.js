define(function(require) {

	var Augment = require('Augment');
	var Point = require('./Point');


	/**
	 * Describes a line in two-dimensional space
	 * @param {joss/geometry/Point} p1
	 * @param {joss/geometry/Point} p2
	 * @constructs
	 */
	var Line = function(opts) {
		if (opts.p1 && opts.p2) {
			this.p1 = opts.p1;
			this.p2 = opts.p2;
		}

		//slope-intercept
		if (opts.m !== undefined && opts.b !== undefined) {
			this.p1 = new Point(0, opts.b);
			this.p2 = new Point(1, opts.m + opts.b);
		}
	};


	/** @type {joss/geometry/Point} */
	Line.prototype.p1 = { get: null, set: null };


	/** @type {joss/geometry/Point} */
	Line.prototype.p2 = { get: null, set: null };


	/** @type {joss/geometry/Point} */
	Line.prototype.m = {
		get: function() {
			if (this.p1.x - this.p2.x === 0) {
				return null;
			}
			return (this.p1.y - this.p2.y) / (this.p1.x - this.p2.x);
		}
	};


	/** @type {Number} */
	Line.prototype.b = {
		get: function() {
			if (this.m === null) {
				return null;
			}
			return this.m * this.p1.x - this.p1.y;
		}
	};


	/**
	 * @param {Number} dx
	 * @param {Number} dy
	 * @return {joss/geometry/Point}
	 */
	Line.prototype.translate = function(dx, dy) {
		return new Line({
			p1: this.p1.translate(dx, dy),
			p2: this.p2.translate(dx, dy)
		});
	};


	/**
	 * @param {joss/geometry/Line} other
	 * @return {joss/geometry/Point|void}
	 */
	Line.prototype.intersection = function(other) {

		var a1 = this.p1;
		var a2 = this.p2;
		var b1 = other.p1;
		var b2 = other.p2;

		var ua_t = (b2.x - b1.x) * (a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x);
		//var ub_t = (a2.x - a1.x) * (a1.y - b1.y) - (a2.y - a1.y) * (a1.x - b1.x);
		var u_b  = (b2.y - b1.y) * (a2.x - a1.x) - (b2.x - b1.x) * (a2.y - a1.y);

		if ( u_b !== 0 ) {
			var ua = ua_t / u_b;
			//var ub = ub_t / u_b;

			return new Point(
				a1.x + ua * (a2.x - a1.x),
				a1.y + ua * (a2.y - a1.y)
			);
		} 
		else {
			return undefined; //coincident or parallel
		}

	};


	return Augment(Line);

});
