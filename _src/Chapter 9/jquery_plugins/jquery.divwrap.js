/**
 * A custom jQuery plugin that provides a wrapper div around an element.
 */
 
(function ($) {
  
  /**
   * Wrap the selected element or elements in <div></div> tags.
   *
   * @param attrs
   *  An object containing name/value pairs for attrs.
   */
  jQuery.fn.divWrap = function () {
    var attrs = (arguments.length > 0) ? arguments[0] : {};
    
    this.each(function (index, item) {
      var div = $(item).wrap('<div></div>').parent();
      
      if (attrs) {
        div.attr(attrs);
      }
    });
    return this;
  }
})(jQuery);