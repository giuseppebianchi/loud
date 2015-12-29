define(function(require) {

	var Backbone = require("backbone");
	var UserModel = Backbone.Model.extend({
		constructorName: "UserModel",
		
		initialize: function(a) {
			this.id_user = a.id_user;
		},
		
		url: function(){
			return 'http://api.soundcloud.com/users/'+ this.id_user +'?client_id=2aca68b7dc8b51ec1b20fda09b59bc9a';
		}
	});

	return UserModel;
});