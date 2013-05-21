define(function(require) {

	var $ = require('jquery');
	var Point = require('joss/geometry/Point');


	var _scrollIsRelative = !($.browser.opera || $.browser.safari && $.browser.version < "532");


	/**
	 * Returns a DOM element lying at a point
	 *
	 * @param {joss/geometry/Point} p
	 * @return {Element}
	 */
	var fromPoint = function(x, y) {

		if(!document.elementFromPoint) {
			return null;
		}

		var p;

		if (x.constructor === Point) {
			p = x;
		}
		else {
			p = new Point(x, y);
		}

		if(_scrollIsRelative)
		{
			p.x -= $(document).scrollLeft();
			p.y -= $(document).scrollTop();
		}

		return document.elementFromPoint(p.x, p.y);
	
	};


	return fromPoint;

});
