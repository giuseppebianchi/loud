define(function(require) {
  var $ = require("jquery");
  var Backbone = require("backbone");
  var Handlebars = require("handlebars");
  var Blazy = require("blazy");
  var Utils = require("utils");
  
  var UserView = require("views/pages/UserView");

  var StreamView = Utils.Page.extend({

    constructorName: "DiscoverView",
    
    events:{
	    "tap #login-button": "goToSync"
    },
    
	userView: undefined,
	
    initialize: function() {
      // load the precompiled template
      this.template = Utils.templates.welcome;
    },

    id: "Welcome",
    
    className: "full-page",

    activities: null,
    
    scrollingView: null,

    contentList: null,
	
	loadingContents: false,
	
    render: function() {
		var that = this;
		this.model.fetch({
		  success: function(account){
			  that.el.innerHTML = that.template(account.attributes);
			      // cache a reference to the content Element
			    that.contentElement = that.$el.find('#content')[0];
				//localStorage.setItem("account", JSON.stringify(account));
				
				//initialize lazy loading library
				that.bLazy = new Blazy({ 
					container: '#discover-scrolling-view'
				});
		  }
		})
      

      return this;
    },
    goToSync: function(){
	    localStorage.setItem("account", JSON.stringify(this.model.attributes));
	    Backbone.history.navigate("sync", {trigger:true, params: "welcome"});
    }
    
    
    
	

  });

  return StreamView;

});