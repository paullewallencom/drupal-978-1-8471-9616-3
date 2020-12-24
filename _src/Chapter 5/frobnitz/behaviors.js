// $Id$
/**
 * Defines behaviors for Frobnitz theme.
 * @file
 */

/**
 * Toggle visibility of blocks (with slide effect).
 */
Drupal.behaviors.slideBlocks = function (context) {
  $('.block:not(.slideBlocks-processed)', context)
    .addClass('slideBlocks-processed')
    .each(function () {
      $(this).children(".title").toggle(
        function () { 
          $(this).siblings(".content").slideUp("slow");
        },
        function () {
          $(this).siblings(".content").slideDown("slow");
        });
    });
};

/*$(document).ready(function () {
  $('p').addClass('fancy');
});

$('body').append('<p>Another paragraph</p>');
*/

/*
Drupal.behaviors.addFancy = function (context) {
  $('p:not(.fancy)', context).addClass('fancy');
}

Drupal.behaviors.countParagraphs = function (context) {
  if ($('#lots').size() > 0) {
    return;
  }
  else if ($('p', context).size() > 5) {
    $('body').append('<p id="lots">Lots of Text!</p>')
  }
}
*/