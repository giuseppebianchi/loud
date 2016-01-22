define(function(require) {

	var Backbone = require("backbone");
	var PlaylistModel = Backbone.Model.extend({
		constructorName: "PlaylistModel",
		
		initialize: function(a) {
			var that = this;
			this.id_playlist = a.id_playlist;
			this.image = a.image;
			var playlists = JSON.parse(sessionStorage.getItem("likedPlaylists"));
			//I SEARCH ID INTO FOLLOWING TO SET STYLE OF FOLLOWING BUTTON
			_.find(playlists, function(t){
				if(t.playlist.id == a.id_playlist){
					that.favorited = 1;
					return true;
				}
			})
		},
		
		url: function(){
			return 'http://api.soundcloud.com/playlists/'+ this.id_playlist +'?client_id=2aca68b7dc8b51ec1b20fda09b59bc9a';
		},
		parse: function(data){
			if(data.artwork_url){
				this.image = data.artwork_url;
			}
			else{
				this.image = data.tracks[0].artwork_url;
			}
			return data;
		}
		
	});

	return PlaylistModel;
});