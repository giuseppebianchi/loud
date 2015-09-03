define(function(require) {

	var Backbone = require("backbone");

	var LoginModel = Backbone.Model.extend({
		constructorName: "LoginModel"
	});

	return LoginModel;
});