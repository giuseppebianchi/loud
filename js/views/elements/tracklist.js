define(function(require) {
  var $ = require("jquery");
  var Backbone = require("backbone");
  var Utils = require("utils");
  var Blazy = require("blazy");
  
  var TracklistView = Utils.Page.extend({

    constructorName: "TracklistView",
    
    events:{
	   
	},
	
    initialize: function(options) {
      // load the precompiled template
      this.template = Utils.templates.tracklist;
      this.parent = options.parent;
    },
    
    tagName: "ul",
    
    className: "list",
    
    parent: undefined,
    
    viewId: undefined,
    
    render: function() {
		var that = this;
		  this.collection.fetch({
			  success: function(tracks, more){
				  	that.parent.playerCollection = more.collection;
				  	//set received data into template
					that.$el.html(that.template(tracks));
					that.bLazy = new Blazy({ 
						container: "#user-scrolling-view-" + tracks.user_id
					});
			  }
		  })

      return this;
    },
    playTrack: function(e){
	  e.stopImmediatePropagation();
	  if(this.player.playingView !== this){
		this.player.coverPlayer.removeAllSlides();
		this.player.playingView = this;
	  	this.player.collection = this.playerCollection;
	  	this.player.renderSlides(this.playerCollection)
	  }
	  this.player.prepareTrack(e.currentTarget.attributes["sctrackid"].value); /* 1 means that is the stream view */
    }
 });

  return TracklistView;

});