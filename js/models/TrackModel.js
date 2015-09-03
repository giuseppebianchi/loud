define(function(require) {

	var Backbone = require("backbone");

	var TrackModel = Backbone.Model.extend({
		constructorName: "TrackModel"
	});

	return TrackModel;
});