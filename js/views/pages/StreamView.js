define(function(require) {
  var $ = require("jquery");
  var Backbone = require("backbone");
  var Handlebars = require("handlebars")
  var Utils = require("utils");
  var StreamListTrack = require("collections/StreamListTrack");
  

  var StreamView = Utils.Page.extend({

    constructorName: "StreamView",
    
    events:{	
      
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
      Handlebars.registerHelper('subString', function(string) {
        var large = string.replace("large","t500x500");
        return new Handlebars.SafeString(large)
      });

      //this.activities = JSON.parse(localStorage.getItem("activities"));

      //$(this.el).html(this.template(this.activities.collection));
      console.log(this.collection);
      $(this.el).html(this.template(this.collection.toJSON()));

      return this;
    },
    
    enabledElastic: true,
    
    startTouch: function(e){
     		this.elasticImage.css("transition", ""); 
     		this.firstTouch = e.touches[0].pageY;
     },
    
    elastic: function(e){
    	
    	if(this.enabledElastic && ((e.touches[0].pageY - this.firstTouch) > 0) && this.el.scrollTop == 0){
    		var altezza = this.elasticImage.height();
    		//$(this.el).css("overflow", "hidden");			
    		this.elasticImage.css("height", (200 + ((e.touches[0].pageY - this.firstTouch)/3)) + "px");
    		e.preventDefault();
    	}else{
    		//$(this.el).css("overflow", "");
    	}
    	
       	
    },
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
        
    }
	

  });

  return StreamView;

});