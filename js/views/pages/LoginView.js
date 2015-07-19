define(function(require) {

  var $ = require("jquery");
  var Backbone = require("backbone");
  var Utils = require("utils");

  var LoginView = Backbone.View.extend({

    constructorName: "LoginView",

    id: "LoginView",
    className: "full-page",
    events: {
	    "tap #login-button": "SCconnect"
    },

    initialize: function(options) {
      // load the precompiled template
      this.template = Utils.templates.login;
      //this.on("inTheDOM", this.rendered);
      // bind the back event to the goBack function
      //document.getElementById("back").addEventListener("back", this.goBack(), false);
    },

    render: function() {
      // load the template
      this.el.innerHTML = this.template({});
      // cache a reference to the content element
      this.contentElement = this.$el.find('#content')[0];
      return this;
    },
    
    SCconnect: function(){
	    // initiate auth popup
		SC.connect(function() {
		  SC.get('/me', function(me) {
		    localStorage.setItem("account", me);
		    Backbone.history.navigate("start", {trigger: true});
		  });
		  
		});
		
    }
    // rendered: function(e) {
    // },


  });

  return LoginView;

});