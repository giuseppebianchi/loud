define(function(require) {
  var $ = require("jquery");
  var Backbone = require("backbone");
  var Handlebars = require("handlebars");
  var _ = require("underscore")
  var Utils = require("utils");
  var Swiper = require("swiper");

  var PlayerView = Utils.Page.extend({

    constructorName: "player",
    
    events:{	
      //"tap #chiudiplayer": "closePlayer",
      "swipeDown": "closePlayer",
      "swipeUp": "closePlayer",
      "touchstart .progressBarPlayer": "seekTrack",
      "touchend .progressBarPlayer": "seekTrackEnd",
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
	  var that = this;
	  Handlebars.registerHelper('getMinutes', function(duration) {
	      
	      var result = that.getMinutes(duration);
	       
	      return new Handlebars.SafeString(result);
	    });
	    
      // load the precompiled template
      this.template = Utils.templates.player;
      this.templateSlide = Utils.templates.slides;
      
      /* these are boolean value */
      this.shuffle = localStorage.getItem("shuffle");
      this.repeat = localStorage.getItem("repeat");
      this.likes = sessionStorage.getItem("likes");
      // VARIABILE GLOBALE
      audio = $("#audioPlayer")
		      	.bind('play', function(e) {
			      	that.details.iosplay.css("display", "none");
				  	that.details.equalizer.css("display", "block");
				  	that.pauseButton.removeClass("active");
				  	//$(".coverTrackPlayer").removeClass("blurred");
		        })
		        .bind('pause', function() {
		            that.details.iosplay.css("display", "block");
					that.details.equalizer.css("display", "none");
					that.pauseButton.addClass("active");
					//$(".coverTrackPlayer").addClass("blurred");
		        })
		        .bind('ended', function() {
		            console.log("ended")
		            if((that.index+1) == that.collection.length){
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
		        })
		        .bind('loadeddata', function() {
			        console.log("load");
		            that.details.bottomPlayer.removeClass("loading-animation");
		            
		        })
		        /*.bind('progress', function() {
		            //console.log("progress")
		        })*/
		        .bind('timeupdate', function() {
		            //console.log("timeupdate")
		            if(!that.isScrolling){
			            that.details.progressBarMini.css("width", ((this.currentTime/this.duration)*100) + '%');
						//that.details.progressBarPlayer.val((this.position/this.durationEstimate)*100);
						that.details.progressBarPlayer.val(this.currentTime*1000);
						that.details.time.text((that.getMinutes(this.currentTime*1000)));
			        }
		        })
		        .bind('waiting', function() {
		            console.log("waiting")
		            that.details.bottomPlayer.addClass("loading-animation-after")
			            
		            
		        })
		        .bind('playing', function(){
			        console.log("playing")
			        that.details.bottomPlayer.removeClass("loading-animation-after");
		        })
		        .bind('seeked', function() {
		            console.log("seeked")
		            that.isScrolling = false;
		            //that.details.bottomPlayer.removeClass("loading-animation-after");
		        })
		        .get(0);
		audio.title = "LOUD";
				
		document.addEventListener("remote-event", function(e) {
           e.preventDefault();
           e.stopImmediatePropagation();
           switch(e.remoteEvent.subtype){
	       case "play": that.updateControlCenter();
           break;
           case "nextTrack": that.coverPlayer.slideNext(true, 0);
           console.log("nextTrack");
                            break;
           case "prevTrack": that.coverPlayer.slidePrev(true, 0);
           console.log("prevTrack");
                                break;
        	}
        })
       
      this.alertBox = $("#alert-box")
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
    
    currentPlayingTrack: {
	 	id: null,
	 	title: null,
	 	username: null,
	 	artwork: null,
	 	stream: null
	},
    
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
	    this.showAlert("<span>Sorry!</span> This features will be available soon")
		//this.removeTrackFromPlayer(this.coverPlayer.activeIndex + 1, this.collection.length);
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
	              if(that.currentPlayingTrack.id !== null){
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
	              if(typeof that.playingView !== 'undefined' && that.playingView.fetchData){
			              that.playingView.loadingContents = true;
			              that.playingView.fetchData();
			              that.rendered = false;
		          }
              }
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
      audio.currentTime = position/1000;
      this.coverPlayer.attachEvents();
    },
    update_time_while_scrolling_bar: function(e){
	    this.details.time.text(this.getMinutes(e.target.value));
    },
    playPlause: function(e){
      e.stopImmediatePropagation();
      if(audio.paused == false){
	      audio.pause();
      }else{
	      audio.play();
      }
    },
    updateControlCenter: function(){
     var params = [this.currentPlayingTrack.username, this.currentPlayingTrack.title, "LOUD", this.currentPlayingTrack.artwork.replace("large", "t300x300"), audio.duration, audio.currentTime];
     window.remoteControls.updateMetas(
     							function(success){
                                    console.log(success);
                                }, 
                                function(fail){
                                    console.log(fail);
                                },
     params);
     
     },
    prepareTrack: function(id, view){
	    if(view === this.playingView && id == this.currentPlayingTrack.id){
				this.openPlayer();
				return false;
			}
	    
	    /* FIND INDEX IN PLAYER COLLECTION FOR SLIDER */
	    
		var that = this;
		
			_.find(this.collection, function(t, i){
				if(t.id == id){
					if(!t.stream_url){ //some tracks can't be played
						that.showAlert("<span>No stream</span> available for this <span>track</span>")
						//alertbox
						return false;
					}
					if(i == 0){
						that.coverPlayer.slideNext(false, 0)
					}
					that.coverPlayer.slideTo(i, 0, false); /* false value disable the OnSlideChangeEnd Callback */
					that.playTrack(id, i, view)
					return true
				}
			});
		
		
    },
    playTrack: function(id, index, view){
	    this.index = index;
	    var that = this;

		this.currentPlayingTrack.stream = this.collection[index].stream_url
		
		if(this.currentPlayingTrack.stream){ //some tracks can't be played
			audio.src = this.currentPlayingTrack.stream + "?client_id=2aca68b7dc8b51ec1b20fda09b59bc9a";
		}else{
			this.showAlert("<span>No stream</span> available for this <span>track</span>")
			//alertbox
			this.coverPlayer.slideNext();
			return false;
		}
		
		this.currentPlayingTrack.title = this.collection[index].title;
		this.currentPlayingTrack.username = this.collection[index].user.username;
		this.currentPlayingTrack.artwork = this.collection[index].artwork_url;
			
		if (this.currentPlayingTrack.id === null) {
			this.details.miniplayer.addClass("open");
		}
		this.details.progressBarMini.css("width", 0);
		//this.details.progressBarPlayer = $(this.coverPlayer.slides[index][0]).find(".progressBarPlayer");
		//this.details.time = $(this.coverPlayer.slides[index]).find(".currentTimeTrack");
		//this.details.bottomPlayer = $(this.coverPlayer.slides[index]).find(".bottom-player");
		this.details.progressBarPlayer = $(".swiper-slide-active .progressBarPlayer");
		this.details.time = $(".swiper-slide-active .currentTimeTrack");
		this.details.bottomPlayer = $(".swiper-slide-active .bottom-player");
		this.details.bottomPlayer.addClass("loading-animation");
		
		/* SET MINIPLAYER DATA */
		this.details.miniplayerTitle.text(this.currentPlayingTrack.title);
		this.details.miniplayerArtist.text(this.currentPlayingTrack.username);
		if(this.currentPlayingTrack.artwork){
			this.details.miniplayerImg.attr("src", this.currentPlayingTrack.artwork);
		}else{
			this.details.miniplayerImg.attr("src", "img/blue.png");
		}
		// .css("background-image", "url(" + result.artwork_url.replace("large", "t500x500")+ ")");

		audio.play();
		this.currentPlayingTrack.id = id;
      
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
    },
    showAlert: function(msg){
	    var that = this;
	    this.alertBox.html(msg).addClass("visible");
	    this.alertBox.one('webkitAnimationEnd animationend', function(e) {
			that.alertBox.removeClass('visible');
    	});
    },
    
	

  });

  return PlayerView;

});