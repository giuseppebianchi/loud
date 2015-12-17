define(function(require) {
  var $ = require("jquery");
  var Backbone = require("backbone");
  var Utils = require("utils");
  var Blazy = require("blazy");
  
  var TracklistView = Utils.Page.extend({

    constructorName: "TracklistView",
    
    events:{
	   
	},
	
    initialize: function() {
      // load the precompiled template
      this.template = Utils.templates.tracklist;
    },
    
    tagName: "ul",
    
    className: "list",
    
    parent: undefined,
    
    viewId: undefined,
    
    render: function() {
		var that = this;
		
		  this.collection.fetch({
			  success: function(tracks){
				  	
				  	//set received data into template
					that.$el.html(that.template(tracks));
					that.bLazy = new Blazy({ 
						container: "#user-scrolling-view-" + tracks.user_id
					});
			  }
		  })

      return this;
    },
 });

  return TracklistView;

});