define(function(require) {
  var $ = require("jquery");
  var Backbone = require("backbone");
  var Utils = require("utils");
  var CarouselView = require("views/elements/carousel");
  var TracklistView = require("views/elements/tracklist");
  var UserView = require("views/pages/UserView");
  var LikesView = Utils.Page.extend({

    constructorName: "LikesView",
    events:{
    	"touchstart": "startTouch",
	    "touchmove": "elastic",
	    "touchend": "resetHeight",
      "tap .back-button": "back",
      //"tap .userOption": "showUserOption",
       //"tap .soundcloudPlaylist": "showPlaylist",
       //"tap .morePlaylists": "Playlists",
       //"tap .morePlaylists-title": "Playlists"
      "tap .soundcloudArtist": "showUser"
	},

	elasticImage: undefined,
	
    initialize: function(options) {
	  this.total_likes = options.total_likes;
      // load the precompiled template
      this.template = Utils.templates.likes;
      // here we can register to inTheDOM or removing events
      // this.listenTo(this, "inTheDOM", function() {
      //   $('#content').on("swipe", function(data){
      //     console.log(data);
      //   });
      // });
      // this.listenTo(this, "removing", functionName);

      // by convention, all the inner views of a view must be stored in this.subViews
    },

    id: "Likes",
    
    className: "User full-page",
    
    parent: undefined,
    
	loadingContents: false,
	
	total_likes: undefined,
	
    render: function() {
	   var that = this;
	   debugger;
	   //SET OFFLINE HTML TEMPLATE WHILE FETCHING DATA FROM SOUNDCLOUD
	   //that.$el.html(that.template_offline({nameuser: "clicked user"}));
	   			this.total_likes;
			   
			    that.$el.html(that.template({
				   total_likes: that.total_likes
				}));
			    //set options
			      that.elasticImage = $(that.$el.find(".cover-user-view"));
			      
			      that.userScrollingView = $(that.$el.find(".user-scrolling-view").get(0));
				  that.contentList = $(that.$el.find(".user-content-view").get(0));
				  
			      that.userScrollingView.bind('scroll', function (ev) {
			            that.checkScroll(ev);
			      });
			    
/*
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
*/				
				
				// CREATE LIST VIEW FOR TRACKS
			    // create a collection for the template engine
			    var LikesCollection = require("collections/LikesCollection")
			    var likes = new LikesCollection({}); 
			    that.tracklist = new TracklistView({
				    collection: likes
			    })
			    
			    that.tracklist.render()  
				that.$el.find(".tracklist").html(that.tracklist.el);
				
				setTimeout(function(){that.$el.addClass("active")}, 100);

       
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
                  && this.userScrollingView[0].scrollTop == 0){

    			//var altezza = this.elasticImage.height();
    			
    			//hidden content cover
    			/*
		        if(this.elasticImage.height() == 430){
		            this.elasticImage.children().addClass("hidden"); 
		        }
				*/
				
				
    			//$(this.el).css("overflow", "hidden");			
    			this.elasticImage.css("height", (200 + ((e.touches[0].pageY - this.firstTouch)/3)) + "px");
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
  back: function(e){
    e.stopImmediatePropagation();
    var self = this;
    $(this.el).removeClass("active");
    setTimeout(function(){self.hideUser()}, 200);
  },
  showUserOption: function(){
      $("#showOption").addClass("visible");
      $("#main").addClass("blurred");
      $("#main-overlay").addClass("visible");
      // $("#main").addClass("blurred");
      // this.detail.showOption.css({display: "block", opacity: 1})
  },
  checkScroll: function(e){
      if(this.userScrollingView[0].scrollTop > 100){
        $(this.el.children[0]).addClass("header-visible")
      }else{
         $(this.el.children[0]).removeClass("header-visible")
      }
      if(!this.loadingContents && this.userScrollingView.scrollTop() > (this.contentList.height() - this.userScrollingView.height() - 20)) {
	   this.loadingContents = true;
       this.fetchData();
      }
  },
  fetchData: function(){
	    var that = this;
	    if(this.tracklist.collection.next){
			this.tracklist.collection.fetch({
		        success: function(more){
			        
			        that.tracklist.$el.append(that.tracklist.template(more));
			        that.tracklist.bLazy.revalidate();
			        that.loadingContents = false;
			    }
	        })
        }else{
	       this.loadingContents = true;
	       this.$el.find(".tracks-loader").css("opacity", 0)
        }
        
  },
  hideUser: function(){ //fired from UserView
      this.parent.delegateEvents();
      this.close();
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
            model: user
      });
      this.userView.parent = this;
      // render the new view
      this.userView.render();
      //append in the current view
	  this.$el.append(this.userView.el);
      this.undelegateEvents();
      //translate
      //$(self.userView.el).addClass("active");
      //$(self.userView.el).css("transform", "translate3d(0, 0, 0)")
      

      
    },
    showPlaylist: function(e){
	  if(this.carousel.active){
		  return false;
	  }
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
      

      
    }
	
		
	
	

    
  });

  return LikesView;

});