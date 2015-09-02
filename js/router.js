define(function(require) {

  var $ = require("jquery");
  var Backbone = require("backbone");
  
  /* VIEW */
  var StructureView = require("views/StructureView");


  var AppRouter = Backbone.Router.extend({

    constructorName: "AppRouter",

    routes: {
      // the default is Login
      "": "LoginFunction",
      "start": "showStructure",
      "stream": "StreamFunction"
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
					        Backbone.history.navigate("stream", {trigger: true});
				        }
				        // go to last view - "home" is default
      
      
    }, //END STRUCTURE

	LoginFunction: function() {
				      
				      if(!localStorage.getItem("account")){
				      
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
      
    },

    StreamFunction: function() {
				      
				      var StreamView = require("views/pages/StreamView");
				      var StreamListTrack = require("collections/StreamListTrack");
				      // highlight the nav1 tab bar element as the current one
				      //this.structureView.setActiveTabBarElement("nav1");
				      // create a model with an arbitrary attribute for testing the template engine
				      var listaStream = new StreamListTrack;
				   
				      // create the view
				      var page = new StreamView({
				        model: listaStream
				      });
				      // show the view
				      
				      SC.get('/me/activities', function(activities) {
                    			console.log(JSON.stringify(activities));
					  });
 
					  
				      this.changePage(page);
				      
				      page.elasticImage = $("#cover-view");
				      
				      this.structureView.snapper.on("drag", function(){
					      page.enabledElastic = false;
				      });
				      this.structureView.snapper.on("animated", function(){
					      page.enabledElastic = true;
				      });
				      
				      
    },
    


    

  });

  return AppRouter;

});
