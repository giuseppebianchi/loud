define(function(require) {

	var Backbone = require("backbone");
	//var LibraryTrackModel = require("models/LibraryTrackModel");
	
	var SortedLikesCollection = Backbone.Collection.extend({
		constructorName: "SortedLikesCollection",
		
		initialize: function(options) {
			this.total_likes = options.total_likes;
		},
		sync: function(){return null},
		fetch: function(options) {
			options = options ? _.clone(options) : {};
			if (options.parse === void 0) options.parse = true;
			var success = options.success;
			var collection = this;
			//var resp = JSON.parse(sessionStorage.getItem("following"));
			var likes = JSON.parse(sessionStorage.getItem("likes"))
		    var resp = _.groupBy(likes, function(t){
			      return t.user.username
		    })
		    resp = _.toArray(resp)
			var method = options.reset ? 'reset' : 'set';
			collection[method](resp, options);
			if (success) success.call(options.context, collection, resp, options);
			collection.trigger('sync', collection, resp, options);
		},
		
	});
	
	return SortedLikesCollection;
});