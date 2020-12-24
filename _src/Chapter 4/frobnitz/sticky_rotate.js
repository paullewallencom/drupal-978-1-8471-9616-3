// $Id$
/**
 * Rotate through all sticky nodes, using
 * jQuery effects to display them.
 */

// Our namespace:
var StickyRotate = StickyRotate || {};

/**
 * Initialize the sticky rotation.
 */
StickyRotate.init = function() {
  var stickies = $('.sticky');
   
  // If we don't have enough, stop immediately.
  if (stickies.size() <= 1 || $('#node-form').size() > 0) {
    console.log("FOO");
    return;
  }
  console.log("BAR");
  
  var highest = 100;
  stickies.each(function () {
    var stickyHeight = $(this).height();
    if(stickyHeight > highest) {
      highest = stickyHeight;
    }
  });
  /* Same thing in a more traditional way:
  var stickyHeight;
  for (i = 0; i < stickies.size(); ++i ) {
    stickyHeight = $(stickies.get(i)).height()
    if (stickyHeight > highest) {
      highest = stickyHeight;
    }
  }
  */

  stickies.hide().css('height', highest + 'px');
  StickyRotate.counter = 0;
  StickyRotate.stickies = stickies;

  stickies.eq(0).fadeIn('slow');
  setInterval(StickyRotate.periodicRefresh, 7000);
};

/**
 * Callback function to change show a new sticky.
 */
StickyRotate.periodicRefresh = function () {
  var stickies = StickyRotate.stickies;
  var count  = StickyRotate.counter;
  var lastSticky = stickies.size() - 1;
  
  var newcount;
  if (count == lastSticky) {
    newcount = StickyRotate.counter = 0;
  }
  else {
    newcount = StickyRotate.counter = count + 1;
  }
  
  stickies.eq(count).fadeOut('slow', function () {
    stickies.eq(newcount).fadeIn('slow');
  });
  
  // Don't do this:
  //stickies.eq(count).fadeOut('slow');
  //stickies.eq(newcount).fadeIn('slow');
};

// Register an event that will fire when the DOM is
// all ready.
$(document).ready(StickyRotate.init);