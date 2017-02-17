define(function(require) {
  var $ = require("jquery");
  var Backbone = require("backbone");
  var Utils = require("utils");
  var Handlebars = require("handlebars");
  var CarouselView = require("views/elements/carousel");
  var LibraryTrackView = require("views/elements/square");
  var LibraryTrackCollection = require("collections/LibraryTrackCollection")
  var LibraryArtistCollection = require("collections/LibraryArtistCollection")
  var LibraryAlbumCollection = require("collections/LibraryAlbumCollection")
  //var LibraryTrackViewCircle = require("views/elements/bullet");
  var LibraryView = Utils.Page.extend({

    constructorName: "LibraryView",
    
    events:{
	    "touchstart": "startTouch",
	    "touchmove": "elastic",
	    "touchend": "resetHeight",
       "tap #library-select": "changeLibrary",
       "tap .library-artist": "showArtistLibrary",
       "tap .play-track": "playTrack",
      "tap .play-all-tracks": "playAllTracks",
      //"tap prolungato .loud-artist": "actionsheet cancella o modifica artista"
      //"tap prolungato .loud-track": "actionsheet cancella o modifica traccia"
      //"tap prolungato .loud-album": "actionsheet cancella o modifica album"
	},

	elasticImage: undefined,
	
    initialize: function() {
      // load the precompiled template
      this.template = Utils.templates.library;
      // here we can register to inTheDOM or removing events
      // this.listenTo(this, "inTheDOM", function() {
      //   $('#content').on("swipe", function(data){
      //     console.log(data);
      //   });
      // });
      // this.listenTo(this, "removing", functionName);
	  Handlebars.registerHelper('getData', function(v1, v2) {
		  if(v2 == "length"){
			  return v1.length;
		  }
		  return v1[v2]

      });
      // by convention, all the inner views of a view must be stored in this.subViews
    },

    id: "Library",
    
    className: "full-page",
    
    parent: undefined,
    
	loadingContents: false,
	
    render: function() {
	   var that = this;
	   
	   that.$el.html(that.template(this.model));
	    //set options
	      that.elasticImage = $(that.$el.find(".cover-user-view-background"));
	      
	      that.userScrollingView = $(that.$el.find(".user-scrolling-view").get(0));
		  that.contentList = $(that.$el.find(".user-content-view").get(0));
		  
	      that.userScrollingView.bind('scroll', function (ev) {
	            that.checkScroll(ev);
	      });
	    
	    
	    var LibraryCollection;
	    switch(this.model.view){
		    case "tracks": LibraryCollection = LibraryTrackCollection; break;
		    case "artists": LibraryCollection = LibraryArtistCollection; break;
		    case "albums": LibraryCollection = LibraryAlbumCollection; break;
	    }
	    var data = new LibraryCollection({}) 
	    // CREATE CAROUSEL VIEW FOR RECENT ADDED TRACKS
	    // create a collection for the template engine 
/*
	    that.carousel = new CarouselView({
		    collection: data
	    })
	    
	    that.carousel.render();
		that.$el.find(".UserCarousel").html(that.carousel.el);
*/
		
		
		// CREATE LIST VIEW FOR FOLLOWING
	    // create a collection for the template engine
	    that.tracklist = new LibraryTrackView({
		    collection: data,
		    parent: that,
		    view: this.model.view
	    })
	    that.tracklist.render()  
		that.$el.find(".bullet-section").html(that.tracklist.el);
		that.$el.addClass("visible");
       
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
  checkScroll: function(e){
      if(this.userScrollingView[0].scrollTop > 70){
        $(this.el.children[0]).addClass("header-visible");
        //$(this.el.children[1]).addClass("header-visible");
      }else{
         $(this.el.children[0]).removeClass("header-visible")
         //$(this.el.children[1]).removeClass("header-visible")
      }
  },
   filterCollection: function(collection){
	    /*prepare collection for player*/
		var list = [];
		var track;
		collection.forEach(function(obj){
			track = obj.doc.content;
			track.loud_title = obj.doc.title;
			track.loud_artist = obj.doc.artist;
			track.loud_album = obj.doc.albumTitle;
			list.push(track)
		})
		return list;
    },
     update: function(view){
	    // view = "artists"
	    var category = $("#title-library-cat");
	 	var LibraryCollection;
	    switch(view){
		    case "tracks": LibraryCollection = LibraryTrackCollection; break;
		    case "artists": LibraryCollection = LibraryArtistCollection; break;
		    case "albums": LibraryCollection = LibraryAlbumCollection; break;
	    }
	    var data = new LibraryCollection({}) 
	    // CREATE CAROUSEL VIEW FOR RECENT ADDED TRACKS
	    // create a collection for the template engine 
/*
	    that.carousel = new CarouselView({
		    collection: data
	    })
	    
	    that.carousel.render();
		that.$el.find(".UserCarousel").html(that.carousel.el);
*/
		
		// CREATE LIST VIEW FOR FOLLOWING
	    // create a collection for the template engine
	    this.tracklist.collection = data;
		this.tracklist.parentview = view;
		
	    this.tracklist.render()  
		this.$el.find(".bullet-section").html(this.tracklist.el);
		category.animate({
            opacity: 0
            }, 500, function(){
            category.text(view)
            if(view == "tracks"){
	            $(".library-button").removeClass("hidden")
            }else{
	           $(".library-button").addClass("hidden") 
            }
            category.css("opacity", 1)
        })
		
    },
    showArtistLibrary: function(e){
	 //   debugger;
	  e.stopImmediatePropagation();
      var LibraryArtistView = require("views/pages/LibraryArtistView");
      var self = this; 
       var LibraryArtistAlbumsCollection = require("collections/LibraryArtistAlbumsCollection");
       var artist_albums = new LibraryArtistAlbumsCollection({
	     id: $(e.currentTarget).attr("username")
       })
      this.LibraryArtistView = new LibraryArtistView({
	      collection: artist_albums,
          player: self.player
      });
      this.LibraryArtistView.parent = this;
      // render the new view
      this.LibraryArtistView.render();
      //append in the current view
	  this.$el.append(this.LibraryArtistView.el);
      this.undelegateEvents();
      //translate
      //$(self.userView.el).addClass("active");
      //$(self.userView.el).css("transform", "translate3d(0, 0, 0)")
    },
    
    callbackActionSheet: function(buttonIndex) {
	    var view = window.plugins.actionsheet.temp;
	    var current = localStorage.getItem("selectLibrary");
	    var temp;
	    switch(buttonIndex){
		    case 1: temp = "tracks"; break;
		    case 2: temp = "artists"; break;
		    case 3: temp = "albums"; break;
	    }
	    if(temp != current){
		    view.update(temp);
		    localStorage.setItem("selectLibrary", temp)
	    }
	    window.plugins.actionsheet.temp = null;
	},
	optionsActionSheet: {
        //'title': '',
        'buttonLabels': ['Tracks', 'Artists', 'Albums'],
        'addCancelButtonWithLabel': 'Cancel',
        //'addDestructiveButtonWithLabel' : 'Delete it',
    },
    changeLibrary: function(){
	    window.plugins.actionsheet.temp = this;
	    window.plugins.actionsheet.show(this.optionsActionSheet, this.callbackActionSheet);
    },
	playTrack: function(e){
	console.log(this)
	  e.stopImmediatePropagation();
	  if(this.player.playingView !== this){
		this.player.coverPlayer.removeAllSlides();
		this.player.playingView = this;
	  	this.player.collection = this.playerCollection;
	  	this.player.renderSlides(this.playerCollection)
	  }
	  this.player.prepareTrack(e.currentTarget.attributes["sctrackid"].value, this);
    },
	
		
	
	

    
  });

  return LibraryView;

});