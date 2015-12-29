define(function(require) {

	var Backbone = require("backbone");
	var TrackModel = require("models/TrackModel");
	
	var StreamCollection = Backbone.Collection.extend({
		constructorName: "Tracks",
		model: TrackModel,
		initialize: function(options){
			this.playlist_id = options.id;
			this.track_count = options.track_count;
		},
		limit: 15,
		user_id: null,
		next: null,
		future: null,
		pagination: false,
		url: function(){
			return 'http://api.soundcloud.com/playlist/'+ this.playlist_id +'?client_id=2aca68b7dc8b51ec1b20fda09b59bc9a';
		}
/*
		url: function(){
				if(this.pagination){
					return this.next;
				}else{
					return 'http://api.soundcloud.com/users/'+ this.user_id +'/tracks?client_id=2aca68b7dc8b51ec1b20fda09b59bc9a&limit=' + this.limit + "&linked_partitioning=1";
				}
				
		},
		parse: function(data){
			this.pagination = true;
			this.next = data.next_href;
			return data.collection
		}
*/
    });

	return StreamCollection;
});
