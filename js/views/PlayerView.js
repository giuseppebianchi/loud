define(function(require) {
  var $ = require("jquery");
  var Backbone = require("backbone");
  var Handlebars = require("handlebars")
  var Utils = require("utils");
  var StreamListTrack = require("collections/StreamCollection");
  var Swiper = require("swiper");

  var StreamView = Utils.Page.extend({

    constructorName: "player",
    className: "hidden-fade",
    events:{	
      "tap .soundcloudArtist": "showUser",
      //"tap #chiudiplayer": "closePlayer",
      "swipeDown": "closePlayer",
      "swipeUp": "closePlayer",
      "touchstart .progressBarPlayer": "seekTrack",
      "touchend .progressBarPlayer": "seekTrackEnd",
      "tap .timePlayer": "toggleProgressbar",
      "tap .trackOption": "showOption",
      "doubleTap": "playPlause",
      "input .progressBarPlayer": "update_time_while_scrolling_bar" 
    },

    collection: StreamListTrack,
	
    initialize: function() {
      // load the precompiled template
      this.template = Utils.templates.player;
      // here we can register to inTheDOM or removing events
      // this.listenTo(this, "inTheDOM", function() {
      //   $('#content').on("swipe", function(data){
      //     console.log(data);
      //   });
      // });
      // this.listenTo(this, "removing", functionName);

      // by convention, all the inner views of a view must be stored in this.subViews
    },

    id: "player",

    currentView: undefined,

    coverPlayer: null,

    details: null,

    render: function() {
	    var self = this;
	    Handlebars.registerHelper('getMinutes', function(duration) {
	      
	      var result = self.getMinutes(duration);
	       
	      return new Handlebars.SafeString(result);
	    });
        var data = JSON.parse(localStorage.getItem("activities"));
        this.el.innerHTML = this.template(data.collection);
        return this;
    },
    
     initializeSliderPlayer: function(){
      var self = this;
            $(document).ready(function(){
                      self.coverPlayer  = new Swiper ('.swiper-container',{
                      shortSwipes: true,
                      threshold: 10,
                      simulateTouch: false,
                      touchRatio: 0.7,
                      parallax: false,
                      width: screen.width, 
                      /*width: 375, PER IPHONE 6*/
                      /*width: 320, PER IPHONE 5/4 */
                      longSwipesRatio: 0.3,
                      spaceBetween: 1,
                      onSlideChangeStart: function(e){
	                      
	                      //self.playTrack(e.slides[e.activeIndex].attributes["sctrackid"].value, e.activeIndex);
                      }
                });
             });
        
    },
    getMinutes: function (duration) {//for soundcloud track duration
        /*var minutes = Math.floor(millis / 60000);
        var seconds = ((millis % 60000) / 1000).toFixed(0);
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;*/
          var seconds = parseInt((duration/1000)%60)
              , minutes = parseInt((duration/(1000*60))%60)
              , hours = parseInt((duration/(1000*60*60))%24),
              total = "";
          
          if(hours != "00"){
             hours = (hours < 10) ? "0" + hours : hours;
             total += hours + ":";
          }
          
          minutes = (minutes < 10) ? "0" + minutes : minutes;
          seconds = (seconds < 10) ? "0" + seconds : seconds;
          total = total + minutes + ":" + seconds;
          return total;
    },
    showUser: function(e){
      e.stopImmediatePropagation()
      alert(e.currentTarget.attributes["scuserid"].value);
    },
    openPlayer: function(){
	    /*CANCEL EVENTS OF VIEW - HIDDEN FADE CLASS: NO BEHAVIOR FOR NOW*/
	    this.currentView.undelegateEvents();
	    this.currentView.$el.addClass("hidden-fade");
		this.$el.removeClass("hidden-fade")

    },
    closePlayer: function(){
	  /*RELOAD EVENTS OF VIEW*/
      this.currentView.$el.removeClass("hidden-fade");
      this.currentView.delegateEvents();
      this.$el.addClass("hidden-fade");
      this.undelegateEvents();
      
    },
    seekTrack: function(e){
	    this.coverPlayer.detachEvents();
		/*to prevent width updating in whileplaying function*/
		this.isScrolling = true;
    },
    seekTrackEnd: function(e){
      var position = e.currentTarget.value;
      currentPlayingTrack.setPosition(position);
      this.coverPlayer.attachEvents();
      this.isScrolling = false;
    },
    update_time_while_scrolling_bar: function(e){
	    this.details.time.text(this.getMinutes(e.target.value));
    },
    playPlause: function(e){
      e.stopImmediatePropagation();
      currentPlayingTrack.togglePause();
    },
    toggleProgressbar: function(e){
      e.stopImmediatePropagation();
      if(this.$el.hasClass("toggled")) {
        this.$el.removeClass("toggled");
      }else{
        this.$el.addClass("toggled");
      }
    },
    playTrack: function(track, index){

      var self = this;
      
      if (typeof currentPlayingTrack !== 'undefined') {
        // currentPlayingTrack is defined
        if(track.id == currentPlayingTrack.loudId){
          this.openPlayer();
          this.delegateEvents();
          return false;
        }
        currentPlayingTrack.destruct();
      }else{
        $("#miniplayer").addClass("opened");
      }

      this.coverPlayer.slideTo(index, 0);
/*
      $.getJSON('http://api.soundcloud.com/users/'+track.user.id+'?client_id=2aca68b7dc8b51ec1b20fda09b59bc9a', function(a){
        console.log(a)
      });
*/		
        self.details.progressBarPlayer = $(".swiper-slide-active .progressBarPlayer");
        self.details.time = $(".swiper-slide-active .currentTimeTrack");
        this.details.miniplayerTitle.text(track.title);
        this.details.miniplayerArtist.text(track.user.username);
        this.details.miniplayerImg.attr("src", track.artwork_url.replace("large", "t500x500"));
        // .css("background-image", "url(" + result.artwork_url.replace("large", "t500x500")+ ")");
     
      SC.stream("/tracks/" + track.id, {
        autoPlay: true,
        whileplaying: function(){
          if(!self.isScrolling){
            self.details.progressBarMini.css("width", ((this.position/this.durationEstimate)*100) + '%');
			//self.details.progressBarPlayer.val((this.position/this.durationEstimate)*100);
			self.details.progressBarPlayer.val(this.position);
			self.details.time.text((self.getMinutes(this.position)));
          }
        },
        onpause: function(){
          $("#ios-play").css("display", "block");
          $("#equalizer").css("display", "none");
          $("#pauseButton").css("display", "block");
          $(".coverTrackPlayer").addClass("blurred");

        },
        onplay: function(){
          $("#ios-play").css("display", "none");
          $("#equalizer").css("display", "block");
          $("#pauseButton").css("display", "none");
          $(".coverTrackPlayer").removeClass("blurred");
        }

      },
      function(sound){
       currentPlayingTrack = sound;
       currentPlayingTrack.loudId = track.id;
      });
    },
    showOption: function(){
      this.details.showOption.addClass("visible");
      $("#main").addClass("blurred");
      $("#main-overlay").addClass("visible");
      // $("#main").addClass("blurred");
      // this.detail.showOption.css({display: "block", opacity: 1})
    },
    
	

  });

  return StreamView;

});