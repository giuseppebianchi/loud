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
<<<<<<< Updated upstream
      "click #menu-button": "openMenu",
      "click .item_nav_menu": "setActive"
=======
<<<<<<< HEAD
      "click #menu-button": "openMenu"
=======
      "click #menu-button": "openMenu",
      "click .item_nav_menu": "setActive"
>>>>>>> origin/gh-pages
>>>>>>> Stashed changes
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
      var account = JSON.parse(localStorage.getItem("account"));
      this.el.innerHTML = this.template({username: account.username, picture: account.avatar_url.replace("large", "t500x500")});
      // cache a reference to the content Element
      this.contentElement = this.$el.find('#content')[0];
      return this;
    },
    
    openMenu: function(){
	    this.snapper.open("left");
	    
    },
    /*setActive: function(e){
    	alert();
    	var ciao = document.getElementsByClassName("active");
    	if(ciao.length > 0){
	    	ciao[0].classList.remove("active");
    	}
	    e.currentTarget.classList.add("active");
    },*/
    setActive: function(elementId){
        try{
          document.getElementsByClassName("active")[0].classList.remove("active");
        }
        finally{
          document.getElementById(elementId).classList.add("active");
        }
          
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
					slideIntent: 20,
					minDragDistance: 40 
			});
    },
    
    // rendered: function(e) {
    // },

    
    
  });

  return StructureView;

});
