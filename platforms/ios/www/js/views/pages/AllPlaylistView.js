define(function(require) {
  var $ = require("jquery");
  var Backbone = require("backbone");
  var Handlebars = require("handlebars");
  var Blazy = require("blazy");
  var Utils = require("utils");

  var AllPlaylistView = Utils.Page.extend({

    constructorName: "AllPlaylistView",
    
    events:{	
      "tap .back-button": "back",
       "tap .playlist-type": "showPlaylist",
//        "tap .soundcloudArtist": "showUser"
    },
    
	userView: undefined,
	
    initialize: function(options) {
      // load the precompiled template
      this.template = Utils.templates.allPlaylist;
      this.templateMore = Utils.templates.morePlaylist;
      
      this.player = options.player;
      
      // here we can register to inTheDOM or removing events
      // this.listenTo(this, "inTheDOM", function() {
      //   $('#content').on("swipe", function(data){
      //     console.log(data);
      //   });
      // });
      // this.listenTo(this, "removing", functionName);

      // by convention, all the inner views of a view must be stored in this.subViews
    },

        
    className: "User full-page",

    activities: null,
    
    scrollingView: null,

    contentList: null,
	
	loadingContents: false,
	
    render: function() {
		var that = this;
		  this.collection.fetch({
			  success: function(playlists){
				  	//set received data into template
					that.$el.html(that.template(playlists));
					
					that.scrollingView = $(that.$el.find(".scrolling-view").get(0));
					
					that.contentList = $(that.$el.find(".list").get(0));
					
					that.$el.addClass("active");
					that.parent.$el.addClass("onback");
					
					that.scrollingView.bind('scroll', function (ev) {
			            that.checkScroll(ev);
			      	});
					
					//initialize lazy loading library
					that.bLazy = new Blazy({ 
						container: '#allPlaylist-scrolling-view-' + playlists.user_id
					});
					
			  }
		  })

      

      return this;
    },
    checkScroll: function(e){
      if(!this.loadingContents && this.scrollingView.scrollTop() > (this.contentList.height() - this.scrollingView.height() - 20)) {
	   this.loadingContents = true;
       this.fetchData();
      }
	},
	fetchData: function(){
		var that = this;
		if(this.collection.next){
			this.collection.fetch({
			    success: function(more){
			        that.$el.append(that.templateMore(more));
			        that.bLazy.revalidate();
			        that.loadingContents = false;
			    }
			})
		}else{
			this.loadingContents = true;
			this.$el.find(".cssloader").css("opacity", 0)
		}
	
	},
    back: function(e){
	    e.stopImmediatePropagation();
	    var self = this;
	    $(this.el).removeClass("active");
	    this.parent.$el.removeClass("onback")
	    setTimeout(function(){self.hideUser()}, 200);
  	},
  	hideUser: function(){ //fired from UserView
      this.parent.delegateEvents();
      this.close();
    },
    showPlaylist: function(e){
	  e.stopImmediatePropagation();
      var PlaylistModel = require("models/PlaylistModel");
      var PlaylistView = require("views/pages/PlaylistView");
      var self = this;
      var playlistId = e.currentTarget.attributes["playlistid"].value;
      var playlistImage = e.currentTarget.attributes["artwork_playlist"].value;
      var playlist = new PlaylistModel({
	      id_playlist: playlistId,
	      image: playlistImage
      });
      
      this.PlaylistView = new PlaylistView({
            model: playlist,
            player: self.player
      });
      this.PlaylistView.parent = this;
      // render the new view
      this.PlaylistView.render();
      //append in the current view
	  this.$el.append(this.PlaylistView.el);
      this.undelegateEvents();
      //translate
      //$(self.userView.el).addClass("active");
      //$(self.userView.el).css("transform", "translate3d(0, 0, 0)")
      

      
    },
    
    
	

  });

  return AllPlaylistView;

});