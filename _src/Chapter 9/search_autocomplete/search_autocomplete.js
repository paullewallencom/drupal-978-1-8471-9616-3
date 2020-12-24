// $Id$

/**
 * Turn the search block into an autocomplete form.
 * @file
 */
 
var SearchAutocomplete = SearchAutocomplete || {};

$(document).ready(function () {
  $('input[name="search_block_form"]:not(.form-autocomplete)')
   .each(function () {
    var newId = $(this).attr('id') + '-autocomplete';
    var newElement = $('<input type="hidden"/>')
      .addClass('autocomplete')
      .attr('id', newId).attr('disabled','disabled')
      .attr('value', SearchAutocomplete.url);
      
    $(this).after(newElement);
    
  }).addClass('form-autocomplete');
  
  Drupal.attachBehaviors();
});
