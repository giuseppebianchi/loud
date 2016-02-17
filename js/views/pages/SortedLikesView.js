define(function(require) {
  var $ = require("jquery");
  var Backbone = require("backbone");
  var Utils = require("utils");
  var Blazy = require("blazy");
  var UserView = require("views/pages/UserView");
  var SortedLikesCollection = require("collections/SortedLikesCollection");
  
  var SortedLikesView = Utils.Page.extend({

    constructorName: "SortedLikesView",
    events:{
    	"touchstart": "startTouch",
	    "touchmove": "elastic",
	    "touchend": "resetHeight",
      "tap .back-button": "back",
      "tap .following-item": "showUser",
      "tap #sort-likes": "changeLikes"
	},

	elasticImage: undefined,
	
    initialize: function(options) {
	  this.player = options.player;
      // load the precompiled template
      this.template = Utils.templates.sorted_likes;
      
	  this.collection = new SortedLikesCollection({
		  total_likes: options.total_likes
	  })
    },

    id: "Likes",
    
    className: "User full-page",
    
    parent: undefined,
	
	total_likes: undefined,
	
    render: function() {
	   var that = this;
	   //SET OFFLINE HTML TEMPLATE WHILE FETCHING DATA FROM SOUNDCLOUD
	   //that.$el.html(that.template_offline({nameuser: "clicked user"}));
	   this.collection.fetch({
		   success: function(data){
			    that.$el.html(that.template(data));
			    //set options
			      that.elasticImage = $(that.$el.find(".cover-user-view-background"));
			      
			      that.userScrollingView = $(that.$el.find(".user-scrolling-view").get(0));
				  that.contentList = $(that.$el.find(".user-content-view").get(0));
				  
			      that.userScrollingView.bind('scroll', function (ev) {
			            that.checkScroll(ev);
			      });
				
				setTimeout(function(){
					that.$el.addClass("active"); 
					that.parent.$el.addClass("onback")
					that.bLazy = new Blazy({ 
					container: "#user-scrolling-view-likes"
					});
				}, 150);
				
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
    setTimeout(function(){self.hideUser()}, 200);
  },
  checkScroll: function(e){
      if(this.userScrollingView[0].scrollTop > 100){
        $(this.el.children[0]).addClass("header-visible")
      }else{
         $(this.el.children[0]).removeClass("header-visible")
      }
  },
  hideUser: function(){ //fired from UserView
      this.parent.delegateEvents();
      this.close();
    },
  showLikesAboutUser: function(e){
	  e.stopImmediatePropagation();    
      this.userView = new LikesAboutUserView({
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
	changeLikes: function(){
		
	}	
	
	

    
  });

  return SortedLikesView;

});