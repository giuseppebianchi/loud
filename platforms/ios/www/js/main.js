// here we put the paths to all the libraries and framework we will use
require.config({
  paths: {
    jquery: '../lib/zepto/zepto', // ../lib/jquery/jquery', 
    underscore: '../lib/underscore/underscore',
    backbone: "../lib/backbone/backbone",
    text: '../lib/require/text',
    async: '../lib/require/async',
    handlebars: '../lib/handlebars/handlebars',
    handlebarshelpers: '../lib/handlebars/handlebarshelpers',
    templates: '../templates',
    preloader: '../lib/preloader/pre-loader',
    utils: '../lib/utils/utils',
    snap: '../lib/snap/snap',
    blazy: '../lib/blazy/blazy',
    swiper: '../lib/swiper/swiper',
    pouchdb: '../lib/pouchdb/pouchdb',
    pouchdbCollate: '../lib/pouchdb/pouchdb-collate'
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
    },
    'handlebarshelpers': {
      deps: ['handlebars'],
      exports: 'Handlebars'
    },
    'swiper':{
      deps: ['jquery']
    }
  }
});


//FUNCTION HANDLER FOR URL SCHEME
if(!localStorage.getItem("accessToken")){
	function getUrlVars(data) {
	  var vars = {};
	  var parts = data.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
	    vars[key] = value;
	  });
	  return vars;
	}
	
	function handleOpenURL(response) {
	  //console.log(url);
	  var url = getUrlVars(response)
	  localStorage.setItem("accessToken", url["#access_token"]);
	  location.reload();
	  // Dispatch/Trigger/Fire the event
	  //document.dispatchEvent(auth_event);
	
	}
}
// We launch the App
require(['backbone', 'utils', 'pouchdb'], function(Backbone, Utils, PouchDB) {
  require(['preloader', 'router'], function(PreLoader, AppRouter) {
	 

    document.addEventListener("deviceready", run, false);
    //run();
    
    function run() {
    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
	    //PREPARE DATABASE NOSQL
	  dbTracks = new PouchDB('loud-tracks')
	  // create a design doc
		var doc = {
		  _id: '_design/loud',
		  views: {
		    tracks: {
		      map: function (doc) {
		        emit([doc.title, doc.artist, doc.albumTitle, doc.content])
		      }.toString()
		    },
		    artists: {
		      map: function (doc) {
		        emit(doc.artist, doc.content.artwork_url)
		      }.toString(),
		      reduce: function (keys, value){
			      return value;
		      }.toString()
		    },
		    artistAlbums: {
		      map: function (doc) {
		        emit([doc.artist, doc.albumTitle], doc)
		      }.toString(),
		      reduce: function (keys, value){
			      return value;
		      }.toString()
		    },
		    albums: {
		      map: function (doc) {
		        emit([doc.albumTitle, doc.artist, doc.album], doc.content.artwork_url)
		      }.toString(),
		      reduce: function (keys, value){
			      return value;
		      }.toString()
		    },
		    albumTracks: {
		      map: function (doc) {
		        emit([doc.title, doc.artist, doc.albumTitle, doc.content], doc.album)
		      }.toString()
		    },
		  }
		}
		
		// save the design doc
		dbTracks.put(doc).catch(function (err) {
		  if (err.status !== 409) {
		    throw err;
		  }
		  // ignore if doc already exists
		})
	  
/*
		dbTracks.destroy().then(function (response) {
		  // success
		}).catch(function (err) {
		  console.log(err);
		});
*/
		
	  dbPodcasts = new PouchDB('loud-podcasts')
	  
		
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
          
		  var SCoptions = {
	          client_id: '2aca68b7dc8b51ec1b20fda09b59bc9a',
			  redirect_uri: 'loudapp://soundcloud',
			  scope: 'non-expiring',
          }
          
          Backbone.history.start();
          
		  var accessToken = localStorage.getItem("accessToken");
		  
		  if(accessToken){
			  SCoptions.access_token = accessToken;
          }else{
	          localStorage.setItem("shuffle", 0);
	          localStorage.setItem("repeat", 0);
	          localStorage.setItem("sortLikes", 0);
	          localStorage.setItem("SaveLastArtist", 1);
	          localStorage.setItem("SaveLastAlbum", 1);
	          localStorage.setItem("selectLibrary", "tracks");
          }
          
          SC.initialize(SCoptions);

			
        }
        
      });
    } //End Run()
    
    
  });
});