define(function(require) {

  var $ = require("jquery");
  var Backbone = require("backbone");
  var Utils = require("utils");
  var Snap = require("snap");
  var Handlebars = require("handlebars");

  var StructureView = Backbone.View.extend({

    constructorName: "StructureView",

    id: "main",
    
	  className: "fadeEffect",
	
    events: {
      "tap #menu-button": "openMenu",
      "tap .apriplayer": "openPlayer",
      "tap .playControl": "playControl"
      
      },
    initialize: function(options) {
      // load the precompiled template
      this.template = Utils.templates.structure;
      Handlebars.registerHelper('subString', function(string, replace) {
	    if(string){
		    var large = string.replace("large",replace);
			return new Handlebars.SafeString(large)
	    }
        
      });

      //{{kFormatter playback_count}}
      Handlebars.registerHelper('kFormatter', function(num) {
        var result;
        if(num > 999){
         result = (num/1000).toFixed(1) + 'k';
        }else{
          result = num;
        }
        return new Handlebars.SafeString(result)
      });

					
      //this.on("inTheDOM", this.rendered);
      // bind the back event to the goBack function
      //document.getElementById("back").addEventListener("back", this.goBack(), false);
    },

    player: null,
    
    currentView: null,

    render: function() {
      // load the template
      var account = JSON.parse(localStorage.getItem("account"));
      this.el.innerHTML = this.template({permalink: account.permalink, picture: account.avatar_url.replace("large", "t500x500")});
      // cache a reference to the content Element
      this.contentElement = this.$el.find('#content')[0];
      return this;
    },
    
    openMenu: function(){
	    this.snapper.open("left");
	    
    },
    /*setActive: function(e){
    	alert();
    	var ciao = document.getElementsByClassName("active");
    	if(ciao.length > 0){
	    	ciao[0].classList.remove("active");
    	}
	    e.currentTarget.classList.add("active");
    },*/
    setActive: function(elementId){
        try{
          document.getElementsByClassName("active")[0].classList.remove("active");
        }
        finally{
          document.getElementById(elementId).classList.add("active");
        }
          
    },
    initializeMenu: function(){

	     this.snapper = new Snap({
					element: document.getElementById('content'),
					disable: "right",
					addBodyClasses: true,
					resistance: 0.5,
					flickThreshold: 10,
					transitionSpeed: 0.3,
					tapToClose: true,
					touchToDrag: true,
					slideIntent: 20,
					minDragDistance: 40
			});
    },
    openPlayer: function(){
	    this.currentView.undelegateEvents();
	    this.currentView.$el.addClass("hidden-fade");
		this.player.$el.removeClass("hidden-fade");
		this.player.delegateEvents();
		/*
		this.player.animate({
			display: "block"
			}, 100, "linear", function(){
			                $(this).css("opacity", 1);
			              }
		);
		*/

    },
    playControl: function(e){
      e.stopImmediatePropagation();
      currentPlayingTrack.togglePause();
      /*if(currentPlayingTrack.paused) {
        $("#ios-play").css("display", "none");
        $("#equalizer").css("display", "block");
      }else{
        $("#ios-play").css("display", "block");
        $("#equalizer").css("display", "none");
      }*/
      
    },
    
    
    // rendered: function(e) {
    // },

    
    
  });

  return StructureView;

});