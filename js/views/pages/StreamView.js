define(function(require) {
  var $ = require("jquery");
  var Backbone = require("backbone");
  var Handlebars = require("handlebars")
  var Utils = require("utils");
  var StreamListTrack = require("collections/StreamListTrack");
  

  var StreamView = Utils.Page.extend({

    constructorName: "StreamView",
    
    events:{	
      "click .soundcloudArtist": "showUser",
      "click .list-track": "playTrackStream"
    },

    collection: StreamListTrack,
    
	  elasticImage: undefined,
	
    initialize: function() {
      // load the precompiled template
      this.template = Utils.templates.stream;
      
      // here we can register to inTheDOM or removing events
      // this.listenTo(this, "inTheDOM", function() {
      //   $('#content').on("swipe", function(data){
      //     console.log(data);
      //   });
      // });
      // this.listenTo(this, "removing", functionName);

      // by convention, all the inner views of a view must be stored in this.subViews
    },

    id: "Stream",
    
    className: "full-page",

    activities: null,
    
    scrollingView: null,

    contentList: null,

    render: function() {

      Handlebars.registerHelper('compare', function(v1, v2, options) {
          if(v1 === v2) {
            return options.fn(this);
          }
          return options.inverse(this);
      });

      this.activities = JSON.parse(localStorage.getItem("activities"));

      $(this.el).html(this.template(this.activities.collection));
      

      return this;
    },
    
    enabledElastic: true,
    
    /*startTouch: function(e){
     		this.elasticImage.css("transition", ""); 
     		this.firstTouch = e.touches[0].pageY;
     },*/
    
    /*elastic: function(e){
    	
    	if(this.enabledElastic && ((e.touches[0].pageY - this.firstTouch) > 0) && this.el.scrollTop == 0){
    		var altezza = this.elasticImage.height();
    		//$(this.el).css("overflow", "hidden");			
    		this.elasticImage.css("height", (200 + ((e.touches[0].pageY - this.firstTouch)/3)) + "px");
    		e.preventDefault();
    	}else{
    		//$(this.el).css("overflow", "");
    	}
    	
       	
    },*/
    resetHeight: function(e){
    	this.elasticImage.css({transition: "height 0.2s ease-out", height: ""});
    	$(this.el).css("overflow", "");
    	/*
    	this.elasticImage.animate({height: ""}, 200, 'linear');
    			$(this.el).css("overflow", "");
    	*/
    },
    checkScroll: function(){

      if(this.scrollingView.scrollTop() == (this.contentList.height() - this.scrollingView.height())) {
       this.fetchData();
      }
    },
    fetchData: function(){
        
    },
    playTrackStream: function(e){
      var self = this;
      var selectedTrack = e.currentTarget.attributes["sctrackid"].value;
      if (typeof currentTrack !== 'undefined') {
        // currentTrack is defined
        currentTrack.destruct();
      }else{
        $("#miniplayer").addClass("opened");
      }

      SC.get("/tracks/" + selectedTrack, function(result){
        // console.log(result);
        $("#totalDuration").text(self.getMinutes(result.duration));
        $("#miniplayer img").attr("src", result.artwork_url.replace("large", "badge"));
      });

      var progressBarMini = $("#progressBar");
      var progressBarPlayer = $("#progressBarPlayer");
      SC.stream("/tracks/" + selectedTrack, {
        autoPlay: true,
        whileplaying: function(){
        progressBarMini.css("width", ((this.position/this.durationEstimate)*100) + '%');
        progressBarPlayer.val((this.position/this.durationEstimate)*100);
        }
      },
      function(sound){
       currentTrack = sound;
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
    }
    
	

  });

  return StreamView;

});