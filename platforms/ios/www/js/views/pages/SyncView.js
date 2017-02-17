define(function(require) {

  var $ = require("jquery");
  var Backbone = require("backbone");
  var Utils = require("utils");
  var Snap = require("snap");
  var Handlebars = require("handlebars");

  var StructureView = Backbone.View.extend({

    constructorName: "StructureView",

    id: "sync",
    
	  className: "fadeEffect",
	
    events: {
      
    },
    initialize: function(options) {
      // load the precompiled template
      this.template = Utils.templates.sync;
	  //this.on("inTheDOM", this.rendered);
      // bind the back event to the goBack function
      //document.getElementById("back").addEventListener("back", this.goBack(), false);
    },

    player: null,
    
    currentView: null,
	
	following: [],
	
	likes: [],
	
	playlists: [],
	
	likedPlaylists:[], 
	
	count: 0,
	
	followingNext: null,
	
	playlistsNext: null,
	
	likedPlaylistsNext: null,
	
	likesNext: null,
	
    render: function() {
      // load the template
      this.el.innerHTML = this.template();
      // cache a reference to the content Element
      this.contentElement = this.$el.find('#content')[0];
      return this;
    },
    getData: function(){
	    this.progress = $("#sync-progress");
	    this.getFollowing();
	    this.getLikes();
	    this.getPlaylists();
	    this.getLikedPlaylists();
    },
    getFollowing: function(){
	    var that = this;
	    $.getJSON("https://api.soundcloud.com/me/followings?linked_partitioning=1&limit=200&oauth_token=" + localStorage.getItem("accessToken"), function(data, state){
		  if(state == "success"){
			//console.log(data);
		  	that.following = that.following.concat(data.collection)
		  	that.followingNext = data.next_href;
		  	that.addProgressWidth();
		  	that.getFollowingNext();
		  }else{
			 console.log("Ops something went wrong");
		  }
	  })
	  //var likes = $.getJSON("https://api.soundcloud.com/me/favorites?oauth_token=" + localStorage.getItem("accessToken"))
    },
    getFollowingNext: function(){
	    var that = this;
	    if(this.followingNext){
		    $.getJSON(this.followingNext, function(data, state){
				if(state == "success"){
					//console.log(data);
				 	that.following = that.following.concat(data.collection);
				 	that.followingNext = data.next_href;
				 	that.getFollowingNext();
			  	}else{
				 console.log("Ops something went wrong")
			  	}
			});
		}else{
			that.addProgressWidth();
			sessionStorage.setItem("following", JSON.stringify(this.following));
			that.promise();
			
		}
	},
	getLikes: function(){
	    var that = this;
	    $.getJSON("https://api.soundcloud.com/me/favorites?linked_partitioning=1&limit=200&oauth_token=" + localStorage.getItem("accessToken"), function(data, state){
		  if(state == "success"){
			//console.log(data);
		  	that.likes = that.likes.concat(data.collection)
		  	that.likesNext = data.next_href;
		  	that.addProgressWidth();
		  	that.getLikesNext();
		  }else{
			 console.log("Ops something went wrong")
		  }
	  });
    },
    getLikesNext: function(){
	    var that = this;
	    if(this.likesNext){
		    $.getJSON(this.likesNext, function(data, state){
				if(state == "success"){
					//console.log(data);
				 	that.likes = that.likes.concat(data.collection);
				 	that.likesNext = data.next_href;
				 	that.getLikesNext();
			  	}else{
				 console.log("Ops something went wrong")
			  	}
			});
		}else{
			that.addProgressWidth();
			sessionStorage.setItem("likes", JSON.stringify(this.likes));
			that.promise();
			
		}
	},
	getLikedPlaylists: function(){
	    var that = this;
	    $.getJSON("https://api.soundcloud.com/e1/me/playlist_likes?representation=compact&linked_partitioning=1&limit=200&oauth_token=" + localStorage.getItem("accessToken"), function(data, state){
		  if(state == "success"){
			//console.log(data);
		  	that.likedPlaylists = that.likedPlaylists.concat(data.collection)
		  	that.likedPlaylistsNext = data.next_href;
		  	that.addProgressWidth();
		  	that.getLikedPlaylistsNext();
		  }else{
			 console.log("Ops something went wrong")
		  }
	  })
    },
    getLikedPlaylistsNext: function(){
	    var that = this;
	    if(this.likedPlaylistsNext){
		    $.getJSON(this.likedPlaylistsNext, function(data, state){
				if(state == "success"){
					//console.log(data);
				 	that.likedPlaylists = that.likedPlaylists.concat(data.collection);
				 	that.likedPlaylistsNext = data.next_href;
				 	that.getLikedPlaylistsNext();
			  	}else{
				 console.log("Ops something went wrong")
			  	}
			});
		}else{
			that.addProgressWidth();
			sessionStorage.setItem("likedPlaylists", JSON.stringify(this.likedPlaylists));
			that.promise();
			
		}
	},
	getPlaylists: function(){
	    var that = this;
	    $.getJSON("https://api.soundcloud.com/me/playlists?linked_partitioning=1&limit=200&oauth_token=" + localStorage.getItem("accessToken"), function(data, state){
		  if(state == "success"){
			//console.log(data);
		  	that.playlists = that.playlists.concat(data.collection)
		  	that.playlistsNext = data.next_href;
		  	that.addProgressWidth();
		  	that.getPlaylistsNext();
		  }else{
			 console.log("Ops something went wrong")
		  }
	  })
    },
    getPlaylistsNext: function(){
	    var that = this;
	    if(this.playlistsNext){
		    $.getJSON(this.playlistsNext, function(data, state){
				if(state == "success"){
					//console.log(data);
				 	that.playlists = that.playlists.concat(data.collection);
				 	that.playlistsNext = data.next_href;
				 	that.getLikesNext();
			  	}else{
				 console.log("Ops something went wrong")
			  	}
			});
		}else{
			that.addProgressWidth();
			sessionStorage.setItem("playlists", JSON.stringify(this.playlists));
			that.promise();
			
		}
	},
	addProgressWidth: function(){
		var w = this.progress.data("width");
		w = w + 12.5;
		this.progress.css("width", w + "%");
		this.progress.data("width", w);
	},
	promise: function(){
		this.count++;
		if(this.count > 3){
			Backbone.history.navigate("start", {trigger:true});
		}
	}
  });

  return StructureView;

});