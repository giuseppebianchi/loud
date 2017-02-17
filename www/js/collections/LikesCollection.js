define(function(require) {

	var Backbone = require("backbone");
	var TrackModel = require("models/TrackModel");
	
	var FollowingCollection = Backbone.Collection.extend({
		constructorName: "FollowingCollection",
		model: TrackModel,
		initialize: function(options){
		},
		user_id: "likes",
		limit: 20,
		next: null,
		pagination: false,
		url: function(){
			
				if(this.next){
					return this.next;
				}else{
					return 'http://api.soundcloud.com/me/favorites?linked_partitioning=1&limit='+ this.limit + '&oauth_token=' + localStorage.getItem("accessToken");
				}
		},
		parse: function(data){
				this.next = data.next_href;
				return data.collection
		}
		
    });

	return FollowingCollection;
});
