define(function(require) {
  var $ = require("jquery");
  var Backbone = require("backbone");
  var TrackModel = require("models/TrackModel");
  var Utils = require("utils");

  var HomeView = Utils.Page.extend({

    constructorName: "HomeView",
    events:{
    	"touchstart": "startTouch",
	    "touchmove": "elastic",
	    "touchend": "resetHeight"
	},

    model: TrackModel,
    
	elasticImage: undefined,
	
    initialize: function() {
      // load the precompiled template
      this.template = Utils.templates.home;
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
    
    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
      
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
	
		
	
	

    
  });

  return HomeView;

});