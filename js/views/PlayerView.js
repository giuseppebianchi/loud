define(function(require) {
  var $ = require("jquery");
  var Backbone = require("backbone");
  var Handlebars = require("handlebars");
  var _ = require("underscore")
  var Utils = require("utils");
  var Swiper = require("swiper");

  var StreamView = Utils.Page.extend({

    constructorName: "player",
    
    events:{	
      //"tap #chiudiplayer": "closePlayer",
      "swipeDown": "closePlayer",
      "swipeUp": "closePlayer",
      "touchstart .progressBarPlayer": "seekTrack",
      "touchend .progressBarPlayer": "seekTrackEnd",
      "tap .timePlayer": "toggleProgressbar",
      "doubleTap": "playPlause",
      "input .progressBarPlayer": "update_time_while_scrolling_bar",
      "tap #shuffle-button": "setShuffle",
      "tap #repeat-button": "setRepeat",
      "tap .soundcloudArtist": "showUser",
      "tap #player-like-button": "setLike",
      "tap #show-player-option": "showOptions"
    },

    collection: null,
	
    initialize: function() {
	  var self = this;
	  Handlebars.registerHelper('getMinutes', function(duration) {
	      
	      var result = self.getMinutes(duration);
	       
	      return new Handlebars.SafeString(result);
	    });
	    
      // load the precompiled template
      this.template = Utils.templates.player;
      this.templateSlide = Utils.templates.slides;
      
      /* these are boolean value */
      this.shuffle = localStorage.getItem("shuffle");
      this.repeat = localStorage.getItem("repeat");
      this.likes = sessionStorage.getItem("likes");
      
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
    
    playingView: undefined,

    render: function() {
	    this.$el.html(this.template({
		    shuffle: this.shuffle,
		    repeat: this.repeat
	    }));
	    //console.log(this.currentView)
        return this;
    },
    renderSlides: function(list) {
	    var slides = [];
		
	    for(var j = 0; j < list.length; j++){
	    	slides.push(this.templateSlide(list[j]));
	    }
	    
	    this.coverPlayer.appendSlide(slides)
    },
    removeTrackFromPlayer: function(start, to){
	    for(start; start < to; start++){
		    console.log(start)
		    this.coverPlayer.removeSlide(start);
		}
		
    },
    setShuffle: function(){
	    console.log("tap")
		this.removeTrackFromPlayer(this.coverPlayer.activeIndex + 1, this.collection.length);
	},
	setRepeat: function(e){
		if(this.repeat == 1){
			this.repeat = 0;
			localStorage.setItem("repeat", 0)
			$(e.currentTarget).removeClass("active-button")
		}else{
			this.repeat = 1;
			localStorage.setItem("repeat", 1)
			$(e.currentTarget).addClass("active-button")
		}
	},
    toDom: function(){
	    // put the new view into the DOM
	    document.getElementById("main").appendChild(this.el);
	    // notify the new view that it is now in the DOM
	    this.currentView.trigger("inTheDOM");  
	    
	    this.initializeSliderPlayer();
    },
     initializeSliderPlayer: function(){
	    this.pauseButton = $("#pauseButton");
	    this.likeButton = $("#player-like-button");
	 	var that = this;
        this.coverPlayer  = new Swiper ('.swiper-container',{
              shortSwipes: true,
              threshold: 10,
              simulateTouch: false,
              touchRatio: 0.7,
              parallax: false,
              preloadImages: false,
              initialSlide: 0,
              effect: "slide",
              lazyLoading: true,
              lazyLoadingInPrevNext: true,
              width: screen.width, 
              /*width: 375, PER IPHONE 6*/
              /*width: 320, PER IPHONE 5/4 */
              longSwipesRatio: 0.3,
              spaceBetween: 1,
              onSlideChangeEnd: function(e){
	              if(typeof currentPlayingTrack !== 'undefined'){
	              	that.details.progressBarPlayer.val(0);
				  	that.details.time.text("00:00");
				  }
	              that.playTrack(e.slides[e.activeIndex].attributes["sctrackid"].value, e.activeIndex);
              },
              onReachEnd: function(e){
/*
	              if(that.repeat){
		             return;
	              }
*/
	              if(typeof that.playingView !== 'undefined'){
			              that.playingView.loadingContents = true;
			              that.playingView.fetchData();
		          }
              }
        });
        coverSlide = this.coverPlayer;
        
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
	  /*RELOAD EVENTS OF VIEW*/
      //this.currentView.$el.removeClass("hidden-fade");
      this.currentView.delegateEvents();
      this.currentView.showUser(e);
      this.$el.removeClass("visible-player");
      this.undelegateEvents();
    },
    openPlayer: function(e){
	    /*CANCEL EVENTS OF VIEW - HIDDEN FADE CLASS: NO BEHAVIOR FOR NOW*/
	    this.currentView.undelegateEvents();
	    this.delegateEvents();
		this.$el.addClass("visible-player")

    },
    closePlayer: function(e){
	  e.stopImmediatePropagation();
	  /*RELOAD EVENTS OF VIEW*/
      //this.currentView.$el.removeClass("hidden-fade");
      this.currentView.delegateEvents();
      this.$el.removeClass("visible-player");
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
    prepareTrack: function(id, view){
	    
	    /* FIND INDEX IN PLAYER COLLECTION FOR SLIDER */
	    
		var that = this;
		
	    if(this.playingView.el.id != "Stream"){
			_.find(this.collection, function(t, i){ 
				if(t.id == id){
					if(i == 0){
						that.coverPlayer.slideNext("false", 0)
					}
					that.coverPlayer.slideTo(i, 0, false); /* false value disable the OnSlideChangeEnd Callback */
					that.playTrack(id, i, view)
					return true
				}
			});
		}else{
			_.find(this.collection, function(t, i){ 
				if(t.origin.id == id){
					if(i == 0){
						that.coverPlayer.slideNext("false", 0)
					}
					that.coverPlayer.slideTo(i, 0, false); /* false value disable the OnSlideChangeEnd Callback */
					that.playTrack(id, i, view)
					return true
				}
			});
		}
		
		
    },
    playTrack: function(id, index, view){
	    
	    var that = this, title, username, artwork, counter = 0;
	    this.details.miniplayerImg.attr("src", "");
		if (typeof currentPlayingTrack !== 'undefined') {
		// currentPlayingTrack is defined
			if(view === this.playingView && id == currentPlayingTrack.loudId){
				this.openPlayer();
				return false;
			}else{
				currentPlayingTrack.destruct();
			}
		}else{
			this.details.miniplayer.addClass("opened");
		}
		
		if(this.playingView.el.id != "Stream"){
			title = this.collection[index].title;
			username = this.collection[index].user.username;
			artwork = this.collection[index].artwork_url;
		}else{
			title = this.collection[index].origin.title;
			username = this.collection[index].origin.user.username;
			artwork = this.collection[index].origin.artwork_url;
		}
		
		//this.details.progressBarPlayer = $(this.coverPlayer.slides[index][0]).find(".progressBarPlayer");
		//this.details.time = $(this.coverPlayer.slides[index]).find(".currentTimeTrack");
		//this.details.bottomPlayer = $(this.coverPlayer.slides[index]).find(".bottom-player");
		this.details.progressBarPlayer = $(".swiper-slide-active .progressBarPlayer");
		this.details.time = $(".swiper-slide-active .currentTimeTrack");
		this.details.bottomPlayer = $(".swiper-slide-active .bottom-player");
		
		this.details.bottomPlayer.addClass("loading-animation");
		
		/* SET MINIPLAYER DATA */
		this.details.miniplayerTitle.text(title);
		this.details.miniplayerArtist.text(username);
		if(artwork){
			this.details.miniplayerImg.attr("src", artwork);
		}else{
			this.details.miniplayerImg.attr("src", "img/blue.png");
		}
		// .css("background-image", "url(" + result.artwork_url.replace("large", "t500x500")+ ")");
		
		
      SC.stream("/tracks/" + id, {
        autoPlay: true,
        onbufferchange: function() {
	        counter ++;
	        if(counter > 3){
	      		that.details.bottomPlayer.removeClass("loading-animation");
	      		counter = 0;
	      	}
        },
        whileplaying: function(){
          if(!that.isScrolling){
            that.details.progressBarMini.css("width", ((this.position/this.durationEstimate)*100) + '%');
			//that.details.progressBarPlayer.val((this.position/this.durationEstimate)*100);
			that.details.progressBarPlayer.val(this.position);
			that.details.time.text((that.getMinutes(this.position)));
          }
        },
        whileloading: function() {
		   //console.log(': loading ' + this.bytesLoaded + ' / ' + this.bytesTotal);
		},
		onfinish: function(){
			if((index+1) == that.collection.length){
				if(that.repeat == 1){
					that.coverPlayer.slideTo(0, 500)
				}else{
					that.pauseButton.addClass("active");
					that.details.iosplay.css("display", "block");
					that.details.equalizer.css("display", "none");
				}
				console.log("end tracks")
				//o carica altri risultati se ci sono
			}
			else{
				that.coverPlayer.slideNext()
			}
		},
        onpause: function(){
          that.details.iosplay.css("display", "block");
          that.details.equalizer.css("display", "none");
          that.pauseButton.addClass("active");
          //$(".coverTrackPlayer").addClass("blurred");

        },
        onplay: function(){
          that.details.iosplay.css("display", "none");
          that.details.equalizer.css("display", "block");
          that.pauseButton.removeClass("active");
          //$(".coverTrackPlayer").removeClass("blurred");
        },
        ondataerror: function(err){
	        console.log("streaming error")
        }

      },
      function(sound){
       currentPlayingTrack = sound;
       currentPlayingTrack.loudId = id;
      });
    },
    setLike: function(e){
	    var id = $(e.currentTarget).data("code");
	    var likes = JSON.parse(sessionStorage.getItem("likes"))
		if($(e.currentTarget).hasClass("active-button")){
		   $.ajax({
			    type: "DELETE",
			    url: "http://api.soundcloud.com/me/favorites/" + id + "?oauth_token=" + localStorage.getItem("accessToken"),
			    success: function(data){
				    _.find(likes, function(item, index){
					    if(item.id == id){
						    likes.splice(index, 1);
						    return true;
						}
					})
				    $(e.currentTarget).removeClass("active-button")
				    sessionStorage.setItem("likes", JSON.stringify(likes))
			    },
			    error: function(err){
				    console.log(err)
			    }
		    }) 
	    }else{
		    $.ajax({
			    type: "PUT",
			    url: "http://api.soundcloud.com/me/favorites/" + id + "?oauth_token=" + localStorage.getItem("accessToken"),
			    success: function(data){
				    //console.log(data)
				    likes.push(data);
				    $(e.currentTarget).addClass("active-button")
				    sessionStorage.setItem("likes", JSON.stringify(likes))
			    },
			    error: function(err){
				    console.log(err)
			    }
		    })
		    
	    }
    },
    showOptions: function(e){
	  var OptionsView = require("views/elements/options");
	  e.stopImmediatePropagation();
      var index = this.coverPlayer.activeIndex;
      this.OptionsView = new OptionsView({
            model: this.collection[index]
      });
      this.OptionsView.parent = this;
      // render the new view
      this.OptionsView.render();
      //append in the current view
	  document.body.appendChild(this.OptionsView.el);
      this.undelegateEvents();
    }
    
	

  });

  return StreamView;

});