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
		this.template = Utils.templates.bulletTracks;
    },
    
    tagName: "ul",
    
    className: "list",
    
    parent: undefined,

    render: function() {
		var that = this;
		that.$el.html(that.template(that.collection));
		setTimeout(function(){
			that.bLazy = new Blazy({ 
						container: "#playlist-scrolling-view-" + that.collection.id_playlist
			});
		}, 100)

      return this;
    },
 });

  return BulletsView;

});