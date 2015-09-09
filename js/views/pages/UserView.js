define(function(require) {
  var $ = require("jquery");
  var Backbone = require("backbone");
  //var UserModel = require("models/UserModel");
  var Utils = require("utils");

  var UserView = Utils.Page.extend({

    constructorName: "UserView",
    events:{
    	"touchstart": "startTouch",
	    "touchmove": "elastic",
	    "touchend": "resetHeight",
      "tap #back": "back"
	},

    //model: UserModel,
    
	elasticImage: undefined,
	
    initialize: function() {
      // load the precompiled template
      this.template = Utils.templates.user;
      // here we can register to inTheDOM or removing events
      // this.listenTo(this, "inTheDOM", function() {
      //   $('#content').on("swipe", function(data){
      //     console.log(data);
      //   });
      // });
      // this.listenTo(this, "removing", functionName);

      // by convention, all the inner views of a view must be stored in this.subViews
    },

    id: "User",
    
    className: "full-page",
    
    parent: undefined,

    render: function() {
      $(this.el).html(this.template(this.model));
      return this;
    },
    
    enabledElastic: true,
    
    startTouch: function(e){

     		this.elasticImage.css("transition", "");
          //this.elasticImage.children().addClass("hidden"); 
        this.firstTouch = e.touches[0].pageY;

     },
    
	  elastic: function(e){
		
		if(this.enabledElastic && ((e.touches[0].pageY - this.firstTouch) > 0) && this.el.scrollTop == 0){
			var altezza = this.elasticImage.height();
			//$(this.el).css("overflow", "hidden");			
			this.elasticImage.css("height", (300 + ((e.touches[0].pageY - this.firstTouch)/3)) + "px");
			e.preventDefault();
		}else{
			//$(this.el).css("overflow", "");
		}
		
     	
	},
	resetHeight: function(e){
    //this.elasticImage.children().removeClass("hidden"); 
		this.elasticImage.css({transition: "height 0.2s ease-out", height: ""});
		$(this.el).css("overflow", "");
		/*
		this.elasticImage.animate({height: ""}, 200, 'linear');
				$(this.el).css("overflow", "");
		*/
	},
  back: function(e){
    e.stopImmediatePropagation();
    var self = this;
    $(this.el).removeClass("active");
    setTimeout(function(){self.parent.hideUser()}, 200);
    
    
  }
  /*page.elasticImage = $("#cover-view");
              
              this.structureView.snapper.on("drag", function(){
                page.enabledElastic = false;
              });
              this.structureView.snapper.on("animated", function(){
                page.enabledElastic = true;
              });*/
	
		
	
	

    
  });

  return UserView;

});