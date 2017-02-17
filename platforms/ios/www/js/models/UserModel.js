define(function(require) {

	var Backbone = require("backbone");
	var _ = require("underscore");
	var UserModel = Backbone.Model.extend({
		constructorName: "UserModel",
		
		initialize: function(a) {
			this.id_user = a.id_user;
			var following = JSON.parse(sessionStorage.getItem("following"));
			//I SEARCH ID INTO FOLLOWING TO SET STYLE OF FOLLOWING BUTTON
			if( _.find(following, function(t){if(t.id == a.id_user){return true;}}) ){
				this.follow_button = 1;
			}
		},
		
		url: function(){
			return 'http://api.soundcloud.com/users/'+ this.id_user +'?client_id=2aca68b7dc8b51ec1b20fda09b59bc9a';
		}
	});

	return UserModel;
});