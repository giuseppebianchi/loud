
define(['handlebars'], 
	function (Handlebars) {
	    'use strict';

	   ...

	    /**
	     * Handlebars helper: shout
	     *
	     * @example
	     * // returns 'the bar helper got: HELLO !!'
	     * {{shout 'hello' }}
	     */
	    Handlebars.registerHelper('shout', function (words) {
	        return words.toUpperCase() + ' !!';
	    });

	    Handlebars.registerHelper('compare', function(v1, v2, options) {
	          if(v1 === v2) {
	            return options.fn(this);
	          }
	          return options.inverse(this);
	    });
		

		Handlebars.registerHelper('subString', function(string) {
	        var large = string.replace("large","t500x500");
	        return new Handlebars.SafeString(large)
	    });
	    

	    return Handlebars;
	});