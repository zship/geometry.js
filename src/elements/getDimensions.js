define(function(require) {

	var $ = require('jquery');
	var forOwn = require('mout/object/forOwn');
	var getStyles = require('./getStyles');


	/**
	 * Performant way to accurately get all dimensions of a DOM element.
	 *
	 * @param {Element} el
	 * @return {Object}
	 */
	var getDimensions = function(el) {

		var names = [
			'position',
			'top',
			'bottom',
			'left',
			'right',
			'borderTopWidth',
			'borderBottomWidth',
			'borderLeftWidth',
			'borderRightWidth',
			'marginTop',
			'marginBottom',
			'marginLeft',
			'marginRight',
			'paddingTop',
			'paddingBottom',
			'paddingLeft',
			'paddingRight'
		];

		var styles = getStyles(el, names);

		forOwn(styles, function(val, key) {
			if ([
				'position',
				'top',
				'bottom',
				'left',
				'right'
				].indexOf(key) !== -1
			) {
				styles[key] = val;
				return true; //continue
			}
			styles[key] = parseInt(val, 10) || 0;
		});

		var dim = {
			positioning: styles['position'],
			precedence: {
				x: (styles['left'] !== 'auto' || styles['right'] === 'auto') ? 'left' : 'right',
				y: (styles['top'] !== 'auto' || styles['bottom'] === 'auto') ? 'top' : 'bottom'
			},
			//we're doing offsets relative to the *document*
			//in order to normalize between elements with different offset
			//parents. This is notoriously tricky, so use jQuery's offset()
			//instead of the faster offsetTop and offsetLeft
			offset: $(el).offset(),
			border: {
				top: styles['borderTopWidth'],
				bottom: styles['borderBottomWidth'],
				left: styles['borderLeftWidth'],
				right: styles['borderRightWidth']
			},
			margin: {
				top: styles['marginTop'],
				bottom: styles['marginBottom'],
				left: styles['marginLeft'],
				right: styles['marginRight']
			},
			padding: {
				top: styles['paddingTop'],
				bottom: styles['paddingBottom'],
				left: styles['paddingLeft'],
				right: styles['paddingRight']
			}
		};

		//IE handes offsetTop and offsetLeft a bit differently, counting the
		//offsetParent's borders, so 'top' != offsetTop. calculate
		//offsetTop/offsetLeft like jQuery's position(), reusing some of the
		//info we already have for a modest performance boost
		var offset = {
			top: dim.offset.top,
			left: dim.offset.left
		};

		//subtract element margins
		offset.top -= dim.margin.top;
		offset.left -= dim.margin.left;

		//var offsetParent = $(el).offsetParent()[0];
		var offsetParent = el.offsetParent || document.body;
		var parentStyles = getStyles(offsetParent, ['borderTopWidth', 'borderBottomWidth', 'borderLeftWidth', 'borderRightWidth']);

		var parent = {
			element: offsetParent,
			offset: /^(?:body|html)$/i.test(offsetParent.nodeName) ? {top: 0, left: 0} : $(offsetParent).offset(),
			width: offsetParent.offsetWidth,
			height: offsetParent.offsetHeight,
			border: {
				top: parseInt(parentStyles['borderTopWidth'], 10) || 0,
				bottom: parseInt(parentStyles['borderBottomWidth'], 10) || 0,
				left: parseInt(parentStyles['borderLeftWidth'], 10) || 0,
				right: parseInt(parentStyles['borderRightWidth'], 10) || 0
			}
		};

		dim.position = {
			top: offset.top - (parent.offset.top + parent.border.top),
			left: offset.left - (parent.offset.left + parent.border.left),
			right: (offset.left + el.offsetWidth) - (parent.offset.left + parent.width),
			bottom: (offset.top + el.offsetHeight) - (parent.offset.top + parent.height)
		};

		//offsetWidth and offsetHeight include borders and padding.
		//get the 'content-box' width/height
		dim.width = el.offsetWidth;
		dim.width -= dim.border.left + dim.border.right;
		dim.width -= dim.padding.left + dim.padding.right;

		dim.height = el.offsetHeight;
		dim.height -= dim.border.top + dim.border.bottom;
		dim.height -= dim.padding.top + dim.padding.bottom;

		return dim;

	};


	return getDimensions;

});
