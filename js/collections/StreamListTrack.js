define(function(require) {

	var Backbone = require("backbone");
	var TrackModel = require("models/TrackModel");

	var StreamListTrack = Backbone.Collection.extend({
		constructorName: "StreamListTrack",
		model: TrackModel,
        limit: 20,
        next: null,
        url: function(){
            var activities;
            SC.get('/activities', function(result) {
                console.log(result);
                activities = result;
            }
            return activities;
            
        }
	});

	return StreamListTrack;
});