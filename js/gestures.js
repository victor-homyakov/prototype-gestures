Event.supportsTouch = ("ontouchstart" in window);

var Gestures = Class.create({
  DEFAULT_OPTIONS: {
  },
  initialize: function(element, options) {
    options = Object.extend(Object.clone(this.DEFAULT_OPTIONS), options || {});
    this.element = $(element);
    this.options = options;
  }
});
