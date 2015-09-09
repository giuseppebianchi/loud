define(function(require) {

	var Backbone = require("backbone");
	var resp;
	var UserModel = Backbone.Model.extend({
		constructorName: "UserModel",
		sync: function(method, model, options) {
			try {

				    switch (method) {
				      case "read":
				        resp = model.id != undefined ? store.find(model) : store.findAll();
				        break;
				      case "create":
				        resp = store.create(model);
				        break;
				      case "update":
				        resp = store.update(model);
				        break;
				      case "delete":
				        resp = store.destroy(model);
				        break;
				    }

				  } catch(error) {
				    if (error.code === 22 && store._storageSize() === 0)
				      errorMessage = "Private browsing is unsupported";
				    else
				      errorMessage = error.message;
				  }
		}
	});

	return UserModel;
});