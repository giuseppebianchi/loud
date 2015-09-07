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
      "click #menu-button": "openMenu",
      "click #apriplayer": "openPlayer",
      "click #chiudiplayer": "closePlayer",
      "click #timePlayer": "toggleProgressbar",
      "click .playControl": "playControl"
      },
    initialize: function(options) {
      // load the precompiled template
      this.template = Utils.templates.structure;
      Handlebars.registerHelper('subString', function(string) {
        var large = string.replace("large","t500x500");
        return new Handlebars.SafeString(large)
      });
      
					
      //this.on("inTheDOM", this.rendered);
      // bind the back event to the goBack function
      //document.getElementById("back").addEventListener("back", this.goBack(), false);
    },

    playerView: null,

    coverPlayer: null,

    getMinutes: function (millis) {//for soundcloud track duration
        var minutes = Math.floor(millis / 60000);
        var seconds = ((millis % 60000) / 1000).toFixed(0);
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    },

    render: function() {
      // load the template
      var account = JSON.parse(localStorage.getItem("account"));
      this.el.innerHTML = this.template({username: account.username, picture: account.avatar_url.replace("large", "t500x500")});
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
      this.playerView.animate({
        display: "block"
        }, 100, "linear", function(){
                            $(this).css("opacity", 1);
                          }
      );
    },
    closePlayer: function(){
      this.playerView.animate({
          opacity: 0
          }, 500, "linear", function(){
                            $(this).css("display", "none");
                            }
      );
    },
    toggleProgressbar: function(e){
      e.stopImmediatePropagation();
      if(this.playerView.hasClass("toggled")) {
        this.playerView.removeClass("toggled");
      }else{
        this.playerView.addClass("toggled");
      }
    },
    playControl: function(e){
      e.stopImmediatePropagation();
      if(this.playerView.hasClass("isPause")) {
        this.playerView.removeClass("isPause");
        $("#ios-play").css("display", "none");
        $("#equalizer").css("display", "block");
      }else{
        this.playerView.addClass("isPause");
        $("#ios-play").css("display", "block");
        $("#equalizer").css("display", "none");
      }
      console.log("ok");
      currentTrack.togglePause();
    }
    
    // rendered: function(e) {
    // },

    
    
  });

  return StructureView;

});