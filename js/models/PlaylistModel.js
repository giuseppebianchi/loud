define(function(require) {

	var Backbone = require("backbone");
	var PlaylistModel = Backbone.Model.extend({
		constructorName: "PlaylistModel",
		
		initialize: function(a) {
			this.id_playlist = a.id_playlist;
			this.image = a.image;
		},
		
		url: function(){
			return 'http://api.soundcloud.com/playlists/'+ this.id_playlist +'?client_id=2aca68b7dc8b51ec1b20fda09b59bc9a';
		}
	});

	return PlaylistModel;
});