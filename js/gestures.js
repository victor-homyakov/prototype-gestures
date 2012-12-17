/**
 * Licensed under the MIT license.
 */
Event.supportsTouch = ("ontouchstart" in window);
// TODO Event.supportsTouch = Event.isSupported("ontouchstart", window);
// Exception: Windows Phone 7.5 does not support touch events

var Gestures = Class.create({
  DEFAULT_OPTIONS: {
  },

  prebind: ["handleTouchStart", "handleTouchMove", "handleTouchEnd", "handleMouseOut"],

  initialize: function(element, options) {
    options = Object.extend(Object.clone(this.DEFAULT_OPTIONS), options || {});
    this.element = $(element);
    this.options = options;

    this.pos = {};
    this.offset = {};

    this.observe();
  },

  destroy: function() {
    this.stopObserving();
  },

  observe: Event.supportsTouch ? function() {
    // for touch devices
    var e = this.element;
    e.observe("touchstart", this.handleTouchStart);
    e.observe("touchmove", this.handleTouchMove);
    e.observe("touchend", this.handleTouchEnd);
    e.observe("touchcancel", this.handleTouchEnd);
  } : function() {
    // for non-touch devices
    var e = this.element;
    e.observe("mousedown", this.handleTouchStart);
    e.observe("mousemove", this.handleTouchMove);
    e.observe("mouseup", this.handleTouchEnd);
    e.observe("mouseout", this.handleMouseOut);
  },

  stopObserving: Event.supportsTouch ? function() {
    var e = this.element;
    e.stopObserving("touchstart", this.handleTouchStart);
    e.stopObserving("touchmove", this.handleTouchMove);
    e.stopObserving("touchend", this.handleTouchEnd);
    e.stopObserving("touchcancel", this.handleTouchEnd);
  } : function() {
    // for non-touch devices
    var e = this.element;
    e.stopObserving("mousedown", this.handleTouchStart);
    e.stopObserving("mousemove", this.handleTouchMove);
    e.stopObserving("mouseup", this.handleTouchEnd);
    e.stopObserving("mouseout", this.handleMouseOut);
  },

  handleTouchStart: function(event) {
    // TODO
    console.log("handleTouchStart", event);
  },

  handleTouchMove: function(event) {
    // TODO
    console.log("handleTouchMove", event);
  },

  handleTouchEnd: function(event) {
    // TODO
    console.log("handleTouchEnd", event);
  },

  handleMouseOut: function(event) {
    // TODO
    console.log("handleMouseOut", event);
  }
});
