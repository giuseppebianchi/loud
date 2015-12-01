define(function(require) {

	var Backbone = require("backbone");
	var TrackModel = require("models/TrackModel");

	var StreamCollection = Backbone.Collection.extend({
		constructorName: "StreamCollection",
		model: TrackModel
        });

	return StreamCollection;
});
