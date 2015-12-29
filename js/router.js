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
      "start": "showStructure",
      "stream": "Stream",
      "discover": "Discover",
      "profile": "Profile"
    },

    firstView: "HomeFunction",

    initialize: function(options) {
      this.currentView = undefined;
      
    },
    
    // load the structure view
    showStructure: function() {


				        // put the el element of the structure view into the DOM
				        var self = this;
				        
				        init();
				        
				        function init(){
					        self.structureView = new StructureView();
					        $("#LoginView").css("opacity", 0);
					        nextStep();
					         
				        }
				        
				        function nextStep(){
					        setTimeout(function(){
								        document.body.appendChild(self.structureView.render().el);
								        
								        $("#LoginView").remove();
										
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
				        self.playerView = new PlayerView();
				        initPlayer();
				        
				        function initPlayer(){
					        
					        renderPlayer();
					    }
				        
				        function renderPlayer(){
							document.getElementById("main").appendChild(self.playerView.render().el);
							finishPlayer();
				        }
				        
				        function finishPlayer(){

				        	self.playerView.trigger("inTheDOM");

							self.playerView.initializeSliderPlayer();

					        self.structureView.player = self.playerView;
					        
					        var details = {
								miniplayerImg: $("#miniplayerImg"),
								miniplayerTitle: $("#miniplayerTitle"),
								miniplayerArtist: $("#miniplayerArtist"),
								progressBarMini: $("#progressBar"),
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
				      if(!localStorage.getItem("accessToken")){
				      
					      var LoginView = require("views/pages/LoginView");
				      
						  // create the view
					      var loginPage = new LoginView();
					      document.body.appendChild(loginPage.render().el);
					      
					      // show the view
					      if(loginPage){
						  	loginPage.trigger("inTheDOM");
						  	setTimeout(function(){$("#LoginView").css("opacity", 1)}, 100);
						  	
						  }
				    
					     
					  }else{
					  
					      this.navigate("start", {trigger: true});
					      
				      }
      
    }, // END LOGIN FUNCTION

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
				      var activities = new DiscoverCollection()
					  
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
    
    
    


    

  });

  return AppRouter;

});