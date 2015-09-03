// here we put the paths to all the libraries and framework we will use
require.config({
  paths: {
    jquery: '../lib/zepto/zepto', // ../lib/jquery/jquery', 
    underscore: '../lib/underscore/underscore',
    backbone: "../lib/backbone/backbone",
    text: '../lib/require/text',
    async: '../lib/require/async',
    handlebars: '../lib/handlebars/handlebars',
    templates: '../templates',
    preloader: '../lib/preloader/pre-loader',
    utils: '../lib/utils/utils',
    snap: '../lib/snap/snap',
    blazy: '../lib/blazy/blazy'
  },
  shim: {
    'jquery': {
      exports: '$'
    },
    'underscore': {
      exports: '_'
    },
    'handlebars': {
      exports: 'Handlebars'
    }
  }
});

// We launch the App
require(['backbone', 'utils'], function(Backbone, Utils) {
  require(['preloader', 'router'], function(PreLoader, AppRouter) {
	 
	 
		
    //document.addEventListener("deviceready", run, false);
    run();
    
    
    
    function run() {
		
      // Here we precompile ALL the templates so that the app will be quickier when switching views
      // see utils.js
      Utils.loadTemplates().once("templatesLoaded", function() {

      var images = ['img/login.jpg', 'img/avatar.jpg']; // here the developer can add the paths to the images that he would like to be preloaded

      if (images.length) {
          new PreLoader(images, {
            onComplete: startRouter
          });
        } else {
          // start the router directly if there are no images to be preloaded
          startRouter();
        }


        function startRouter() {
          // launch the router
          var router = new AppRouter();
          Backbone.history.start();
          
	      /*var snapper = new Snap({
				element: document.getElementById('content'),
				disable: "right",
				addBodyClasses: true,
				resistance: 0.5,
				flickThreshold: 10,
				transitionSpeed: 0.5,
				tapToClose: true,
				touchToDrag: true,
				slideIntent: 10,
				minDragDistance: 40 
			});
			
		   document.querySelector('#menu-button').addEventListener('click', function() {
			        snapper.open("left");
			});*/
			
			SC.initialize({
			  client_id: '2aca68b7dc8b51ec1b20fda09b59bc9a',
			  redirect_uri: 'http://giuseppebianchi.github.io/loud/'
			});
			
			
        }
        
      });
    } //End Run()
    
    
  });
});