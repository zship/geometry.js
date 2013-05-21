define(function(require) {

	var Rect = require('./Rect');
	var DomRect = require('./DomRect');
	var Point = require('./Point');


	/**
	 * @namespace
	 * @alias joss/geometry/Rects
	 */
	var Rects = {};


	/**
	 * Return the minimum left or top value, according to `axis`, in the
	 * `list`.
	 *
	 * @param {Array<Rect>} list
	 * @param {String} axis
	 * @return {Number}
	 */
	Rects.min = function(list, axis) {
		var min = null;

		list.forEach(function(r) {
			var rect = r.normalized();

			switch(axis) {
			case 'x':
				min = (min === null) ? rect.left : min;
				min = Math.min(min, rect.left);
				break;
			case 'y':
				min = (min === null) ? rect.top : min;
				min = Math.min(min, rect.top);
				break;
			}
		});

		return min;
	};


	/**
	 * Return the maxiumum right or bottom value, according to `axis`, in the
	 * `list`.
	 *
	 * @param {Array<Rect>} list
	 * @param {String} axis
	 * @return {Number}
	 */
	Rects.max = function(list, axis) {
		var max = null;

		list.forEach(function(r) {
			var rect = r.normalized();

			switch(axis) {
			case 'x':
				max = (max === null) ? rect.right : max;
				max = Math.max(max, rect.right);
				break;
			case 'y':
				max = (max === null) ? rect.bottom : max;
				max = Math.max(max, rect.bottom);
				break;
			}
		});

		return max;
	};


	/**
	 * Align all {Rect}s in `list` along `axis` ('x' or 'y') at the given
	 * `position` ('top', 'right', 'bottom', 'left', or 'center').
	 *
	 * @param {Array<Rect>} list
	 * @param {String} axis
	 * @param {String} position
	 */
	Rects.align = function(list, axis, position) {

		var min = Rects.min(list, axis);
		var max = Rects.max(list, axis);
		var pos = {x: null, y: null};

		switch(axis) {
		case 'x':
			pos.x = position;
			break;
		case 'y':
			pos.y = position;
			break;
		}

		list.forEach(function(rect) {
			switch(pos.x) {
			case 'left':
				rect.moveLeft(min);
				break;
			case 'right':
				rect.moveRight(max);
				break;
			case 'center':
			case 'middle':
				rect.moveCenter(new Point(min + (max - min) / 2, rect.center.y));
				break;
			}

			switch(pos.y) {
			case 'top':
				rect.moveTop(min);
				break;
			case 'bottom':
				rect.moveBottom(max);
				break;
			case 'center':
			case 'middle':
				rect.moveCenter(new Point(rect.center.x, min + (max - min) / 2));
				break;
			}
		});

	};


	/**
	 * Evenly distribute all {Rect}s in `list` along `axis`.
	 *
	 * @param {Array<Rect>} list
	 * @param {String} axis
	 */
	Rects.distribute = function(list, axis) {

		var min = Rects.min(list, axis);
		var max = Rects.max(list, axis);
		var cumulativeSize = 0;

		list.forEach(function(rect) {
			switch(axis) {
			case 'x':
				cumulativeSize += rect.width;
				break;
			case 'y':
				cumulativeSize += rect.height;
				break;
			}
		});

		var spacing = Math.abs((max - min - cumulativeSize) / (list.length - 1));

		list.forEach(function(rect, i) {
			var last = (i > 0) ? list[i - 1] : new Rect({l: min, r: min - spacing, t: min, b: min - spacing});
			switch(axis) {
			case 'x':
				rect.moveLeft(last.right);
				rect.translate(spacing, 0);
				break;
			case 'y':
				rect.moveTop(last.bottom);
				rect.translate(spacing, 0);
				break;
			}
		});

	};


	/**
	 * Call {DomRect#apply} on all {DomRect}s in `list`.
	 *
	 * @param {Array<DomRect>} list
	 */
	Rects.apply = function(list) {
		list.forEach(function(rect) {
			if (rect.constructor === DomRect) {
				rect.apply();
			}
		});
	};


	return Rects;

});
