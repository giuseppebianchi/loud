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
	    	this.parent = options.parent;
	    	this.parentview = options.view;
	    	this.template = Utils.templates.artists;
	    	this.templateSquare = Utils.templates.square;
		    
    },
    
    tagName: "div",
    
    className: "library-list-square",
    
    parent: undefined,

    render: function() {
		var that = this;
		  this.collection.fetch({
			  success: function(data, more){
				  //console.log(data)
				  	//set received data into template
					if(that.parentview == "tracks"){
						that.$el.html(that.templateSquare(data));
						that.parent.playerCollection = that.parent.filterCollection(more);
					}else{
						if(that.parentview == "albums"){
							that.$el.html(that.templateSquare(data));
						}else{
							that.$el.html(that.template(data));
						}
					}
						that.bLazy = new Blazy({ 
							container: "#user-scrolling-view-library"
						});
			  }
		  })

      return this;
    }
 });

  return BulletsView;

});