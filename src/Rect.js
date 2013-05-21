define(function(require) {

	var Augment = require('Augment');
	var lang = require('dojo/_base/lang');
	var Point = require('./Point');
	var Position = require('./Position');
	var defaults = require('mout/lang/defaults');


	var _defaults = {
		top: 0,
		left: 0,
		width: 0,
		height: 0
	};


	/**
	 * @class
	 * @param {Object} opts : the coordinates of the rectangle.
	 * four of these properties are required: any four that
	 * can logically be used to construct a rectangle.
	 * @constructs
	 */
	var Rect = function(opts) {

		opts.top = defaults(opts.top, opts.t);
		opts.right = defaults(opts.right, opts.r);
		opts.bottom = defaults(opts.bottom, opts.b);
		opts.left = defaults(opts.left, opts.l);
		opts.width = defaults(opts.width, opts.w);
		opts.height = defaults(opts.height, opts.h);

		if (opts.top === undefined) {
			opts.top = opts.bottom - opts.height;
		}

		if (opts.left === undefined) {
			opts.left = opts.right - opts.width;
		}

		if (opts.width === undefined) {
			opts.width = opts.right - opts.left;
		}

		if (opts.height === undefined) {
			opts.height = opts.bottom - opts.top;
		}

		Augment.apply(opts);

	};

	/** @type {Number} */
	Rect.prototype.top = { get: null, set: null };


	/** @type {Number} */
	Rect.prototype.left = { get: null, set: null };


	/** @type {Number} */
	Rect.prototype.width = { get: null, set: null };


	/** @type {Number} */
	Rect.prototype.height = { get: null, set: null };


	/** @type {Number} */
	Rect.prototype.right = {
		get: function() {
			return this._data.left + this._data.width;
		},
		set: function(val) {
			this._data.width = val - this._data.left;
		}
	};


	/** @type {Number} */
	Rect.prototype.bottom = {
		get: function() {
			return this._data.top + this._data.height;
		},
		set: function(val) {
			this._data.height = val - this._data.top;
		}
	};


	/**
	 * @param {Number} dx
	 * @param {Number} dy
	 * @return {joss/geometry/Rect}
	 */
	Rect.prototype.translate = function(dx, dy) {
		this.left += dx;
		this.top += dy;
		return this;
	};


	/**
	 * @param {Number} y
	 * @return {joss/geometry/Rect}
	 */
	Rect.prototype.moveBottom = function(y) {
		return this.moveTo(new Point(this.left, y - this.height));
	};


	/**
	 * @param {joss/geometry/Point} p
	 * @return {joss/geometry/Rect}
	 */
	Rect.prototype.moveBottomLeft = function(p) {
		return this.moveTo(new Point(p.x, p.y - this.height));
	};


	/**
	 * @param {joss/geometry/Point} p
	 * @return {joss/geometry/Rect}
	 */
	Rect.prototype.moveBottomRight = function(p) {
		return this.moveTo(new Point(p.x - this.width, p.y - this.height));
	};


	/**
	 * @param {joss/geometry/Point} p
	 * @return {joss/geometry/Rect}
	 */
	Rect.prototype.moveCenter = function(p) {
		var offset_x = p.x - this.center.x;
		var offset_y = p.y - this.center.y;
		return this.translate(offset_x, offset_y);
	};


	/**
	 * @param {Number} x
	 * @return {joss/geometry/Rect}
	 */
	Rect.prototype.moveLeft = function(x) {
		return this.moveTo(new Point(x, this.top));
	};


	/**
	 * @param {Number} x
	 * @return {joss/geometry/Rect}
	 */
	Rect.prototype.moveRight = function(x) {
		return this.moveTo(new Point(x - this.width, this.top));
	};


	/**
	 * @param {joss/geometry/Point} p
	 * @return {joss/geometry/Rect}
	 */
	Rect.prototype.moveTo = function(p) {
		return this.translate(
			p.x - this.left,
			p.y - this.top
		);
	};


	/**
	 * @param {Number} y
	 * @return {joss/geometry/Rect}
	 */
	Rect.prototype.moveTop = function(y) {
		return this.moveTo(new Point(this.left, y));
	};


	/**
	 * @param {joss/geometry/Point} p
	 * @return {joss/geometry/Rect}
	 */
	Rect.prototype.moveTopLeft = function(p) {
		return this.moveTo(p);
	};


	/**
	 * @param {joss/geometry/Point} p
	 * @return {joss/geometry/Rect}
	 */
	Rect.prototype.moveTopRight = function(p) {
		return this.moveTo(new Point(p.x - this.width, p.y));
	};


	/**
	 * Shorthand for relative positioning to another Rectangle
	 * object; an alternative to the move\* and center\* methods
	 * using {joss/geometry/Position} objects.
	 *
	 * @param {Object} opts
	 * @return {joss/geometry/Rect}
	 */
	Rect.prototype.position = function(opts) {
		opts = lang.mixin({
			my: null, //string or Position
			at: null, //string or Position
			of: null, //joss/geometry/Rect
			offset: null //{x, y} || {by:Number, towards:Point|awayFrom:Point}
		}, opts);

		if (opts.my && opts.my.constructor === String) {
			opts.my = new Position(opts.my);
		}
		if (opts.at && opts.at.constructor === String) {
			opts.at = new Position(opts.at);
		}
		if (opts.offset && opts.offset.constructor === String) {
			var parts = opts.offset.split(' ');
			opts.offset = {
				x: parts[0],
				y: parts[1]
			};
		}

		//absolute coordinates of the point to which we're
		//moving this rectange
		var dest = new Point(0, 0);
		//console.log(opts.my, opts.at, opts.of, opts.offset);
		switch(opts.at.x) {
		case 'left':
			dest.x = opts.of.left;
			break;
		case 'center':
			dest.x = opts.of.center.x;
			break;
		case 'right':
			dest.x = opts.of.right;
			break;
		}

		switch(opts.at.y) {
		case 'top':
			dest.y = opts.of.top;
			break;
		case 'center':
			dest.y = opts.of.center.y;
			break;
		case 'bottom':
			dest.y = opts.of.bottom;
			break;
		}

		//move the rectangle.  start at the center as a baseline.
		this.moveCenter(opts.of.center);

		switch(opts.my.x) {
		case 'left':
			this.moveLeft(dest.x);
			break;
		case 'center':
			//already centered
			break;
		case 'right':
			this.moveRight(dest.x);
			break;
		}

		switch(opts.my.y) {
		case 'top':
			this.moveTop(dest.y);
			break;
		case 'center':
			//already centered
			break;
		case 'bottom':
			this.moveBottom(dest.y);
			break;
		}

		if (!opts.offset) {
			return this;
		}

		//finally, apply any requested offset
		//absolute offset
		if (opts.offset.x || opts.offset.y) {
			this.translate(opts.offset.x || 0, opts.offset.y || 0);
		}
		//relative offset
		else if (opts.offset.by) {
			var p;
			if (opts.offset.towards) {
				p = this.center.moveBy(opts.offset.by, 'towards', opts.offset.towards);
				this.moveCenter(p);
			}
			else if (opts.offset.awayFrom) {
				p = this.center.moveBy(opts.offset.by, 'awayFrom', opts.offset.awayFrom);
				this.moveCenter(p);
			}
		}

		return this;
	};


	/**
	 * Return the point on this rectangle lying at the given position.
	 * @param {Position|String} pos
	 * @return {Point}
	 */
	Rect.prototype.pointAt = function(pos) {

		if (pos.constructor !== Position) {
			pos = new Position(pos);
		}

		var point = new Point();

		switch (pos.x) {
			case 'left':
				point.x = this.left;
				break;
			case 'right':
				point.x = this.right;
				break;
			default:
				point.x = this.center.x;
				break;
		}

		switch (pos.y) {
			case 'top':
				point.y = this.top;
				break;
			case 'bottom':
				point.y = this.bottom;
				break;
			default:
				point.y = this.center.y;
				break;
		}

		return point;
	
	};


	/**
	 * @param {joss/geometry/Point|joss/geometry/Rect} target
	 * @return {Boolean}
	 */
	Rect.prototype.contains = function(target) {
		if (target.constructor === Point) {
			return this._containsPoint(target);
		}
		else if (target.constructor === Rect) {
			return this._containsRect(target);
		}
	};


	Rect.prototype._containsPoint = function(p) {
		return (p.x >= this.left && p.x <= this.right && p.y >= this.top && p.y <= this.bottom);
	};


	Rect.prototype._containsRect = function(rect) {
		var self = this.normalized();
		var other = rect.normalized();

		if (other.left < self.left || other.right > self.right) {
			return false;
		}

		if (other.top < self.top || other.bottom > self.bottom) {
			return false;
		}

		return true;
	};


	/**
	 * @param {joss/geometry/Rect} rect
	 * @return {Boolean}
	 */
	Rect.prototype.intersects = function(rect) {
		var self = this.normalized();
		var other = rect.normalized();

		//is outside of
		if (self.left > other.right || self.right < other.left) {
			return false;
		}

		//is outside of
		if (self.top > other.bottom || self.bottom < other.top) {
			return false;
		}

		//is fully contained by
		if (self.contains(other)) {
			return false;
		}

		return true;
	};


	/** @type {joss/geometry/Point} */
	Rect.prototype.center = {
		get: function() {
			var center = this.left + (this.right - this.left) / 2;
			var middle = this.top + (this.bottom - this.top) / 2;
			return new Point(center, middle);
		},
		set: function(p) {
			this.moveCenter(p);
		}
	};


	/** @type {joss/geometry/Point} */
	Rect.prototype.topLeft = {
		get: function() {
			return new Point(this.left, this.top);
		},
		set: function(p) {
			this.top = p.y;
			this.left = p.x;
		}
	};


	/** @type {joss/geometry/Point} */
	Rect.prototype.topRight = {
		get: function() {
			return new Point(this.right, this.top);
		},
		set: function(p) {
			this.top = p.y;
			this.right = p.x;
		}
	};


	/** @type {joss/geometry/Point} */
	Rect.prototype.bottomLeft = {
		get: function() {
			return new Point(this.left, this.bottom);
		},
		set: function(p) {
			this.bottom = p.y;
			this.left = p.x;
		}
	};


	/** @type {joss/geometry/Point} */
	Rect.prototype.bottomRight = {
		get: function() {
			return new Point(this.right, this.bottom);
		},
		set: function(p) {
			this.bottom = p.y;
			this.right = p.x;
		}
	};


	/**
	 * @param {joss/geometry/Rect} rect
	 * @return {joss/geometry/Rect}
	 */
	Rect.prototype.united = function(rect) {
		var self = this.normalized();
		var other = rect.normalized();

		return new Rect({
			t: Math.min(self.top, other.top),
			l: Math.min(self.left, other.left),
			r: Math.max(self.right, other.right),
			b: Math.max(self.bottom, other.bottom)
		});
	};


	/**
	 * @param {joss/geometry/Rect} rect
	 * @return {joss/geometry/Rect}
	 */
	Rect.prototype.intersected = function(rect) {
		if (!this.intersects(rect)) {
			return null;
		}

		var self = this.normalized();
		var other = rect.normalized();

		return new Rect({
			t: Math.max(self.top, other.top),
			l: Math.max(self.left, other.left),
			r: Math.min(self.right, other.right),
			b: Math.min(self.bottom, other.bottom)
		});
	};


	/**
	 * @return {joss/geometry/Rect}
	 */
	Rect.prototype.normalized = function() {
		var rect = this.clone();
		if (rect.width < 0) {
			rect.left = rect.right;
			rect.width = Math.abs(rect.width);
		}
		if (rect.height < 0) {
			rect.top = rect.bottom;
			rect.height = Math.abs(rect.height);
		}
		return rect;
	};


	Rect.prototype.toString = function() {
		return 'Rect' + 
			' t:' + this.top + 
			' l:' + this.left + 
			' r:' + this.right + 
			' b:' + this.bottom +
			' w:' + this.width +
			' h:' + this.height;
	};


	return Augment(Rect);

});
