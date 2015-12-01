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
      "tap #back": "back",
      "tap #userOption": "showUserOption"
	},

    //model: UserModel,

  userId: undefined,

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
        this.firstTouch = e.touches[0].pageY;
     },
    
	  elastic: function(e){
  		if(this.enabledElastic && 
              ((e.touches[0].pageY - this.firstTouch) > 0) 
                  && this.el.children['user-scrolling-view'].scrollTop == 0){

    			//var altezza = this.elasticImage.height();
          if(this.elasticImage.height() == 430){
              this.elasticImage.children().addClass("hidden"); 
          }
    			//$(this.el).css("overflow", "hidden");			
    			this.elasticImage.css("height", (430 + ((e.touches[0].pageY - this.firstTouch)/3)) + "px");
    			e.preventDefault();

    	}else{
    			//$(this.el).css("overflow", "");
      }
	},
	resetHeight: function(e){
    this.elasticImage.children().removeClass("hidden"); 
		this.elasticImage.css({transition: "height 0.2s ease-out", height: ""});
	},
  back: function(e){
    e.stopImmediatePropagation();
    var self = this;
    $(this.el).removeClass("active");
    setTimeout(function(){self.parent.hideUser()}, 200);
  },
  showUserOption: function(){
      $("#showOption").addClass("visible");
      $("#main").addClass("blurred");
      $("#main-overlay").addClass("visible");
      // $("#main").addClass("blurred");
      // this.detail.showOption.css({display: "block", opacity: 1})
  },
  checkScroll: function(e){
      if(this.el.children['user-scrolling-view'].scrollTop > 100){
        $(this.el.children[0]).css("background", "");
        $(this.el.children[0].children[1]).css('opacity', 1);
      }else{
         $(this.el.children[0]).css("background", "transparent");
        $(this.el.children[0].children[1]).css('opacity', 0);
      }
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