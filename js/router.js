define(function(require) {

  var $ = require("jquery");
  var Backbone = require("backbone");
  /* MODELLI */
  var MyModel = require("models/MyModel");
  
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

	LoginFunction: function() {
      if(localStorage.getItem("account")){
	      // create the view
	      var loginPage = new LoginView();
	      // show the view
	     document.body.appendChild(loginPage.render().el);
		 loginPage.trigger("inTheDOM");
		 setTimeout(function(){$("#LoginView").css("opacity", 1)}, 300);
		 
      }else{
	      this.navigate("start", {trigger: true});
      }
      
    },

    HomeFunction: function() {
      // highlight the nav1 tab bar element as the current one
      this.structureView.setActiveTabBarElement("nav1");
      // create a model with an arbitrary attribute for testing the template engine
      var modello = new MyModel({
        key: "Giuseppe"
      });
      // create the view
      var page = new HomeView({
        model: modello
      });
      // show the view
      this.changePage(page);
    },
    


    // load the structure view
    showStructure: function() {
      	
        
        init()
        
        function init(){
	        this.structureView = new StructureView();
	         
	         $("#LoginView").css("opacity", 0);
	         
	         nextStep();
	         
        }
        
        function nextStep(){
	        setTimeout(function(){
				        document.body.appendChild(this.structureView.render().el);
				        
				        $("#LoginView").remove();
						
						finish();
			}, 700);
        }
        
        function finish(){
        	
        	this.structureView.trigger("inTheDOM");
	        setTimeout(function(){$("#main").css("opacity", 1)}, 200);
	        this.structureView.initializeMenu(); 
			
        }
        // put the el element of the structure view into the DOM
        
        
        
        
        
		
		 
      // go to first view
      //this.navigate(this.firstView, {trigger: true});
    },

  });

  return AppRouter;

});