define(function(require) {

	var Backbone = require("backbone");

	var PlaylistModel = Backbone.Model.extend({
		constructorName: "Playlist"
	});

	return PlaylistModel;
});