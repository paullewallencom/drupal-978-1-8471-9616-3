// $Id$

/**
 * JavaScript for initializing and adding accordion effect.
 * @file
 */
Drupal.behaviors.accordion = function () {
  $('#sidebar-left:not(.ui-accordion)').accordion({
    header: 'h2'
  });
};
