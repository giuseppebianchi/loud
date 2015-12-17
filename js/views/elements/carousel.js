define(function(require) {
  var $ = require("jquery");
  var Backbone = require("backbone");
  var Utils = require("utils");

  var CarouselView = Utils.Page.extend({

    constructorName: "CarouselView",
    
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
				  	//set received data into template
					that.$el.html(that.template(playlist.models));
					
					//disable events and set empty (blurred)image on playlists container
					if(!playlist.length){
						that.undelegateEvents();
					}
			  }
		  })

      return this;
    },
    prevent: function(e){
	    e.stopImmediatePropagation();
    }
 });

  return CarouselView;

});