define(function(require) {

	var $ = require('jquery');
	var Augment = require('Augment');
	var Rect = require('./Rect');
	var Elements = require('joss/util/Elements');


	var _defaults = {
		element: null,
		top: 0,
		left: 0,
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
	};


	/**
	 * @class
	 * Rect subclass which can track border, padding, and margin on a DOM
	 * Element, as well as read/write its dimensions from/to an Element
	 * @extends {joss/geometry/Rect}
	 * @constructs
	 */
	var DomRect = function(opts) {

		opts = Augment.defaults(_defaults, opts);

		//if no positioning info was passed, calculate from the DOM (below)
		if (!(opts.top || opts.left || opts.width || opts.height)) {
			return DomRect.fromElement(opts.element);
		}

		this._super(opts);
		Augment.apply(opts);

	};


	DomRect.prototype.right = {
		get: function() {
			return this._data.left +
				this._data.width +
				this._data.border.left +
				this._data.border.right +
				this._data.padding.left +
				this._data.padding.right;
		}
	};


	DomRect.prototype.bottom = {
		get: function() {
			return this._data.top +
				this._data.height +
				this._data.border.top +
				this._data.border.bottom +
				this._data.padding.top +
				this._data.padding.bottom;
		}
	};


	var _setElements = function(el) {
		el = Elements.toJquery(el);
		this._data.element = el[0];
		this._data.$element = el;
	};


	/** @type {Element} */
	DomRect.prototype.element = {
		set: function(val) {
			_setElements(val);
		}
	};


	/** @type {jQuery} */
	DomRect.prototype.$element = {
		set: function(val) {
			_setElements(val);
		}
	};


	/** @type {Object} */
	DomRect.prototype.border = { get: null, set: null };


	DomRect.prototype.border.top = {
		set: function(val) {
			var prev = this._data.border.top;
			this._data.height -= prev;
			this._data.height += val;
			this._data.border.top = val;
		}
	};


	DomRect.prototype.border.right = {
		set: function(val) {
			var prev = this._data.border.right;
			this._data.width -= prev;
			this._data.width += val;
			this._data.border.right = val;
		}
	};


	DomRect.prototype.border.bottom = {
		set: function(val) {
			var prev = this._data.border.bottom;
			this._data.height -= prev;
			this._data.height += val;
			this._data.border.bottom = val;
		}
	};


	DomRect.prototype.border.left = {
		set: function(val) {
			var prev = this._data.border.left;
			this._data.width -= prev;
			this._data.width += val;
			this._data.border.left = val;
		}
	};


	/** @type {Object} */
	DomRect.prototype.margin = { get: null, set: null };


	/** @type {Object} */
	DomRect.prototype.padding = { get: null, set: null };


	DomRect.prototype.padding.top = {
		set: function(val) {
			var prev = this._data.padding.top;
			this._data.height -= prev;
			this._data.height += val;
			this._data.padding.top = val;
		}
	};


	DomRect.prototype.padding.right = {
		set: function(val) {
			var prev = this._data.padding.right;
			this._data.width -= prev;
			this._data.width += val;
			this._data.padding.right = val;
		}
	};


	DomRect.prototype.padding.bottom = {
		set: function(val) {
			var prev = this._data.padding.bottom;
			this._data.height -= prev;
			this._data.height += val;
			this._data.padding.bottom = val;
		}
	};


	DomRect.prototype.padding.left = {
		set: function(val) {
			var prev = this._data.padding.left;
			this._data.width -= prev;
			this._data.width += val;
			this._data.padding.left = val;
		}
	};


	/**
	 * @override
	 * @param {joss/geometry/DomRect} rect
	 * @return {joss/geometry/DomRect}
	 */
	DomRect.prototype.intersected = function() {
		var intersected = new DomRect(this._super(arguments));
		intersected.element = this.element;
		intersected.border = this.border;
		intersected.margin = this.margin;
		intersected.padding = this.padding;
		return intersected;
	};


	/**
	 * @override
	 * @param {joss/geometry/DomRect} rect
	 * @return {joss/geometry/DomRect}
	 */
	DomRect.prototype.united = function() {
		var united = new DomRect(this._super(arguments));
		united.element = this.element;
		united.border = this.border;
		united.margin = this.margin;
		united.padding = this.padding;
		return united;
	};


	/**
	 * @return {joss/geometry/DomRect}
	 */
	DomRect.prototype.apply = function() {
		if (!this.element || !this.$element || this.$element.length > 1) {
			return this;
		}
		this.applyTo(this.element);
		return this;
	};


	/**
	 * @param {Element|String|jQuery} el
	 * @return {joss/geometry/DomRect}
	 */
	DomRect.prototype.applyTo = function(el) {

		el = Elements.fromAny(el);

		var dim = Elements.getDimensions(el);
		var curr = {
			top: dim.offset.top,
			left: dim.offset.left,
			width: dim.width,
			height: dim.height,
			precedence: dim.precedence,
			position: dim.position
		};

		var next = {
			top: this.top,
			left: this.left,
			width: this.width,
			height: this.height
		};

		//DomRect is a 'border-box'. Convert to 'content-box' for CSS.
		next.width -= this.padding.left + this.padding.right;
		next.height -= this.padding.top + this.padding.bottom;
		next.width -= this.border.left + this.border.right;
		next.height -= this.border.top + this.border.bottom;

		//dimensions are all gathered. what changed?
		var changed = {
			top: Math.round(curr.top) !== Math.round(next.top),
			left: Math.round(curr.left) !== Math.round(next.left),
			width: Math.round(curr.width) !== Math.round(next.width),
			height: Math.round(curr.height) !== Math.round(next.height)
		};

		var styles = {};

		if (changed.width) {
			styles.width = Math.round(next.width);
		}
		if (changed.height) {
			styles.height = Math.round(next.height);
		}

		//adjust offsets for position: relative elements (still valid for position: absolute)
		//reads: (parent-relative offset) + (change in absolute offset)
		var adjusted = {
			top: Math.round(curr.position.top + (next.top - curr.top)),
			left: Math.round(curr.position.left + (next.left - curr.left)),
			right: Math.round(-1 * (curr.position.right + (next.left - curr.left))),
			bottom: Math.round(-1 * (curr.position.bottom + (next.top - curr.top)))
		};

		var offsetParent = el.offsetParent || document.body;
		if (offsetParent !== document.body) {
			adjusted.top += offsetParent.scrollTop;
			adjusted.left += offsetParent.scrollLeft;
		}

		if (changed.top) {
			if (curr.precedence.y === 'bottom') {
				styles.bottom = Math.round(adjusted.bottom);
				//if we're not depending on 'top' to set height, disable it
				if (changed.height) {
					styles.top = 'auto';
				}
			}
			else {
				styles.top = Math.round(adjusted.top);
				if (changed.height) {
					styles.bottom = 'auto';
				}
			}
		}

		if (changed.left) {
			if (curr.precedence.x === 'right') {
				styles.right = Math.round(adjusted.right);
				if (changed.width) {
					styles.left = 'auto';
				}
			}
			else {
				styles.left = Math.round(adjusted.left);
				if (changed.width) {
					styles.right = 'auto';
				}
			}
		}

		if (curr.positioning === 'static' && (changed.top || changed.left)) {
			styles.position = 'absolute';
		}

		styles.borderTopWidth = this.border.top;
		styles.borderRightWidth = this.border.right;
		styles.borderBottomWidth = this.border.bottom;
		styles.borderLeftWidth = this.border.left;
		styles.paddingTop = this.padding.top;
		styles.paddingRight = this.padding.right;
		styles.paddingBottom = this.padding.bottom;
		styles.paddingLeft = this.padding.left;
		styles.marginTop = this.margin.top;
		styles.marginRight = this.margin.right;
		styles.marginBottom = this.margin.bottom;
		styles.marginLeft = this.margin.left;

		Elements.setStyles(el, styles);

		return this;

	};


	DomRect.fromElement = function(el) {

		el = Elements.toJquery(el);
		var dim = Elements.defaultDimensions();

		//some special cases:
		//entire document
		if (el[0] === document) {
			var docWidth = $(document).width();
			var docHeight = $(document).height();

			return new DomRect({
				top: 0,
				left: 0,
				width: docWidth,
				height: docHeight,
				border: dim.border,
				margin: dim.margin,
				padding: dim.padding
			});
		}

		//viewport, with scrolling
		if (el[0] === window) {
			var winWidth = $(window).width();
			var winHeight = $(window).height();
			var st = parseInt($(window).scrollTop(), 10);
			var sl = parseInt($(window).scrollLeft(), 10);

			return new DomRect({
				top: st,
				left: sl,
				width: winWidth,
				height: winHeight,
				border: dim.border,
				margin: dim.margin,
				padding: dim.padding
			});
		}

		var bounding;

		//regular elements, where we can ditch jQuery for most CSS
		//calculations (speed)
		el.each(function(i, el) {

			var dim = Elements.getDimensions(el);

			var rect = new DomRect({
				element: el,
				top: dim.offset.top,
				left: dim.offset.left,
				width: dim.width + dim.border.left + dim.border.right + dim.padding.left + dim.padding.right,
				height: dim.height + dim.border.top + dim.border.bottom + dim.padding.top + dim.padding.bottom,
				border: dim.border,
				margin: dim.margin,
				padding: dim.padding
			});

			//first iteration
			if (!bounding) {
				bounding = rect;
				return true; //continue
			}

			bounding = bounding.united(rect);

			return true;

		});

		return bounding;

	};


	/**
	 * Find the 'border-box' bounding rectangle of matched elements.  Or, set
	 * the bounding rectangle of the first matched element
	 *
	 * @return {joss/geometry/DomRect}
	 */
	$.fn.rect = function(opts) {

		opts = opts || {};

		if (opts.constructor === DomRect) {
			opts.applyTo(this.first());
			return this;
		}

		opts.element = this;
		return new DomRect(opts);

	}; //jQuery.fn.rect


	return Augment(DomRect, Rect);

});
