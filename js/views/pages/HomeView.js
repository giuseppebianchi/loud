define(function(require) {

  var Backbone = require("backbone");
  var TrackModel = require("models/TrackModel");
  var Utils = require("utils");

  var HomeView = Utils.Page.extend({

    constructorName: "HomeView",

    model: TrackModel,

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

    id: "Home",
    className: "i-g page",

    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
      return this;
    }
    
  });

  return HomeView;

});