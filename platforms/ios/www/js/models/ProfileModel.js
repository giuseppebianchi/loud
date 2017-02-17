define(function(require) {

	var Backbone = require("backbone");
	var ProfileModel = Backbone.Model.extend({
		constructorName: "ProfileModel",
		
		initialize: function() {
			
		},
		
		url: function(){
			return 'http://api.soundcloud.com/me/?oauth_token=' + localStorage.getItem("accessToken");
		}
	});

	return ProfileModel;
});