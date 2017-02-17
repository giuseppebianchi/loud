define(function(require) {
  var $ = require("jquery");
  var Backbone = require("backbone");
  var Utils = require("utils");
  var BulletsView = require("views/elements/bullet");
  var UserView = require("views/pages/UserView");
  var SettingView = Utils.Page.extend({

    constructorName: "SettingView",
    events:{
    	"touchstart": "startTouch",
	    "touchmove": "elastic",
	    "touchend": "resetHeight",
      "tap .back-button": "back",
	},

	elasticImage: undefined,
	
    initialize: function(options) {
      // load the precompiled template
      this.template = Utils.templates.settings;
      // here we can register to inTheDOM or removing events
      // this.listenTo(this, "inTheDOM", function() {
      //   $('#content').on("swipe", function(data){
      //     console.log(data);
      //   });
      // });
      // this.listenTo(this, "removing", functionName);

      // by convention, all the inner views of a view must be stored in this.subViews
    },

    id: "Settings",
    
    className: "User full-page",
    
    parent: undefined,
    
	loadingContents: false,
	
	total_following: undefined,
	
    render: function() {
	   var that = this;
	   //SET OFFLINE HTML TEMPLATE WHILE FETCHING DATA FROM SOUNDCLOUD
	   //that.$el.html(that.template_offline({nameuser: "clicked user"}));
			    that.$el.html(that.template({
				   total_following: that.total_following
				}));
			    //set options
			      that.elasticImage = $(that.$el.find(".cover-user-view-background"));
			      
			      that.userScrollingView = $(that.$el.find(".user-scrolling-view").get(0));
				  that.contentList = $(that.$el.find(".user-content-view").get(0));
				  
			      that.userScrollingView.bind('scroll', function (ev) {
			            that.checkScroll(ev);
			      });
			    
				
				setTimeout(function(){that.$el.addClass("active"), that.parent.$el.addClass("onback")}, 100);

       
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
    			this.elasticImage.css("height", (200 + ((e.touches[0].pageY - this.firstTouch)/3)) + "px");

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

  hidePage: function(){ //fired from UserView
      this.parent.delegateEvents();
      this.close();
    },

		
	
	

    
  });

  return SettingView;

});