define(function(require) {
  var $ = require("jquery");
  var Backbone = require("backbone");
  var Utils = require("utils");
  var CarouselView = require("views/elements/carousel");
  var TracklistView = require("views/elements/tracklist");
  var UserView = Utils.Page.extend({

    constructorName: "UserView",
    events:{
    	"touchstart": "startTouch",
	    "touchmove": "elastic",
	    "touchend": "resetHeight",
      "tap #back": "back",
      "tap #userOption": "showUserOption"
	},

	elasticImage: undefined,
	
    initialize: function() {
      // load the precompiled template
      this.template = Utils.templates.user;
      // here we can register to inTheDOM or removing events
      // this.listenTo(this, "inTheDOM", function() {
      //   $('#content').on("swipe", function(data){
      //     console.log(data);
      //   });
      // });
      // this.listenTo(this, "removing", functionName);

      // by convention, all the inner views of a view must be stored in this.subViews
    },

    id: "User",
    
    className: "full-page",
    
    parent: undefined,

    render: function() {
	   var that = this;
	   this.model.fetch({
		   success: function(data){
			   
			   that.$el.html(that.template(data.attributes));
			    //set options
			    console.log(data)
			      that.elasticImage = $("#cover-user-view");
			
			      that.userScrollingView = $("#user-scrolling-view");
			
			      that.userScrollingView.bind('scroll', function (ev) {
			            that.checkScroll(ev);
			      });
			    
			    // CREATE CAROUSEL VIEW FOR PLAYLIST
			    var PlaylistCollection = require("collections/PlaylistCollection");
			    // create a collection for the template engine
			    var user_playlists = new PlaylistCollection({
				    id: data.attributes.id
				})  
			    that.carousel = new CarouselView({
				    collection: user_playlists
			    })
			    that.carousel.render()  
				$("#UserCarousel").html(that.carousel.el);
				
				
				// CREATE LIST VIEW FOR TRACKS
				var TrackCollection = require("collections/TrackCollection");
			    // create a collection for the template engine
			    var user_tracks = new TrackCollection({
				    id: data.attributes.id
				})  
			    that.tracklist = new TracklistView({
				    collection: user_tracks
			    })
			    that.tracklist.render()  
				$("#tracklist").html(that.tracklist.el);
				
				 
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
                  && this.el.children['user-scrolling-view'].scrollTop == 0){

    			//var altezza = this.elasticImage.height();
    			
    			//hidden content 
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
      if(this.el.children['user-scrolling-view'].scrollTop > 100){
        $(this.el.children[0]).addClass("header-visible")
      }else{
         $(this.el.children[0]).removeClass("header-visible")
      }
  },
  hideUser: function(){ //fired from UserView
      this.parent.delegateEvents();
      this.close();
    }
  /*page.elasticImage = $("#cover-view");
              
              this.structureView.snapper.on("drag", function(){
                page.enabledElastic = false;
              });
              this.structureView.snapper.on("animated", function(){
                page.enabledElastic = true;
              });*/
	
		
	
	

    
  });

  return UserView;

});