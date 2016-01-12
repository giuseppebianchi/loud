define(function(require) {
  var $ = require("jquery");
  var Backbone = require("backbone");
  var Utils = require("utils");
  var Blazy = require("blazy");
  var BulletsView = Utils.Page.extend({

    constructorName: "BulletsView",
    
    events:{
	    
	},
	
    initialize: function(options) {
	    // load the precompiled template
		    this.template = Utils.templates.square;
    },
    
    tagName: "div",
    
    className: "library-list-square",
    
    parent: undefined,

    render: function() {
		var that = this;
		  this.collection.fetch({
			  success: function(tracks){
				  	//set received data into template
					that.$el.html(that.template(tracks));
					//disable events and set empty (blurred)image on playlists container
					if(!tracks.length){
						that.undelegateEvents();
					}else{
						that.bLazy = new Blazy({ 
							container: "#user-scrolling-view-library"
						});
					}
			  }
		  })

      return this;
    }
 });

  return BulletsView;

});