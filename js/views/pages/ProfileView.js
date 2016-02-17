define(function(require) {
  var $ = require("jquery");
  var Backbone = require("backbone");
  var Utils = require("utils");
  var CarouselView = require("views/elements/carousel");
  var TracklistView = require("views/elements/tracklist");
  var FollowingView = require("views/elements/bullet");
  var UserView = require("views/pages/UserView");
  var ProfileView = Utils.Page.extend({

    constructorName: "ProfileView",
    events:{
    	"touchstart": "startTouch",
	    "touchmove": "elastic",
	    "touchend": "resetHeight",
       "tap .soundcloudPlaylist": "showPlaylist",
       "tap .morePlaylists": "Playlists",
       "tap .morePlaylists-title": "Playlists",
       "tap .following-item": "showUser",
       "tap #like-button": "showLikes",
       "tap .following-button": "showFollowing",
       "tap #settings-button": "showSetting"
      //"tap .soundcloudArtist": "showUser"
	},

	elasticImage: undefined,
	
    initialize: function() {
      // load the precompiled template
      this.template = Utils.templates.profile;
      // here we can register to inTheDOM or removing events
      // this.listenTo(this, "inTheDOM", function() {
      //   $('#content').on("swipe", function(data){
      //     console.log(data);
      //   });
      // });
      // this.listenTo(this, "removing", functionName);

      // by convention, all the inner views of a view must be stored in this.subViews
    },

    id: "Profile",
    
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
				
				
				// CREATE LIST VIEW FOR TRACKS
				var UserTrackCollection = require("collections/UserTrackCollection");
			    // create a collection for the template engine
			    var user_tracks = new UserTrackCollection({
				    id: data.attributes.id,
				    track_count: data.attributes.track_count,
				    limit: 3
				})  
			    that.tracklist = new TracklistView({
				    collection: user_tracks,
				    parent: that
			    })
			    that.tracklist.render()  
				that.$el.find(".tracklist").html(that.tracklist.el);
				
				
				// CREATE LIST VIEW FOR FOLLOWING
				var FollowingCollection = require("collections/FollowingCollection");
			    // create a collection for the template engine
			    var user_following = new FollowingCollection({
				    total: that.model.attributes.followings_count
			    });
			    that.following = new FollowingView({
				    collection: user_following,
				    profile: true,
				    id: data.attributes.id,
			    })
			    that.following.render()  
				that.$el.find(".bullet-section").html(that.following.el);
				
				that.$el.addClass("visible");
				 
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
                  && this.userScrollingView[0].scrollTop <= 0){

    			//var altezza = this.elasticImage.height();
    			
    			//hidden content cover
    			/*
		        if(this.elasticImage.height() == 430){
		            this.elasticImage.children().addClass("hidden"); 
		        }
				*/
				
				
    			//$(this.el).css("overflow", "hidden");			
    			this.elasticImage.css("height", (430 + ((e.touches[0].pageY - this.firstTouch)/3)) + "px");
    			e.preventDefault();

    	}else{
    			//$(this.el).css("overflow", "");
      }
	},
	resetHeight: function(e){
	//reset content
    //this.elasticImage.children().removeClass("hidden"); 
		this.elasticImage.css({transition: "height 0.2s ease-out", height: ""});
	},
  checkScroll: function(e){
      if(this.userScrollingView[0].scrollTop > 100){
        $(this.el.children[0]).addClass("header-visible")
      }else{
         $(this.el.children[0]).removeClass("header-visible")
      }
  },
  showUser: function(e){
	  e.stopImmediatePropagation();
      var UserModel = require("models/UserModel");
      var self = this;
      var userId = e.currentTarget.attributes["scuserid"].value;
      var user = new UserModel({
	      id_user: userId
      });
      
      this.userView = new UserView({
            model: user,
            player: self.player
      });
      this.userView.parent = this;
      // render the new view
      this.userView.render();
      //append in the current view
	  this.$el.append(this.userView.el);
      this.undelegateEvents();
      

      
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
            collection: user_playlists,
            player: self.player
      });
      this.AllPlaylistView.parent = this;
      // render the new view
      this.AllPlaylistView.render();
      //append in the current view
	  this.$el.append(this.AllPlaylistView.el);
      this.undelegateEvents();
    },
    showLikes: function(e){
	  e.stopImmediatePropagation();
	  var sort = localStorage.getItem("sortLikes");
	  var LikesView;
	  if(sort == 0){
		LikesView = require("views/pages/LikesView");  
	  }else{
		LikesView = require("views/pages/SortedLikesView");
	  }
      var self = this; 
         
      this.LikesView = new LikesView({
	      total_likes: self.model.attributes.public_favorites_count,
	      player: self.player
      })
      this.LikesView.parent = this;
      // render the new view
      this.LikesView.render();
      //append in the current view
	  this.$el.append(this.LikesView.el);
      this.undelegateEvents();

    },
    showFollowing: function(e){
	  e.stopImmediatePropagation();
      var FollowingView = require("views/pages/FollowingView");
      var self = this; 
         
      this.FollowingView = new FollowingView({
	      total: self.model.attributes.followings_count,
	      player: self.player
      })
      this.FollowingView.parent = this;
      // render the new view
      this.FollowingView.render();
      //append in the current view
	  this.$el.append(this.FollowingView.el);
      this.undelegateEvents();
    },
    showSetting: function(e){
	  e.stopImmediatePropagation();
      var SettingView = require("views/pages/SettingView");
      var self = this; 
         
      this.SettingView = new SettingView()
      this.SettingView.parent = this;
      // render the new view
      this.SettingView.render();
      //append in the current view
	  this.$el.append(this.SettingView.el);
      this.undelegateEvents();
    },
  
	
		
	
	

    
  });

  return ProfileView;

});