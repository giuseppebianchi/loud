define(function(require) {

	var Backbone = require("backbone");
	var Activity = require("models/Activity");
	
	var DiscoverCollection = Backbone.Collection.extend({
		constructorName: "DiscoverCollection",
		model: Activity,
		limit: 15,
		token: null,
		next: null,
		future: null,
		pagination: false,
		url: function(){
				if(this.pagination){
					return this.next + "&client_id=2aca68b7dc8b51ec1b20fda09b59bc9a";
				}else{
					return 'http://api.soundcloud.com/tracks/238399268/related?client_id=2aca68b7dc8b51ec1b20fda09b59bc9a&limit=15&linked_partitioning=1';
				}
				
		},
		parse: function(data){
			this.pagination = true;
			this.next = data.next_href;
			this.future = data.future_href;
			return data.collection
		}
    });

	return DiscoverCollection;
});
