define(function(require) {

  var $ = require("jquery");
  var Backbone = require("backbone");
  var Utils = require("utils");
  
  var LoginView = Backbone.View.extend({

    constructorName: "LoginView",

    id: "LoginView",
    
    className: "full-page fadeEffect",
    
    events: {
	    "click #login-button": "SCconnect"
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
      ref = cordova.InAppBrowser.open('https://soundcloud.com/connect?client_id=2aca68b7dc8b51ec1b20fda09b59bc9a&redirect_uri=loudapp://soundcloud&response_type=token&scope=non-expiring', '_system', 'location=yes');
	    // initiate auth popup
		// SC.connect(function() {
		//   SC.get('/me', function(me) {
		// 	console.log(me);
		// 	localStorage.setItem("accessToken", SC.accessToken());
		//     localStorage.setItem("account", JSON.stringify(me));
		//     Backbone.history.navigate("start", {trigger: true});
		//   });
		  
		// });
		
    }
    // rendered: function(e) {
    // },


  });

  return LoginView;

});