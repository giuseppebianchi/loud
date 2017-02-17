define(function(require) {
  var $ = require("jquery");
  var Backbone = require("backbone");
  var Utils = require("utils");
  var TracklistView = require("views/elements/bulletPlaylist");
  var PlaylistView = Utils.Page.extend({

    constructorName: "PlaylistView",
    events:{
    	"touchstart": "startTouch",
	    "touchmove": "elastic",
	    "touchend": "resetHeight",
      "tap .back-button": "back",
      "tap .playlistOption": "showOption",
      
      //to remove and put it in tracklist view
      "tap .soundcloudArtist": "showUser",
      "tap .play-track": "playTrack",
      "tap .play-all-tracks": "playAllTracks",
      "tap .like-playlist": "setLike"
	},

	elasticImage: undefined,
	
    initialize: function(options) {
      // load the precompiled template
      this.template = Utils.templates.playlist;
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

    id: undefined,
    
    className: "Playlist full-page",
    
    parent: undefined,
    
	loadingContents: false,
	
    render: function() {
	   var that = this;
	   
	   //SET OFFLINE TEMPLATE WHILE FETCHING DATA FROM SOUNDCLOUD
	   //that.$el.html(that.template_offline({nameuser: "clicked user"}));
	   this.model.fetch({
		   success: function(data, more){
			   that.$el.html(that.template(data));
			    //set options
			    that.playerCollection = more.tracks;
			    
			    that.$el.addClass("active");
				that.parent.$el.addClass("onback");
			    
			      that.elasticImage = $(that.$el.find(".cover-user-view-background"));
			      
			      that.playlistScrollingView = $(that.$el.find(".playlist-scrolling-view").get(0));
				  that.contentList = $(that.$el.find(".playlist-content-view").get(0));
				  
			      that.playlistScrollingView.bind('scroll', function (ev) {
			            that.checkScroll(ev);
			      });
/*
				
				// CREATE LIST VIEW FOR TRACKS
				var PlaylistTrackCollection = require("collections/PlaylistTrackCollection");
			    // create a collection for the template engine
			    var playlist_tracks = new PlaylistTrackCollection({
				    id: data.attributes.id,
				    track_count: data.attributes.track_count
				}) 
*/ 
			    that.tracklist = new TracklistView({
				    collection: data
			    })
			    that.tracklist.render()
				
				that.$el.find(".tracklist").html(that.tracklist.el);
				 
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
                  && this.playlistScrollingView[0].scrollTop < 0){

    			//var altezza = this.elasticImage.height();
    			
    			//hidden content cover
    			/*
		        if(this.elasticImage.height() == 430){
		            this.elasticImage.children().addClass("hidden"); 
		        }
				*/
				
				
    			//$(this.el).css("overflow", "hidden");			
    			this.elasticImage.css("height", (330 + ((e.touches[0].pageY - this.firstTouch)/3)) + "px");

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
    this.parent.$el.removeClass("onback");
    setTimeout(function(){self.hidePage()}, 200);
  },
  hidePage: function(){ //fired from UserView
      this.parent.delegateEvents();
      if(this !== this.player.playingView){
	      this.close();
      }else{
	      this.remove()
      }
    },
  checkScroll: function(e){
      if(this.playlistScrollingView[0].scrollTop > 100){
        $(this.el.children[0]).addClass("header-visible")
      }else{
         $(this.el.children[0]).removeClass("header-visible")
      }
/*
      if(!this.loadingContents && this.playlistScrollingView.scrollTop() > (this.contentList.height() - this.playlistScrollingView.height() - 20)) {
	   this.loadingContents = true;
       this.fetchData();
      }
*/
  },
  fetchData: function(){
	    var that = this;
	    if(this.tracklist.collection.next){
			this.tracklist.collection.fetch({
		        success: function(collection, more){
			        if(that.player.playingView === that){
				        that.player.collection = that.player.collection.concat(more.collection);
				        that.player.renderSlides(more.collection);
			        }else{
				        that.playerCollection = that.playerCollection.concat(more.collection);
				    }
			        that.tracklist.$el.append(that.tracklist.template(collection));
			        that.tracklist.bLazy.revalidate();
			        that.loadingContents = false;
			    }
	        })
        }else{
	       this.$el.find(".tracks-loader").css("opacity", 0)
        }
        
  },
  
  showUser: function(e){
	  var UserView = require("views/pages/UserView");
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
      //translate
      //$(self.userView.el).addClass("active");
      //$(self.userView.el).css("transform", "translate3d(0, 0, 0)")
      

      
    },
    playTrack: function(e){
	  e.stopImmediatePropagation();
	  if(this.player.playingView !== this){
		this.player.coverPlayer.removeAllSlides();
		this.player.playingView = this;
	  	this.player.collection = this.playerCollection;
	  	this.player.renderSlides(this.playerCollection)
	  }
	  this.player.prepareTrack(e.currentTarget.attributes["sctrackid"].value, this);
    },
	playAllTracks: function(e){
	  e.stopImmediatePropagation();
	  if(this.player.playingView !== this){
		this.player.coverPlayer.removeAllSlides();
		this.player.playingView = this;
	  	this.player.collection = this.playerCollection;
	  	this.player.renderSlides(this.playerCollection)
	  }
	  this.player.prepareTrack(e.currentTarget.attributes["trackid"].value, this);
    },
    setLike: function(e){
	    var id = $(e.currentTarget).data("code");
	    var obj = {
		    created_at: 1,
		    kind: "like",
		    playlist: {id: id},
		    track: null
	    }
	    var playlists = JSON.parse(sessionStorage.getItem("likedPlaylists"))
		if($(e.currentTarget).hasClass("active-button")){
		   $.ajax({
			    type: "DELETE",
			    url: "http://api.soundcloud.com/e1/me/playlist_likes/" + id + "?oauth_token=" + localStorage.getItem("accessToken"),
			    success: function(data){
				    //console.log(data)
				    _.find(playlists, function(item, index){
					    if(item.playlist.id == id){
						    playlists.splice(index, 1);
						    return true;
						}
					})
				    $(e.currentTarget).removeClass("active-button")
				    sessionStorage.setItem("likedPlaylists", JSON.stringify(playlists))
			    },
			    error: function(err){
				    console.log(err)
			    }
		    }) 
	    }else{
		    $.ajax({
			    type: "PUT",
			    url: "http://api.soundcloud.com/e1/me/playlist_likes/" + id + "?oauth_token=" + localStorage.getItem("accessToken"),
			    success: function(data){
				    //console.log(obj)
				    playlists.push(obj);
				    $(e.currentTarget).addClass("active-button")
				    sessionStorage.setItem("likedPlaylists", JSON.stringify(playlists))
			    },
			    error: function(err){
				    console.log(err)
			    }
		    })
		    
	    }
    },
    showOption: function(e){
	  var OptionsView = require("views/elements/options");
	  e.stopImmediatePropagation();
      
      this.OptionsView = new OptionsView({
            model: this.model.attributes
      });
      this.OptionsView.parent = this;
      // render the new view
      this.OptionsView.render();
      //append in the current view
	  document.body.appendChild(this.OptionsView.el);
      this.undelegateEvents();
    }
	
		
	
	

    
  });

  return PlaylistView;

});