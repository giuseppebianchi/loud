define(function(require) {

	var Backbone = require("backbone");
	var TrackModel = require("models/TrackModel");
	
	var StreamCollection = Backbone.Collection.extend({
		constructorName: "Tracks",
		model: TrackModel,
		initialize: function(options){
			this.user_id = options.id;
		},
		limit: 10,
		user_id: null,
		url: function(){
			return 'http://api.soundcloud.com/users/'+ this.user_id +'/tracks?client_id=2aca68b7dc8b51ec1b20fda09b59bc9a&limit=' + this.limit;
		}
    });

	return StreamCollection;
});
