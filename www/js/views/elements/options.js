define(function(require) {
  var $ = require("jquery");
  var Backbone = require("backbone");
  var _ = require("underscore");
  var Utils = require("utils");
  var pouchCollate = require('pouchdbCollate');
  var OptionsView = Utils.Page.extend({

    constructorName: "OptionsView",
    
    events:{
	    "tap #cancel-option": "hide",
	    "tap #copy-link": "copyLink",
	    "tap #tweet": "tweet",
	    "tap #add-track-to-playlist": "addTrackToPlaylist",
	    "tap #remove-vanish-first": "removeVanishFirst",
	    "tap #remove-vanish-second": "removeVanishSecond",
	    "tap #new-playlist": "newPlaylist",
	    "tap #create-playlist": "createPlaylist",
	    "tap #remove-new-playlist-view": "removePlaylistView",
	    "tap .add-to-this": "selectedPlaylist",
	    "tap #set-discover-track": "setDiscoverTrack",
	    "tap #add-to-your-playlists": "addPlaylistToPlaylists",
	    "tap #create-playlist-from-playlist": "createFromPlaylist",
	    "tap #add-track-to-library-form": "addToLibraryForm",
	    "tap #add-track-to-library": "addToLibrary",
	    "submit #new-track-form": "hideKeyboard"
	    
	},
	
    initialize: function(options) {
	    // load the precompiled template
		this.template = Utils.templates.options;
		this.model.LastArtist = sessionStorage.getItem("LastArtist");
		this.model.LastAlbum = sessionStorage.getItem("LastAlbum")
    },
    
    tagName: "div",
    
    className: "options-modal",
    
    parent: undefined,

    render: function() {
	    var that = this;
	    this.model.myPlaylists = JSON.parse(sessionStorage.getItem("playlists"));
	    this.$el.html(this.template(this.model));
	    //this.main = $("#main")
		//this.main.addClass("blurred")
		this.alertBox = $("#alert-box")
		setTimeout(function(){that.$el.addClass("visible");}, 200);

      return this;
    },
    hide: function(){
	    var self = this;
	    //this.main.removeClass("blurred")
	    $(this.el).removeClass("visible");
	    setTimeout(function(){self.hidePage()}, 200);
  	},
  	hidePage: function(){ //fired from UserView
      this.parent.delegateEvents();
      this.close();
    },
    hideKeyboard: function(e){
	    e.preventDefault();
	    alert();
	    cordova.plugins.Keyboard.close();
    },
    showAlert: function(msg){
	    var that = this;
	    this.alertBox.html(msg).addClass("visible");
	    this.alertBox.one('webkitAnimationEnd animationend', function(e) {
			that.alertBox.removeClass('visible');
    	});
    },
    copyLink: function(e){
	    e.stopImmediatePropagation();
	    cordova.plugins.clipboard.copy(this.model.permalink_url);
	    this.showAlert("Copied to your <span>Clipboard</span>");
    },
    tweet: function(){
	    var title = "I'm listening to ";
	    if(this.model.username){
		    title += this.model.username;
	    }else{
		    title += this.model.title;
	    }
	    title += " via @LOUD_app";
	    window.plugins.socialsharing.shareViaTwitter(title, null, this.model.permalink_url)
    },
    addTrackToPlaylist: function(e){
	    //this.currentTarget = $(e.currentTarget)
	    //var pixels = this.$el.find(".bullet-section").scrollTop() - 140;
        //$(e.currentTarget).css({"-webkit-transform": "translateY(" + pixels + "px)"});
	    this.$el.addClass("vanish-first");
    },
    addPlaylistToPlaylists: function(e){
	    this.$el.addClass("vanish-first");
    },
    selectedPlaylist: function(e){
	    e.stopImmediatePropagation();
	    var idPlaylist = $(e.currentTarget).data("code");
	    var that = this, index;
	    var playlists = JSON.parse(sessionStorage.getItem("playlists"))
		_.find(playlists, function(t, i){
			if(t.id == idPlaylist){
				t.tracks.push({id: that.model.id})
				index = i;
				t.track_count = t.track_count + 1;
				return;
			}
		});
	    SC.put('/playlists/' + idPlaylist, {	playlist: { tracks: playlists[index].tracks}}, function(response){
		    if(response){
			 
		     sessionStorage.setItem("playlists", JSON.stringify(playlists));
		     that.$el.removeClass("vanish-first");
		     that.showAlert("Track was added to <span>" + playlists[index].title + "</span> playlist");
		    }else{
			    console.log("errore")
		    }
		});
    },
    removeVanishFirst: function(){
	    //this.currentTarget.attr("style", "");
	    this.$el.removeClass("vanish-first").removeClass("new-playlist-view");
    },
    removeVanishSecond: function(){
	    //this.currentTarget.attr("style", "");
	    this.$el.removeClass("vanish-second");
    },
    newPlaylist: function(){
	    this.$el.addClass("new-playlist-view")
    },
    removePlaylistView: function(){
	    this.$el.removeClass("new-playlist-view")
    },
    createPlaylist: function(){
	    //console.log(this.model)
	    var that = this;
	    var title = $("#new-playlist-input").val();
	    var track = this.model.id;
	    var playlists = JSON.parse(sessionStorage.getItem("playlists"))
	    SC.post('/playlists', {	playlist: { title: title, tracks: [{id: track}]}}, function(response){
		    if(response){
		     playlists.unshift(response);
		     sessionStorage.setItem("playlists", JSON.stringify(playlists));
		     that.$el.removeClass("vanish-first").removeClass("new-playlist-view");
		     that.showAlert("Track was added to <span>" + title + "</span> playlist");
		    }else{
			    console.log("errore")
		    }
		});
    },
    createFromPlaylist: function(){
	    //console.log(this.model)
	    var that = this;
	    var title
	    if($("#new-playlist-input").val().length > 0){
	    	title = $("#new-playlist-input").val();
	    }else{
		    title = "New LOUD Playlist"
	    }
	    var playlists = JSON.parse(sessionStorage.getItem("playlists"))
	    SC.post('/playlists', {	playlist: { title: title, tracks: this.model.tracks}}, function(response){
		    if(response){
		     playlists.unshift(response);
		     sessionStorage.setItem("playlists", JSON.stringify(playlists));
		     that.$el.removeClass("vanish-first").removeClass("new-playlist-view");
		     that.showAlert("Playlist was added to your <span>Collection</span>");
		    }else{
			    console.log("errore")
		    }
		});
    },
    setDiscoverTrack: function(){
	    localStorage.setItem("discover", JSON.stringify(this.model));
	    this.showAlert('Track was set as <span>Discover</span> track');
    },
    addToLibraryForm: function(){
	    this.$el.addClass("vanish-second");
	},
	addToLibrary: function(){
		cordova.plugins.Keyboard.close();
		var that = this;
	    var form = $('#new-track-form input');
	    
	    //controllo se è stato inserito il titolo
	    if(form[0].value.length == 0){
		    this.showAlert('Please insert a <span>Title</span>');
		    return false;
	    }
	    
	    var titleLoud = form[0].value;
		var idLoud = new Date().getTime() + '';
	    
	    var artistLoud;
	    
	    if(form[1].value.length > 0){
	    	artistLoud = form[1].value;
	    }else{
		    artistLoud = "Unknown";
	    }
		    
	    
	    var albumLoud;
	    if(form[2].value.length > 0){
	    	albumLoud = form[2].value;
	    }else{
		    albumLoud = "Unknown";
	    }
	    
	    if(localStorage.getItem("SaveLastArtist") == 1){
		    sessionStorage.setItem("LastArtist", form[1].value)
	    }
	    if(localStorage.getItem("SaveLastAlbum") == 1){
		    sessionStorage.setItem("LastAlbum", form[2].value)
	    }
	    
	    //var labelLoud = "Desolat";
		var idAlbum = "" + pouchCollate.toIndexableString(artistLoud) + "" + pouchCollate.toIndexableString(albumLoud);
		
		var content = this.model;
		
		delete content.myPlaylists;
		
	    var track = {
		    "_id": idLoud,
		    "title": titleLoud,
		    "artist": artistLoud,
		    "album": idAlbum,
		    "albumTitle": albumLoud,
		    "label": "",
		    "content": content
	    };
	    
	    dbTracks.put(track).then(function (response) {
		  // handle response
		  that.showAlert('<span>Track</span> has been added');
		  that.removeVanishSecond();
		}).catch(function (err) {
		  that.showAlert('<span>Ops! Something went wrong</span> ');
		});
	    

	    
    }
 });

  return OptionsView;

});