define(function(require) {

	var Backbone = require("backbone");
	var LibraryModel = Backbone.Model.extend({
		constructorName: "LibraryModel",
		
		initialize: function() {
			this.view = localStorage.getItem("selectLibrary")
		},
	});
	LibraryModel.prototype.fetch = function() { return this; };

	return LibraryModel;
});