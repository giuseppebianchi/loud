define(function(require) {
  var $ = require("jquery");
  var Backbone = require("backbone");
  var Handlebars = require("handlebars")
  var Utils = require("utils");
  var StreamListTrack = require("collections/StreamCollection");
  var UserView = require("views/pages/UserView");

  var StreamView = Utils.Page.extend({

    constructorName: "StreamView",
    
    events:{	
      "tap .soundcloudArtist": "showUser",
      "tap .list-track": "playTrackStream",
      "tap .soundcloudArtist": "showUserView"
    },

    collection: StreamListTrack,
    
	  userView: undefined,
	
    initialize: function() {
      // load the precompiled template
      this.template = Utils.templates.stream;
      Handlebars.registerHelper('compare', function(v1, v2, options) {
          if(v1 == v2) {
            return options.fn(this);
          }
          return options.inverse(this);
      });
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

      this.activities = JSON.parse(localStorage.getItem("activities"));

      $(this.el).html(this.template(this.activities.collection));
      

      return this;
    },
    
    checkScroll: function(){

      if(this.scrollingView.scrollTop() == (this.contentList.height() - this.scrollingView.height())) {
       this.fetchData();
      }
    },
    fetchData: function(){
        
    },
    playTrackStream: function(e){
		$.getJSON('https://api.soundcloud.com/me?oauth_token=' + localStorage.getItem("accessToken"), function(me) {
		    console.log(me);
		});
      var selectedTrack = e.currentTarget.attributes["sctrackid"].value;
      //GET THE INDEX AND THE OBJECT WHICH CONTAINS THE SELECTED TRACK
      var result = this.findTrack(selectedTrack);

      this.player.playTrack(result[0], result[1]);
      
    },
    findTrack: function(id){
      for(var i = 0; this.activities.collection.length; i++){
        if(this.activities.collection[i].origin.id == id){
          return [this.activities.collection[i].origin, i];
          //return i;
        }
      }
    },
    showUserView: function(e){
      this.UserModel = require("models/UserModel");
      e.stopImmediatePropagation();
      var temp, self = this;
      var userId = e.currentTarget.attributes["scuserid"].value;
      
        SC.get("/users/" + userId, function(user){
          self.userView = new UserView({
            model: user
          });
          // render the new view
          self.userView.render();
          //append in the current view
          $(self.el).append(self.userView.el);

          //set options
          self.userView.elasticImage = $("#cover-user-view");

          self.userView.userScrollingView = $("#user-scrolling-view");
          self.userView.userScrollingView.bind('scroll', function (ev) {
                  self.userView.checkScroll(ev);
          });

          self.userView.parent = self;
          self.undelegateEvents();
          //translate
          //$(self.userView.el).addClass("active");
          //$(self.userView.el).css("transform", "translate3d(0, 0, 0)")
          setTimeout(function(){$(self.userView.el).addClass("active")}, 200);
        });
        
      

      
    },
    hideUser: function(){ //fired from UserView
      this.delegateEvents();
      this.userView.close();
      this.userView = null;
    }
    
    
    
	

  });

  return StreamView;

});