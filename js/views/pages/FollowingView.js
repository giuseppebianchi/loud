define(function(require) {
  var $ = require("jquery");
  var Backbone = require("backbone");
  var Utils = require("utils");
  var BulletsView = require("views/elements/bullet");
  var UserView = require("views/pages/UserView");
  var FollowingView = Utils.Page.extend({

    constructorName: "FollowingView",
    events:{
    	"touchstart": "startTouch",
	    "touchmove": "elastic",
	    "touchend": "resetHeight",
      "tap .back-button": "back",
      "tap .following-item": "showUser"
	},

	elasticImage: undefined,
	
    initialize: function(options) {
	  this.total_following = options.total;
      // load the precompiled template
      this.template = Utils.templates.allFollowing;
      // here we can register to inTheDOM or removing events
      // this.listenTo(this, "inTheDOM", function() {
      //   $('#content').on("swipe", function(data){
      //     console.log(data);
      //   });
      // });
      // this.listenTo(this, "removing", functionName);

      // by convention, all the inner views of a view must be stored in this.subViews
    },

    id: "Following",
    
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
			      that.elasticImage = $(that.$el.find(".cover-user-view"));
			      
			      that.userScrollingView = $(that.$el.find(".user-scrolling-view").get(0));
				  that.contentList = $(that.$el.find(".user-content-view").get(0));
				  
			      that.userScrollingView.bind('scroll', function (ev) {
			            that.checkScroll(ev);
			      });
			    
			
				
				// CREATE LIST VIEW FOR FOLLOWING	
			    // create a collection for the template engine
			    var FollowingCollection = require("collections/FollowingCollection")
			    var followings = new FollowingCollection({
				    total: that.total_following,
				    all: true
			    }); 
			    that.BulletsView = new BulletsView({
				    collection: followings
			    })
			    that.BulletsView.render()  
				that.$el.find(".bullet-section").html(that.BulletsView.el);
				
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
	    if(this.BulletsView.collection.next){
			this.BulletsView.collection.fetch({
		        success: function(more){
			        
			        that.BulletsView.$el.append(that.BulletsView.template(more));
			        that.BulletsView.bLazy.revalidate();
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
      

      
    }
		
	
	

    
  });

  return FollowingView;

});