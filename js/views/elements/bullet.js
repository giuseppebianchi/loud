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
		if(options.profile){
			this.profile = options.id;
	      	this.template = Utils.templates.following_profile;
	    }else{
		    this.profile = "following"
		    this.template = Utils.templates.following;
	    }
    },
    
    tagName: "div",
    
    className: "following",
    
    parent: undefined,

    render: function() {
		var that = this;
		  this.collection.fetch({
			  success: function(following){
				  	//set received data into template
					that.$el.html(that.template(following));
					//disable events and set empty (blurred)image on playlists container
					if(!following.length){
						that.undelegateEvents();
					}else{
						that.bLazy = new Blazy({ 
							container: "#user-scrolling-view-" + that.profile
						});
					}
			  }
		  })

      return this;
    }
 });

  return BulletsView;

});