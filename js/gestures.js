/**
 * Licensed under the MIT license.
 */
Event.supportsTouch = ("ontouchstart" in window);
// TODO Event.supportsTouch = Event.isSupported("ontouchstart", window);
// Exceptions:
//   Windows Phone 7.5 does not support touch events
//   Android (until 4.X?) does not support multitouch, there is always 1 touch, i.e. no zoom and rotation

var Gestures = Class.create(Mixin.Observable, {
  DEFAULT_OPTIONS: {
    // true to prevent default action for touch event
    // preventDefault=false may lead to strange behavior (default event and gesture simultaneously)
    preventDefault: false,

    // hold gesture enabled
    holdEnabled: true,
    // timeout in seconds to activate gesture
    holdTimeout: 0.5
  },

  prebind: ["handleTouchStart", "handleTouchMove", "handleTouchEnd", "handleMouseOut"],

  initialize: function(element, options) {
    options = Object.extend(Object.clone(this.DEFAULT_OPTIONS), options || {});
    this.element = $(element);
    this.options = options;

    this.pos = {};
    this.offset = {};

    this.observeElement();
  },

  destroy: function() {
    this.stopObservingElement();
    this.element = null;
  },

  observeElement: Event.supportsTouch ? function() {
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

  stopObservingElement: Event.supportsTouch ? function() {
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

  /**
   * Handle touchstart and mousedown events. Fire "hold" gesture.
   */
  handleTouchStart: function(event) {
    this.pos.start = this.getEventPos(event);
    this.touchStartTime = new Date().getTime();
    this.fingers = this.countFingers(event);
    this.first = true;
    this.eventStart = event;

    /*
     var offset = this.element.viewportOffset(), scroll = document.viewport.getScrollOffsets();
     this.offset = {
     top: offset.top + scroll.y,
     left: offset.left + scroll.x
     };
     */
    this.offset = Element.cumulativeOffset(this.element);
    this.mousedown = true;

    console.log("handleTouchStart", event, this.pos.start, this.offset);
    // detect "hold" gesture
    this.detectHold(event);

    if (this.options.preventDefault) {
      Event.stop(event);
    }
  },

  handleTouchMove: function(event) {
    // TODO
    //console.log("handleTouchMove", event);
  },

  handleTouchEnd: function(event) {
    // TODO
    console.log("handleTouchEnd", event);
  },

  handleMouseOut: function(event) {
    console.log("handleMouseOut", event);
    // event.relatedTarget - W3C, event.toElement - IE
    // Prototype provides unified event.relatedTarget
    if (!event.relatedTarget || !Element.descendantOf(event.relatedTarget, this.element)) {
      this.handleTouchEnd(event);
    }
  },

  // Event details

  /**
   * Get coordinates of each touch in event.
   * @param {Event} event
   * @return {Array} of points (int x, int y)
   */
  getEventPos: Event.supportsTouch ? function(event) {
    // multitouch, return array with positions
    var pos = [];
    for (var t = 0, len = event.touches.length; t < len; t++) {
      var src = event.touches[t];
      pos.push({
        x: src.pageX,
        y: src.pageY
      });
    }
    return pos;
  } : function(event) {
    // no touches, use the event pageX and pageY
    return [{
      x: event.pageX,
      y: event.pageY
    }];
  },

  /**
   * Count the number of fingers (touches) in the event.
   * When no fingers are detected, one finger is returned (mouse pointer).
   * @param {Event} event
   * @return {Number} fingers
   */
  countFingers: function(event) {
    // Android (until v4?) does not support event.touches
    return event.touches ? event.touches.length : 1;
  },

  // Detect and fire gestures

  notifyGesture: function(eventName, params) {
    params.touches = this.getEventPos(params.originalEvent);
    params.type = eventName;
    this.notify(eventName, params);
  },

  /**
   * Hold gesture detection - fired by handleTouchStart.
   */
  detectHold: function(event) {
    // TODO
    // only when one finger is on the screen
    if (this.options.holdEnabled) {
      this.gesture = "hold";
      clearTimeout(this.holdTimer);
      this.holdTimer = (function(event, pos) {
        if (this.gesture === "hold") {
          this.notifyGesture("hold", {
            originalEvent: event,
            position: pos.start
          });
        }
      }).bind(this, event, this.pos).delay(this.options.holdTimeout);
    }
  }
});
