define(function() {

	/**
	 * Determine if an object is a jQuery element or a DOM element.
	 * @param {Any} obj
	 * @return {Boolean}
	 */
	var isElement = function(obj) {
		if (!obj || typeof obj !== "object") {
			return false;
		}

		var el = obj;
		if (obj[0]) { //possible jQuery object
			el = obj[0];
		}
		return typeof el === "object" && typeof el.nodeType === "number" && typeof el.nodeName==="string";
	};


	return isElement;

});
