define(function(require) {

	var Backbone = require("backbone");
	var TrackModel = require("models/TrackModel");

	var TrackList = Backbone.Collection.extend({
		constructorName: "TrackList",
		model: TrackModel
	});

	return TrackList;
});