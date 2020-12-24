// $Id$

/**
 * A better version of the simple editor.
 * @file
 */
  
var BetterEditor = BetterEditor || {};
BetterEditor.selection = null;

/**
 * Record changes to a select box.
 */
BetterEditor.watchSelection = function () {
  BetterEditor.selection = Drupal.getSelection(this);
  BetterEditor.selection.id = $(this).attr('id');
};

/**
 * Attaches the editor toolbar.
 */ 
Drupal.behaviors.editor = function () {
  $('textarea:not(.editor-processed)')
    .addClass('editor-processed')
    .mouseup(BetterEditor.watchSelection)
    .keyup(BetterEditor.watchSelection)
    .each(function (item) {
      var txtarea = $(this);
      var txtareaID = txtarea.attr('id');
      
      var buttons = [];
      for (var i = 0; i < BetterEditor.buttons.length; ++i) {
        button = BetterEditor.buttons[i];
        buttons.push(Drupal.theme('button', button));
      }
      
      var id = 'buttons-' + txtareaID;
      var bar = $(Drupal.theme('buttonBar', buttons, id));
      
      $(bar).insertBefore('#' + txtareaID)
        .children('.editor-button')
        .click(function () {
          var txtareaEle = $('#' + txtareaID).get(0);
          var sel = BetterEditor.selection;
          if (sel.id == txtareaID && sel.start != sel.end) {
            var buttonName = $(this).html();
            var targetButton = null;
            for (i = 0; i < BetterEditor.buttons.length; ++i) {
              if (BetterEditor.buttons[i].name == buttonName) {
                targetButton = BetterEditor.buttons[i];
                break;
              }
            }
            
            if (targetButton) {
              txtareaEle.value = BetterEditor.insertTag(
                sel.start, 
                sel.end,
                targetButton,
                txtareaEle.value
              );
            }
            sel.start = sel.end = -1;
          }      
        });
    });
};

/**
 * Insert a tag.
 *
 * @param start 
 *  Location to insert start tag.
 * @param end 
 *  Location to insert end tag.
 * @param tag 
 *  Tag to insert.
 * @param value 
 *  String to insert tag into.
 */
BetterEditor.insertTag = function (start, end, tag, value) {
  var front = value.substring(0, start);
  var middle = value.substring(start, end);
  var back = value.substring(end);
  var formatted = Drupal.theme('addTag', tag, middle);
  return front + formatted + back;
};


/**
 * Theme a button bar.
 *
 * @param buttons
 *  Array of buttons that should be added.
 * @param id
 *  ID for the button bar. This is sed to distinguish button bars on 
 *  screens where there are multiple editors.
 *
 * @return
 *  Themed button bar as a string of HTML.
 */  
Drupal.theme.prototype.buttonBar = function (buttons, id) {
  var buttonBar = $('<div class="button-bar"></div>').attr('id', id);
  
  jQuery.each(buttons, function (i, item) {
    buttonBar.append(item);
  });
  
  return  buttonBar.parent().html();
}

/**
 * Theme an individual button.
 * 
 * @param button
 *  Individual button object.
 * 
 * @return
 *  Themed button HTML as a string.
 */
Drupal.theme.prototype.button = function (button) {
  var tag = $('<div class="editor-button"></div>');
  
  if (button.style) {
    tag.attr('style', button.style);
  }
  
  return tag.html(button.name).parent().html();
}

/**
 * Theme a tag before inserting it into the text area.
 * This wraps text inside of the appropriate tags. If the button object
 * contains an array of tags, then the tags will be nested, with the 
 * text in the innermost tag.
 * 
 * @param button
 *  Button object that describes what the button does.
 * @param text
 *  Text that the tag will be wrapped around.
 */
Drupal.theme.prototype.addTag = function (button, text) {
  var tag = null;
  if (button.tag instanceof Array && button.tag.length > 0) {
    
    var placeholder = $('body').append('<div class="placeholder"></div>')
      .children('.placeholder').hide();
    var current = placeholder; // Copy for working with
    
    jQuery.each(button.tag, function (i, data) {
      var newTag = '<' + data + '>\n</' + data + '>\n';
      current.append(newTag);

      if (button.cssClass) {
        current.addClass(button.cssClass);
      }
      current = current.children();
      
      if (i == button.tag.length -1) {
        current.html(text);
      }
      
    });
    //return placeholder.html();
    var html = placeholder.html();
    placeholder.remove();
    return html;
  }
  else {
    tag = $('<' + button.tag + '></' + button.tag + '>');
    if (button.cssClass) {
      tag.addClass(button.cssClass);
    }
    return tag.html(text).parent().html();
  } 
}
