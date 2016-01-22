define(function(require) {

	var Backbone = require("backbone");
	//var PlaylistModel = require("models/PlaylistModel");
	
	var LikedPlaylistCollection = Backbone.Collection.extend({
		constructorName: "LikedPlaylistCollection",
		//model: PlaylistModel,
		initialize: function(options){
			//if all is true enable limit = 15 and url with linked partitioning = 1
			if(options.all){
				this.all = true;
			}
		},
		user_id: null,
		limit: 15,
		next: null,
		all: false,
		pagination: false,
		url: function(){
			if(this.all){
					if(this.pagination){
						return this.next;
					}else{
						return "https://api.soundcloud.com/e1/me/playlist_likes?linked_partitioning=1&limit=" + this.limit + "&oauth_token=" + localStorage.getItem("accessToken")
					}
				}
				else{
					return "https://api.soundcloud.com/e1/me/playlist_likes?limit=5&oauth_token=" + localStorage.getItem("accessToken");
				}
				
		},
		parse: function(data){
			if(this.all){
				this.pagination = true;
				this.next = data.next_href;
				return data.collection
			}else{
				return data;
			}
		}
		
    });

	return LikedPlaylistCollection;
});
