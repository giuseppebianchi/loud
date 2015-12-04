define(function(require) {

	var Backbone = require("backbone");
	var TrackModel = require("models/TrackModel");
	var token = localStorage.getItem("accessToken");
	debugger;
	var StreamCollection = Backbone.Collection.extend({
		constructorName: "StreamCollection",
		model: TrackModel,
		limit: 15,
		url: 'https://api.soundcloud.com/me/activities?limit=15&oauth_token=' + localStorage.getItem("accessToken"),
		parse: function(data){
			this.next = data.next_href;
			this.future = data.future_href;
			return data.collection
		}
    });

	return StreamCollection;
});
