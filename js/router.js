define(function(require) {

  var $ = require("jquery");
  var Backbone = require("backbone");
  /* MODELLI */
  var TrackModel = require("models/TrackModel");
  
  /* COLLECTION */
  var TrackList = require("collections/TrackList");
  
  /* VIEW */
  var StructureView = require("views/StructureView");
  var HomeView = require("views/pages/HomeView");
  var LoginView = require("views/pages/LoginView");

  var AppRouter = Backbone.Router.extend({

    constructorName: "AppRouter",

    routes: {
      // the default is Login
      "": "LoginFunction",
      "start": "showStructure",
      "home": "HomeFunction"
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
							nextView();
				        }
				        
				        
				        
				        
				        function nextView(){
					        Backbone.history.navigate("home", {trigger: true});
				        }
				        // go to last view - "home" is default
      
      
    }, //END STRUCTURE

	LoginFunction: function() {
				      
				      if(!localStorage.getItem("account")){
					      
					      // show the view
					     init()
					     
					     function init(){
						  // create the view
						      var loginPage = new LoginView();
						      document.body.appendChild(loginPage.render().el);
						      if(loginPage){
							  showAll();
							  }
					     } 
					     
					     function showAll(){
						     loginPage.trigger("inTheDOM");
							 $("#LoginView").css("opacity", 1);
						 }
						 
				      }else{
					      this.navigate("start", {trigger: true});
				      }
      
    },

    HomeFunction: function() {
				     
				      // highlight the nav1 tab bar element as the current one
				      //this.structureView.setActiveTabBarElement("nav1");
				      // create a model with an arbitrary attribute for testing the template engine
				      
				      var listaStream = new TrackList({
				       	
				      });
				      // create the view
				      var page = new HomeView({
				        model: listaStream
				      });
				      // show the view
				      this.changePage(page);
				      page.elasticImage = $("#cover-view");
				      page.elasticImage.css("transform", "scale(1)");
    },
    


    

  });

  return AppRouter;

});