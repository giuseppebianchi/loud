define(function(require) {

	var Backbone = require("backbone");
	var UserModel = Backbone.Model.extend({
		constructorName: "UserModel",
		url:'http://api.soundcloud.com/users/543081?client_id=2aca68b7dc8b51ec1b20fda09b59bc9a'
	});

	return UserModel;
});