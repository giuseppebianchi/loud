define(function(require) {

  var $ = require("jquery");
  var Backbone = require("backbone");
  var Utils = require("utils");
  var Snap = require("snap");

  var StructureView = Backbone.View.extend({

    constructorName: "StructureView",

    id: "main",
    
	className: "fadeEffect",
	
    events: {
      "click #menu-button": "openMenu"
    },
    initialize: function(options) {
      // load the precompiled template
      this.template = Utils.templates.structure;
     
					
      //this.on("inTheDOM", this.rendered);
      // bind the back event to the goBack function
      //document.getElementById("back").addEventListener("back", this.goBack(), false);
    },

    render: function() {
      // load the template
      this.el.innerHTML = this.template({});
      // cache a reference to the content Element
      this.contentElement = this.$el.find('#content')[0];
      return this;
    },
    
    openMenu: function(){
	    this.snapper.open("left");
	    
    },
    initializeMenu: function(){

	     this.snapper = new Snap({
					element: document.getElementById('content'),
					disable: "right",
					addBodyClasses: true,
					resistance: 0.5,
					flickThreshold: 10,
					transitionSpeed: 0.3,
					tapToClose: true,
					touchToDrag: true,
					slideIntent: 10,
					minDragDistance: 40 
			});
    },
    
    // rendered: function(e) {
    // },

    setActiveTabBarElement: function(elementId) {
      // here we assume that at any time at least one tab bar element is active
      //document.getElementsByClassName("active")[0].classList.remove("active");
      //document.getElementById(elementId).classList.add("active");
    }
    
  });

  return StructureView;

});