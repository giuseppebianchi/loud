define(function(require) {

  var Backbone = require("backbone");
  var Utils = require("utils");

  var MapView = Utils.Page.extend({

    constructorName: "MapView",

    id: "map",

    initialize: function(options) {
      // when I am in the DOM, I can start adding all the Leaflet stuff
      this.listenTo(this, "inTheDOM", this.addMap);
    },

    render: function() {
      return this;
    },

    addMap: function() {

          }
  });

  return MapView;

});