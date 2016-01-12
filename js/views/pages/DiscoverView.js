define(function(require) {
  var $ = require("jquery");
  var Backbone = require("backbone");
  var Handlebars = require("handlebars");
  var Blazy = require("blazy");
  var Utils = require("utils");
  
  var UserView = require("views/pages/UserView");

  var StreamView = Utils.Page.extend({

    constructorName: "DiscoverView",
    
    events:{	
      "tap .list-track": "playTrackStream",
      "tap .soundcloudArtist": "showUser"
    },
    
	userView: undefined,
	
    initialize: function() {
      // load the precompiled template
      this.template = Utils.templates.discover;
      this.templateList = Utils.templates.discoverlist;
      
      
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
			  success: function(activities){
				  	//set received data into template
					that.$el.html(that.template(activities.models));
					
					//set element that gets scroll event - to reload new data
					that.scrollingView = $("#discover-scrolling-view");
					that.contentList = $(that.$el.find(".list").get(0));
						  
					//set event listener to scroll
					that.scrollingView.bind('scroll', function (ev) {
						that.checkScroll(ev);
					});
					//initialize lazy loading library
					that.bLazy = new Blazy({ 
						container: '#discover-scrolling-view'
					});
					
			  }
		  })

      

      return this;
    },
    
    checkScroll: function(){
      if(!this.loadingContents && 
      		this.scrollingView.scrollTop() > 
      			(this.contentList.height() - this.scrollingView.height() - 20)) {
	      			
	   this.loadingContents = true;
       this.fetchData();
      }
    },
    fetchData: function(){
	    var that = this;
	    if(this.collection.next){
			this.collection.fetch({
		        success: function(more){
			        that.scrollingView.children(".list").append(that.templateList(more));
			        that.bLazy.revalidate();
			        that.loadingContents = false;
			    },
			    error: function(a){
				    
			    }
	        })
	    }else{
		    this.loadingContents = true;
			this.$el.find(".cssload-loader").css("opacity", 0)
	    }
        
    },
    playTrackStream: function(e){
/*
		$.getJSON('https://api.soundcloud.com/me?oauth_token=' + localStorage.getItem("accessToken"), function(me) {
		    console.log(me);
		});
*/
      var selectedTrack = e.currentTarget.attributes["sctrackid"].value;
      //GET THE INDEX AND THE OBJECT WHICH CONTAINS THE SELECTED TRACK
      //var result = this.findTrack(selectedTrack);

      //this.player.playTrack(result[0], result[1]);
      
    },
    findTrack: function(id){
      for(var i = 0; this.activities.collection.length; i++){
        if(this.activities.collection[i].origin.id == id){
          return [this.activities.collection[i].origin, i];
          //return i;
        }
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

  return StreamView;

});