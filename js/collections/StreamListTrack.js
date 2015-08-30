define(function(require) {

	var Backbone = require("backbone");
	var TrackModel = require("models/TrackModel");

	var StreamListTrack = Backbone.Collection.extend({
		constructorName: "StreamListTrack",
		model: TrackModel,
        limit: 20,
        url:  function(){
        			
                    SC.get('/me/activities', function(activities) {
                    	console.log(activities);
                    //return "http://www.expo.abruzzo.it/rest/news_pag.php?rquest=get&limit="+encodeURIComponent(this.limit);
                    });
                }
	});

	return StreamListTrack;
});