define(function(require) {

	var Backbone = require("backbone");
	var Activity = require("models/Activity");
	
	var StreamCollection = Backbone.Collection.extend({
		constructorName: "StreamCollection",
		model: Activity,
		limit: 50,
		token: null,
		next: null,
		future: null,
		url: function(){
				return 'https://api.soundcloud.com/me/activities/tracks?limit='+ this.limit +'&oauth_token=' + localStorage.getItem("accessToken");
		},
		parse: function(data){
			this.next = data.next_href;
			this.future = data.future_href;
			return data.collection
		}
    });

	return StreamCollection;
});
