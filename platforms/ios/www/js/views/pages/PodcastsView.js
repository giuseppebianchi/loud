define(function(require) {
  var $ = require("jquery");
  var Backbone = require("backbone");
  var Utils = require("utils");
  var CarouselView = require("views/elements/carousel");
  var LibraryTrackView = require("views/elements/square");
	
  var LibraryView = Utils.Page.extend({

    constructorName: "LibraryView",
    
    events:{
	    "touchstart": "startTouch",
	    "touchmove": "elastic",
	    "touchend": "resetHeight",
      "tap .userOption": "showUserOption",
       "tap .soundcloudPlaylist": "showPlaylist",
       "tap .morePlaylists": "Playlists",
       "tap .morePlaylists-title": "Playlists",
       "tap .following-item": "showUser",
       "tap #like-button": "showLikes",
       "tap .following-button": "showFollowing",
       "tap #library-select": "changeLibrary"
      //"tap prolungato .loud-artist": "actionsheet cancella o modifica artista"
      //"tap prolungato .loud-track": "actionsheet cancella o modifica traccia"
      //"tap prolungato .loud-album": "actionsheet cancella o modifica album"
	},

	elasticImage: undefined,
	
    initialize: function() {
      // load the precompiled template
      this.template = Utils.templates.podcasts;
      // here we can register to inTheDOM or removing events
      // this.listenTo(this, "inTheDOM", function() {
      //   $('#content').on("swipe", function(data){
      //     console.log(data);
      //   });
      // });
      // this.listenTo(this, "removing", functionName);

      // by convention, all the inner views of a view must be stored in this.subViews
    },

    id: "Library",
    
    className: "full-page",
    
    parent: undefined,
    
	loadingContents: false,
	
    render: function() {
	   var that = this;
	   
	   //SET OFFLINE HTML TEMPLATE WHILE FETCHING DATA FROM SOUNDCLOUD
	   //that.$el.html(that.template_offline({nameuser: "clicked user"}));
	   this.model.fetch({
		   success: function(data){
			   
			   that.$el.html(that.template(data.attributes));
			    //set options
			      that.elasticImage = $(that.$el.find(".cover-user-view-background"));
			      
			      that.userScrollingView = $(that.$el.find(".user-scrolling-view").get(0));
				  that.contentList = $(that.$el.find(".user-content-view").get(0));
				  
			      that.userScrollingView.bind('scroll', function (ev) {
			            that.checkScroll(ev);
			      });
			    
			    // CREATE CAROUSEL VIEW FOR PLAYLIST
			    var UserPlaylistCollection = require("collections/UserPlaylistCollection");
			    // create a collection for the template engine
			    var user_playlists = new UserPlaylistCollection({
				    id: data.attributes.id,
				    total: data.attributes.playlist_count
				})  
			    that.carousel = new CarouselView({
				    collection: user_playlists
			    })
			    
			    that.carousel.render();
				that.$el.find(".UserCarousel").html(that.carousel.el);
				
				
				// CREATE LIST VIEW FOR FOLLOWING
				var LibraryTrackCollection = require("collections/FollowingCollection");
			    // create a collection for the template engine
			    var user_following = new LibraryTrackCollection({
				    total: that.model.attributes.followings_count
			    });  
			    that.following = new LibraryTrackView({
				    collection: user_following
			    })
			    that.following.render()  
				that.$el.find(".bullet-section").html(that.following.el);
				
				that.$el.addClass("active");
				 
		   }
	   })
       
      return this;
    },
    enabledElastic: true,
    
    startTouch: function(e){
        this.elasticImage.css("transition", "");
        this.firstTouch = e.touches[0].pageY;
     },
    
	  elastic: function(e){
  		if(this.enabledElastic && 
              ((e.touches[0].pageY - this.firstTouch) > 0) 
                  && this.userScrollingView[0].scrollTop < 0){

    			//var altezza = this.elasticImage.height();
    			
    			//hidden content cover
    			/*
		        if(this.elasticImage.height() == 430){
		            this.elasticImage.children().addClass("hidden"); 
		        }
				*/
				
				
    			//$(this.el).css("overflow", "hidden");			
    			this.elasticImage.css("height", (160 + ((e.touches[0].pageY - this.firstTouch)/3)) + "px");

    	}else{
    			//$(this.el).css("overflow", "");
      }
	},
	resetHeight: function(e){
	//reset content
    //this.elasticImage.children().removeClass("hidden"); 
		this.elasticImage.css({transition: "height 0.2s ease-out", height: ""});
	},
  showUserOption: function(){
      $("#showOption").addClass("visible");
      $("#main").addClass("blurred");
      $("#main-overlay").addClass("visible");
      // $("#main").addClass("blurred");
      // this.detail.showOption.css({display: "block", opacity: 1})
  },
  checkScroll: function(e){
      if(this.userScrollingView[0].scrollTop > 70){
        $(this.el.children[0]).addClass("header-visible");
        //$(this.el.children[1]).addClass("header-visible");
      }else{
         $(this.el.children[0]).removeClass("header-visible")
         //$(this.el.children[1]).removeClass("header-visible")
      }
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
            model: playlist
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
    Playlists: function(e){
	  e.stopImmediatePropagation();
	  
      var AllPlaylistView = require("views/pages/AllPlaylistView");
      var self = this;

      var UserPlaylistCollection = require("collections/UserPlaylistCollection");
		    // create a collection for the template engine
	  var user_playlists = new UserPlaylistCollection({
		id: self.model.id,
		total: self.model.attributes.playlist_count,
		name: self.model.attributes.username,
		all: true
	  })  
      
      this.AllPlaylistView = new AllPlaylistView({
            collection: user_playlists
      });
      this.AllPlaylistView.parent = this;
      // render the new view
      this.AllPlaylistView.render();
      //append in the current view
	  this.$el.append(this.AllPlaylistView.el);
      this.undelegateEvents();
      //translate
      //$(self.userView.el).addClass("active");
      //$(self.userView.el).css("transform", "translate3d(0, 0, 0)")
    },
    showLikes: function(e){
	  e.stopImmediatePropagation();
      var LikesView = require("views/pages/LikesView");
      var self = this; 
         
      this.LikesView = new LikesView({
	      total_likes: self.model.attributes.public_favorites_count
      })
      this.LikesView.parent = this;
      // render the new view
      this.LikesView.render();
      //append in the current view
	  this.$el.append(this.LikesView.el);
      this.undelegateEvents();
      //translate
      //$(self.userView.el).addClass("active");
      //$(self.userView.el).css("transform", "translate3d(0, 0, 0)")
    },
    showFollowing: function(e){
	  e.stopImmediatePropagation();
      var FollowingView = require("views/pages/FollowingView");
      var self = this; 
         
      this.FollowingView = new FollowingView({
	      total: self.model.attributes.followings_count
      })
      this.FollowingView.parent = this;
      // render the new view
      this.FollowingView.render();
      //append in the current view
	  this.$el.append(this.FollowingView.el);
      this.undelegateEvents();
      //translate
      //$(self.userView.el).addClass("active");
      //$(self.userView.el).css("transform", "translate3d(0, 0, 0)")
    },
    callbackActionSheet: function(buttonIndex) {
	    console.log(buttonIndex)
	},
	optionsActionSheet: {
        //'title': '',
        'buttonLabels': ['Tracks', 'Artists', 'Albums', 'Labels'],
        'addCancelButtonWithLabel': 'Cancel',
        //'addDestructiveButtonWithLabel' : 'Delete it',
    },
    changeLibrary: function(){
		window.plugins.actionsheet.show(this.optionsActionSheet, this.callbackActionSheet);
    },
  
	
		
	
	

    
  });

  return LibraryView;

});