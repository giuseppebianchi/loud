define(function(require) {
  var $ = require("jquery");
  var Backbone = require("backbone");
  var TrackModel = require("models/TrackModel");
  var Utils = require("utils");

  var HomeView = Utils.Page.extend({

    constructorName: "HomeView",
    events:{
	    "touchmove": "elastic",
	    "touchend": "resetHeight",
	    "scroll": "checkScroll"
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
    elastic: function(e){
    	var altezza = this.elasticImage.css("height");
     	if(this.el.scrollTop == 0){
		    this.elasticImage.css("height", (parseInt(altezza.replace(/px/, ""))+2)+"px");
	    }
		//e.touches[0].pageY
	},
	resetHeight: function(){
		this.elasticImage.animate({height: ""}, 200, 'ease-out');
	},
	checkScroll: function(){
		if(this.el.scrollTop > 0 && this.el.scrollTop < 10){
			this.resetHeight();
		}
	}
	 /*
elastic: function(){
	 	
	 	var dim = this.elasticImage.css("transform");
	 	dim = dim.replace("scale(", "");
	 	dim = parseInt(dim.replace(")", ""));
	 	var result = this.addNumbers(dim, 0.1);
	 	if(this.el.scrollTop == 0){
		    this.elasticImage.css("transform", "scale("+ result + ")"});
	    }
		//e.touches[0].pageY
	},
	
	resetHeight: function(){
		this.elasticImage.animate({transform: 'scale(1)'}, 200, 'ease-out');
	},
	addNumbers: function (PrmFirstNumber, PrmSecondNumber){

        if(isNaN(PrmFirstNumber) || isNaN(PrmSecondNumber)){

            return NaN;

        }

        else

        {

            return Number(PrmFirstNumber) + Number(PrmSecondNumber);

        }

    }
*/
    
  });

  return HomeView;

});