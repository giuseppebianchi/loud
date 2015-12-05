define(function(require) {
  var $ = require("jquery");
  var Backbone = require("backbone");
  var Utils = require("utils");

  var UserView = Utils.Page.extend({

    constructorName: "UserView",
    
    events:{
	    "touchstart": "prevent"
	},
	
    initialize: function() {
      // load the precompiled template
      this.template = Utils.templates.carousel;
    },
    
    tagName: "div",
    
    className: "carousel",
    
    parent: undefined,

    render: function() {
		var that = this;
		  this.collection.fetch({
			  success: function(playlist){
				  console.log(playlist.models[0].attributes.tracks[0])
				  	//set received data into template
					that.$el.html(that.template(playlist.models));
			  }
		  })

      return this;
    },
    prevent: function(e){
	    e.stopImmediatePropagation();
    }
 });

  return UserView;

});