define(function(require) {
  var $ = require("jquery");
  var Backbone = require("backbone");
  var Utils = require("utils");
  var Blazy = require("blazy");
  var UserView = require("views/pages/UserView");
  var LikesView = Utils.Page.extend({

    constructorName: "LikesView",
    events:{
    	"touchstart": "startTouch",
	    "touchmove": "elastic",
	    "touchend": "resetHeight",
      "tap .back-button": "back",
      "tap .play-track": "playTrack",
      "tap .play-all-tracks": "playAllTracks"
	},

	elasticImage: undefined,
	
    initialize: function(options) {
	  this.total_likes = options.total_likes;
      // load the precompiled template
      this.template = Utils.templates.libraryArtist;
      
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
    
    parent: undefined,
    
	loadingContents: false,
	
	playerCollection: [],
	
	total_likes: undefined,
	
    render: function() {
	   var that = this;
	   //SET OFFLINE HTML TEMPLATE WHILE FETCHING DATA FROM SOUNDCLOUD
	   //that.$el.html(that.template_offline({nameuser: "clicked user"}));
			 this.collection.fetch({
			  success: function(data, more){
				  	//set received data into template
					that.$el.html(that.template(data));
				    //set options
				      that.elasticImage = $(that.$el.find(".cover-user-view-background"));
				      
				      that.playerCollection = that.filterCollection(more);
				      
				      that.userScrollingView = $(that.$el.find(".user-scrolling-view").get(0));
					  that.contentList = $(that.$el.find(".user-content-view").get(0));
					  
				      that.userScrollingView.bind('scroll', function (ev) {
				            that.checkScroll(ev);
				      });
					that.bLazy = new Blazy({ 
						container: "#user-scrolling-view-likes"
					});
					that.$el.addClass("active"); 
					that.parent.$el.addClass("onback")
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
    this.parent.$el.removeClass("onback");
    setTimeout(function(){self.hidePage()}, 200);
  },
  
  checkScroll: function(e){
      if(this.userScrollingView[0].scrollTop > 100){
        $(this.el.children[0]).addClass("header-visible")
      }else{
         $(this.el.children[0]).removeClass("header-visible")
      }
      
  },
  filterCollection: function(collection){
	    /*prepare collection for player*/
		var list = [];
		collection.forEach(function(obj){
			obj.value.forEach(function(track){
				list.push(track)
			})
		})
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
	  this.player.prepareTrack(e.currentTarget.attributes["sctrackid"].value, this); /* 1 means that is the stream view */
    },
  playAllTracks: function(e){
	  e.stopImmediatePropagation();
	  if(this.player.playingView !== this){
		this.player.coverPlayer.removeAllSlides();
		this.player.playingView = this;
	  	this.player.collection = this.playerCollection;
	  	this.player.renderSlides(this.playerCollection)
	  }
	  this.player.prepareTrack(this.tracklist.collection.models[0].attributes.id, this);
    },
  hidePage: function(){ //fired from UserView
      this.parent.delegateEvents();
      if(this !== this.player.playingView){
	      this.close();
      }else{
	      this.remove()
      }
    },
  	
		
	
	

    
  });

  return LikesView;

});