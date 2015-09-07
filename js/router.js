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

      					var Swiper = require("swiper");
      					var Blazy = require("blazy");
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
							self.structureView.playerView = $("#player");

					        $(document).ready(function(){
					        	self.structureView.coverPlayer  = new Swiper ('.swiper-container',{
					        		shortSwipes: true,
					        		threshold: 10,
					        		simulateTouch: false,
					        		touchRatio: 0.7,
					        		
					        		width: screen.width, 
					        		/*width: 375, PER IPHONE 6*/
					        		/*width: 320, PER IPHONE 5/4 */
					        		longSwipesRatio: 0.3,
					        		spaceBetween: 1
								});
					        });
					        
							nextView();
				        }
				        
				        /*var lastView = localStorage.getItem(lastView);
				        if(lastView){
				        	Backbone.history.navigate(lastView, {trigger:true});
				        }else{
				        	Backbone.history.navigate("stream", {trigger:true});
				        }*/
				        
				        function nextView(){
				        	

					        Backbone.history.navigate("stream", {trigger: true});
				        }
				        // go to last view - "home" is default
      
      
    }, //END STRUCTURE FUNCTION

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
      
    }, // END LOGIN FUNCTION

    StreamFunction: function() {
				      
				      var StreamView = require("views/pages/StreamView");
				      var StreamListTrack = require("collections/StreamListTrack");
				      var Blazy = require("blazy");
				      // highlight the nav1 tab bar element as the current one
				      this.structureView.setActive("goToStream");
				      // create a model with an arbitrary attribute for testing the template engine
				      var listaStream = new StreamListTrack;
				   
				      // create the view
				      var page = new StreamView({
				        collection: listaStream
				      });
				      // show the view
				      
				      //GET ACTIVITIES FROM SOUNDCLOUD USER AUTHENTICATED
					  
				      this.changePage(page);
				      
				      /*page.elasticImage = $("#cover-view");
				      
				      this.structureView.snapper.on("drag", function(){
					      page.enabledElastic = false;
				      });
				      this.structureView.snapper.on("animated", function(){
					      page.enabledElastic = true;
				      });*/
					  page.scrollingView = $(".scrolling-view");
					  page.contentList = $(".scrolling-view .list");

				      page.scrollingView.bind('scroll', function (ev) {
      						page.checkScroll(ev);
       				  });
				      var bLazy = new Blazy({ 
        				container: '.scrolling-view'
    				  });
				      localStorage.setItem("lastView", "stream");


					  
				      
				      
    }, //END STREAM FUNCTION
    


    

  });

  return AppRouter;

});