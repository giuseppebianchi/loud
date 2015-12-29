define(function(require) {
  var $ = require("jquery");
  var Backbone = require("backbone");
  var Utils = require("utils");

  var CarouselView = Utils.Page.extend({

    constructorName: "CarouselView",
    
    events:{
	    "touchend .carousel-item": "preventEnd",
	    "touchmove .carousel-item": "prevent",
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
					that.$el.html(that.template(playlist));
					
					//disable events and set empty (blurred)image on playlists container
					if(!playlist.length){
						that.undelegateEvents();
					}
			  }
		  })

      return this;
    },
    active: false,
    prevent: function(e){
	    this.active = true;
	    e.stopImmediatePropagation();
    },
    preventEnd: function(e){
	    if(this.active){
		    this.active = false;
		    e.stopImmediatePropagation();
	    }
    }
 });

  return CarouselView;

});