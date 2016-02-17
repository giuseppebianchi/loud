define(function(require) {
  var $ = require("jquery");
  var Backbone = require("backbone");
  var Handlebars = require("handlebars");
  var Blazy = require("blazy");
  var Utils = require("utils");
  var _ = require("underscore")
  
  var UserView = require("views/pages/UserView");

  var StreamView = Utils.Page.extend({

    constructorName: "StreamView",
    
    events:{
	    "touchstart": "startTouch",
	    "touchmove": "elastic",
	    "touchend": "resetHeight",
	  "tap .soundcloudArtist": "showUser",
      "tap .play-track": "playTrack",
      "tap .playlist-type": "showPlaylist"
    },
    
	userView: undefined,
	
    initialize: function() {
      // load the precompiled template
      this.template = Utils.templates.stream;
      this.templateList = Utils.templates.streamlist;
      
      // here we can register to inTheDOM or removing events
      // this.listenTo(this, "inTheDOM", function() {
      //   $('#content').on("swipe", function(data){
      //     console.log(data);
      //   });
      // });
      // this.listenTo(this, "removing", functionName);

      // by convention, all the inner views of a view must be stored in this.subViews
    },

    id: "Stream",
    
    className: "full-page",

    activities: null,
    
    scrollingView: null,

    contentList: null,
	
	loadingContents: false,
	
    render: function() {
		var that = this;
		  this.collection.fetch({
			  success: function(activities, more){
				  	//set received data into template
					that.$el.html(that.template(activities.models));
					
					that.elasticImage = $(that.$el.find(".cover-user-view-background"));

					that.playerCollection = that.filterCollection(more.collection);
					
					//set element that gets scroll event - to reload new data
					that.scrollingView = $("#stream-scrolling-view");
					that.contentList = that.scrollingView.children(".content-scrolling-view");
						  
					//set event listener to scroll
					that.scrollingView.bind('scroll', function (ev) {
						that.checkScroll(ev);
					});
					//initialize lazy loading library
					that.bLazy = new Blazy({ 
						container: '#stream-scrolling-view'
					});
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
                  && this.scrollingView[0].scrollTop <= 0){

    			//var altezza = this.elasticImage.height();
    			
    			//hidden content cover
    			/*
		        if(this.elasticImage.height() == 430){
		            this.elasticImage.children().addClass("hidden"); 
		        }
				*/
				
				
    			//$(this.el).css("overflow", "hidden");			
    			this.elasticImage.css("height", (160 + ((e.touches[0].pageY - this.firstTouch)/3)) + "px");
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
    checkScroll: function(){
	    if(this.scrollingView[0].scrollTop > 70){
        	$(this.el.children[0]).addClass("header-visible");
		}else{
			$(this.el.children[0]).removeClass("header-visible")
		}
      if(!this.loadingContents && this.scrollingView.scrollTop() > (this.contentList.height() - this.scrollingView.height())) {
	   this.loadingContents = true;
       this.fetchData();
      }
    },
    fetchData: function(){
	    var that = this;
	    if(this.collection.next){
			this.collection.fetch({
		        success: function(all, more){
			        var temp = that.filterCollection(more.collection)
			        if(that.player.playingView === that){
				        that.player.collection = that.player.collection.concat(temp);
				        that.player.renderSlides(temp);
			        }else{
				        that.playerCollection = that.playerCollection.concat(temp);
				    }
				    
			        that.contentList.children(".list-back").children(".list").append(that.templateList(more.collection));
			        that.bLazy.revalidate();
			        that.loadingContents = false;
			    }
	        })
	    }else{
		    this.loadingContents = true;
			this.$el.find(".cssload-loader").css("opacity", 0)
	    }
        
    },
    filterCollection: function(collection){
	    /*prepare collection for player removing playlists*/
		var list = [];
			_.find(collection, function(t, i){ 
			  if(t.type != "playlist" && t.type != "playlist-repost"){
				  list.push(t.origin)
			  }
			});
		return list;
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
      //translate
      //$(self.userView.el).addClass("active");
      //$(self.userView.el).css("transform", "translate3d(0, 0, 0)")
      

      
    },
    showPlaylist: function(e){
	  e.stopImmediatePropagation();
      var PlaylistModel = require("models/PlaylistModel");
      var PlaylistView = require("views/pages/PlaylistView");
      var self = this;
      var playlistId = e.currentTarget.attributes["playlistid"].value;
      var playlist = new PlaylistModel({
	      id_playlist: playlistId
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

  return StreamView;

});