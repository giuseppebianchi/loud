define(function(require) {

	var Backbone = require("backbone");
	//var Playlist = require("models/PlaylistModel");
	
	var UserPlaylistCollection = Backbone.Collection.extend({
		constructorName: "UserPlaylistCollection",
		//model: Playlist,
		initialize: function(options){
			this.user_id = options.id;
			this.total = options.total;
			//if all is true enable limit = 15 and url with linked partitioning = 1
			if(options.all){
				this.username = options.name;
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
					return 'http://api.soundcloud.com/users/'+ this.user_id +'/playlists?client_id=2aca68b7dc8b51ec1b20fda09b59bc9a&linked_partitioning=1&limit='+ this.limit;
				}
			}
			else{
				return 'http://api.soundcloud.com/users/'+ this.user_id +'/playlists?client_id=2aca68b7dc8b51ec1b20fda09b59bc9a&limit=5';
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

	return UserPlaylistCollection;
});
