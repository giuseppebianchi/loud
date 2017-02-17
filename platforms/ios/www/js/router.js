define(function(require) {

  var $ = require("jquery");
  var Backbone = require("backbone");
  /* VIEW */
  var StructureView = require("views/StructureView");
  var PlayerView = require("views/PlayerView");
  

  var AppRouter = Backbone.Router.extend({

    constructorName: "AppRouter",

    routes: {
      // the default is Login
      "": "LoginFunction",
      "welcome": "Welcome",
      "sync": "Sync",
      "start": "showStructure",
      "stream": "Stream",
      "discover": "Discover",
      "profile": "Profile",
      "library": "Library",
      "podcasts": "Podcasts"
    },

    firstView: "HomeFunction",

    initialize: function(options) {
      this.currentView = undefined;
      
    },
    // SHOW SYNC VIEW
    Sync: function() {
	    	navigator.splashscreen.hide();
						var SyncView = require("views/pages/SyncView");
				        // put the el element of the structure view into the DOM
				        var self = this;
				        init();
				        
				        function init(){
					        self.SyncView = new SyncView();
					        if(self.LoginView.$el){
					        	self.LoginView.$el.css("opacity", 0);
					        }else{
						        self.WelcomeView.$el.css("opacity", 0);
					        }
					        nextStep();
					         
				        }
				        
				        function nextStep(){
					        setTimeout(function(){
								        document.body.appendChild(self.SyncView.render().el);
								        if(self.LoginView.el){
								        	self.LoginView.close();
										}else{
											self.WelcomeView.close();
										}
										finish();
							}, 700);
				        }
				        
				        function finish(){
				        	
				        	self.SyncView.trigger("inTheDOM");
					        setTimeout(function(){$("#sync").css("opacity", 1)}, 200);
					        self.SyncView.getData();
				        }
				        
				        
      
      
    }, //END SYNC FUNCTION
    // load the structure view
    showStructure: function() {


				        // put the el element of the structure view into the DOM
				        var self = this;
				        
				        init();
				        
				        function init(){
					        self.structureView = new StructureView();
					        self.SyncView.$el.css("opacity", 0);
					        nextStep();
					         
				        }
				        
				        function nextStep(){
					        setTimeout(function(){
								        document.body.appendChild(self.structureView.render().el);
								        
								        self.SyncView.close();
										
										finish();
							}, 700);
				        }
				        
				        function finish(){
				        	
				        	self.structureView.trigger("inTheDOM");
					        setTimeout(function(){$("#main").css("opacity", 1)}, 200);
					        self.structureView.initializeMenu();
					        //build PLAYER
				        	self.showPlayer();
							
				        }
				        
				        
      
      
    }, //END STRUCTURE FUNCTION
    showPlayer: function() {

				        // put the el element of the structure view into the DOM
				        var self = this;
				        this.playerView = new PlayerView();
				        
				        initPlayer();
				        
				        function initPlayer(){
					        
					        renderPlayer();
					    }
				        
				        function renderPlayer(){
							document.getElementById("main").appendChild(self.playerView.render().el);
							finishPlayer();
				        }
				        
				        function finishPlayer(){
							
							// notify the new view that it is now in the DOM
						    //self.currentView.trigger("inTheDOM");  
						    
						    self.playerView.initializeSliderPlayer();
							
					        self.structureView.player = self.playerView;
					        
					        var details = {
						        miniplayer: $("#miniplayer"),
								miniplayerImg: $("#miniplayerImg"),
								miniplayerTitle: $("#miniplayerTitle"),
								miniplayerArtist: $("#miniplayerArtist"),
								progressBarMini: $("#progressBar"),
								iosplay: $("#ios-play"),
								equalizer: $("#equalizer"),
								showOption: $("#showOption")
					        }
					        self.playerView.details = details;
					        nextView();
					        
				        }
				        
				        // go to last view - "stream" is default
				        function nextView(){
					        var lastView = localStorage.getItem("lastView");
					        
					        if(lastView){
				        		Backbone.history.navigate(lastView, {trigger:true});
					        }else{
					        	Backbone.history.navigate("stream", {trigger:true});
					        }
				        	//Backbone.history.navigate("stream", {trigger: true});
				        }

      
      
    }, //END PLAYER FUNCTION

	LoginFunction: function() {
                                         
					var LoginView = require("views/pages/LoginView");
				    var that = this;
					// create the view
					this.LoginView = new LoginView();
				      if(!localStorage.getItem("accessToken")){
				      
					      document.body.appendChild(this.LoginView.render().el);
					      
					      // show the view
					      if(this.LoginView){
						  	this.LoginView.trigger("inTheDOM");
                                         navigator.splashscreen.hide();
						  	setTimeout(function(){that.LoginView.$el.css("opacity", 1)}, 100);
						  	
						  }
				    
					     
					  }else{
						if(localStorage.getItem("account")){
					  		this.navigate("sync", {trigger: true});
					  	}else{
					      this.navigate("welcome", {trigger: true});
					    }
				      }
      
    }, // END LOGIN
    
    Welcome: function() {
                        
						var WelcomeView = require("views/pages/WelcomeView");
				        // put the el element of the structure view into the DOM
				        var ProfileModel = require("models/ProfileModel");
						var profileData = new ProfileModel()
						
				        var self = this;
				        
				        init();
				        
				        function init(){
					        self.WelcomeView = new WelcomeView({
								model: profileData
				      		});
					        self.WelcomeView.$el.css("opacity", 0);
					        nextStep();
					         
				        }
				        
				        function nextStep(){
					        setTimeout(function(){
								        document.body.appendChild(self.WelcomeView.render().el);
                                       navigator.splashscreen.hide();
								        self.LoginView.close();
										
										finish();
							}, 700);
				        }
				        
				        function finish(){
				        	self.WelcomeView.trigger("inTheDOM");
					        setTimeout(function(){$("#Welcome").css("opacity", 1)}, 200);
							
				        }
				        
				        
      
      
    }, //END WELCOME

    Stream: function() {
				      var StreamView = require("views/pages/StreamView");
				      var StreamCollection = require("collections/StreamCollection");
				      // create a collection for the template engine
				      var activities = new StreamCollection();
					  
				      // create the view
					  activities.token = localStorage.getItem("accessToken");
				      var page = new StreamView({
				        collection: activities
				      });
					  
					  //render template
				      this.changePage(page);
				      //set player view into current view
				      page.player = this.playerView;
				      //set current view to player view
				      
    				  this.playerView.currentView = page;
    				  //set current view to structure view
    				  this.structureView.currentView = page;
    				  //set current view in menu
    				  this.structureView.setActive("goToStream");
    				  //set last view for next opening
				      localStorage.setItem("lastView", "stream");			      
				      
    }, //END STREAM FUNCTION
    Discover: function() {
				      var DiscoverView = require("views/pages/DiscoverView");
				      var DiscoverCollection = require("collections/DiscoverCollection");
				      // create a collection for the template engine
				      var track = JSON.parse(localStorage.getItem("discover"));
				      var activities = new DiscoverCollection({
					      selected_track: track
				      })
					  
				      var page = new DiscoverView({
				        collection: activities
				      });

					  //render template
				      this.changePage(page);
				      //set player view into current view
				      page.player = this.playerView;
				      //set current view to player view
    				  this.playerView.currentView = page;
    				  //set current view to structure view
    				  this.structureView.currentView = page;
    				  //set current view in menu
    				  this.structureView.setActive("goToDiscover");
    				  //set last view for next opening
				      localStorage.setItem("lastView", "discover");			      
				      
    }, //END DISCOVER FUNCTION
    Profile: function() {
				      var ProfileView = require("views/pages/ProfileView");
				      var ProfileModel = require("models/ProfileModel");
				      // create a collection for the template engine
				      var profileData = new ProfileModel()
					  
				      var page = new ProfileView({
				        model: profileData
				      });

					  //render template
				      this.changePage(page);
				      //set player view into current view
				      page.player = this.playerView;
				      //set current view to player view
    				  this.playerView.currentView = page;
    				  //set current view to structure view
    				  this.structureView.currentView = page;
    				  //set current view in menu
    				  this.structureView.setActive("goToProfile");
    				  //set last view for next opening
				      localStorage.setItem("lastView", "profile");			      
				      
    }, //END DISCOVER FUNCTION
    Library: function() {
				      var LibraryView = require("views/pages/LibraryView");
				      var LibraryModel = require("models/LibraryModel");
				      
				      // create a collection for the template engine
				      var LibraryData = new LibraryModel()
					  
				      var page = new LibraryView({
				        model: LibraryData
				      });

					  //render template
				      this.changePage(page);
				      //set player view into current view
				      page.player = this.playerView;
				      //set current view to player view
    				  this.playerView.currentView = page;
    				  //set current view to structure view
    				  this.structureView.currentView = page;
    				  //set current view in menu
    				  this.structureView.setActive("goToLibrary");
    				  //set last view for next opening
				      localStorage.setItem("lastView", "library");			      
				      
    }, //END DISCOVER FUNCTION
    Podcasts: function() {
				      var PodcastsView = require("views/pages/PodcastsView");
				      var PodcastsModel = require("models/PodcastsModel");
				      
				      // create a collection for the template engine
				      var PodcastsData = new PodcastsModel()
					  
				      var page = new PodcastsView({
				        model: PodcastsData
				      });

					  //render template
				      this.changePage(page);
				      //set player view into current view
				      page.player = this.playerView;
				      //set current view to player view
    				  this.playerView.currentView = page;
    				  //set current view to structure view
    				  this.structureView.currentView = page;
    				  //set current view in menu
    				  this.structureView.setActive("goToPodcasts");
    				  //set last view for next opening
				      localStorage.setItem("lastView", "podcasts");			      
				      
    }, //END DISCOVER FUNCTION
    
    
    


    

  });

  return AppRouter;

});