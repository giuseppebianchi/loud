define(function(require) {

	var Backbone = require("backbone");

	var Activity = Backbone.Model.extend({
		constructorName: "Activity",
		//url: "http://api.soundcloud.com/tracks/"+ id +"?client_id=2aca68b7dc8b51ec1b20fda09b59bc9a"
	});

	return Activity;
});