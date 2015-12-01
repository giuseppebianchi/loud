define(function(require) {

  var $ = require("jquery");
  var Backbone = require("backbone");
  var Blazy = require("blazy");
  /* VIEW */
  var StructureView = require("views/StructureView");
  var PlayerView = require("views/PlayerView");
  

  var AppRouter = Backbone.Router.extend({

    constructorName: "AppRouter",

    routes: {
      // the default is Login
      "": "LoginFunction",
      "start": "showStructure",
      "stream": "Stream"
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

					        self.structureView.player = self.playerView.$el;
					        
					        var details = {
					        	option: $("#trackOption"),
					        	time: $("#currentTimeTrack"),
								duration: $("#totalDuration"),
								miniplayerImg: $("#miniplayerImg"),
								miniplayerTitle: $("#miniplayerTitle"),
								miniplayerArtist: $("#miniplayerArtist"),
								progressBarMini: $("#progressBar"),
								progressBarPlayer: $("#progressBarPlayer"),
								showOption: $("#showOption")
					        }
					        self.playerView.details = details;
					        nextView();
					        
				        }
				        /*var lastView = localStorage.getItem(lastView);
				        if(lastView){
				        	Backbone.history.navigate(lastView, {trigger:true});
				        }else{
				        	Backbone.history.navigate("stream", {trigger:true});
				        }*/
				        
				        
				        // go to last view - "stream" is default
				        function nextView(){
				        	Backbone.history.navigate("stream", {trigger: true});
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
				      var TrackModel = require("models/TrackModel");
				      // highlight the nav1 tab bar element as the current one
				      this.structureView.setActive("goToStream");

				      var streamTrackModel = new TrackModel();
				      // create a model with an arbitrary attribute for testing the template engine
				      var listaStream = new StreamCollection({
				      	model: streamTrackModel
				      });
				   
				      // create the view
				      var page = new StreamView({
				        collection: listaStream
				      });
				      // show the view
				      
				      //GET ACTIVITIES FROM SOUNDCLOUD USER AUTHENTICATED
					  
				      this.changePage(page);
				      
				      
					  page.scrollingView = $(".scrolling-view");
					  page.contentList = $(".scrolling-view .list");

				      page.scrollingView.bind('scroll', function (ev) {
      						page.checkScroll(ev);
       				  });
				      var bLazy = new Blazy({ 
        				container: '.scrolling-view'
    				  });
    				  page.player = this.playerView;
				      localStorage.setItem("lastView", "stream");


					  
				      
				      
    }, //END STREAM FUNCTION
    
    


    

  });

  return AppRouter;

});