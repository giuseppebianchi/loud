define(function(require) {

	var Backbone = require("backbone");
	//var LibraryTrackModel = require("models/LibraryTrackModel");
	
	var LibraryTrackCollection = Backbone.Collection.extend({
		constructorName: "LibraryTrackCollection",
		
		initialize: function() {
			
		},
		sync: function(){return null},
		fetch: function(options) {
			options = options ? _.clone(options) : {};
			if (options.parse === void 0) options.parse = true;
			var success = options.success;
			var collection = this;
			//var resp = JSON.parse(sessionStorage.getItem("following"));
			dbTracks.query('loud/tracks', {
				  include_docs: true
			}).then(function (result) {
					var resp = result.rows;
					var method = options.reset ? 'reset' : 'set';
					collection[method](resp, options);
					if (success) success.call(options.context, collection, resp, options);
					collection.trigger('sync', collection, resp, options);
					
			}).catch(function (err) {
				  console.log(err);
			});
			
	    },
		
	});
	
	return LibraryTrackCollection;
});