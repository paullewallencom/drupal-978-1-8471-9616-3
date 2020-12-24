// $Id$

/**
 * Drupal JavaScript themes.
 * @page
 */

/**
 * Theme a placeholder.
 *
 * @param str
 *   String to format.
 * @return
 *   Themed string.
 */ 
Drupal.theme.placeholder = function (str) {
  //return '<strong>' + Drupal.checkPlain(str) + '</strong>';
  return $('<strong></strong>').text(str).parent().html();
};

/**
 * Theme a block object.
 * This matches the bluemarine block.tpl.php.
 *
 * @param block
 *   A block object. Like the PHP version, it is expected to have a
 *   title and content. It may also have an id.
 * @return 
 *   Returns a string formated as a block.
 */
Drupal.theme.prototype.block = function (block) {
  if (!block.id) {
    block.id = "frobnitz-" + Math.floor(Math.random() * 9999);
  }
    
  var text = '<div class="block block-frobnitz" id="block-' + 
    block.id + 
    '">' +
    '<h2 class="title">' + 
    block.title + 
    '</h2><div class="content">' +
    block.content + 
    '</div></div>';
    
  return text;
};

/**
 * Build a single (non-colapsed) menu list.
 * Mimics the complex menu logic in menus.inc.
 * @param items
 *   An array of objects that have a name and a link property.
 * @returns 
 *   String representation of a link list.
 */
Drupal.theme.prototype.shallow_menu = function (items) {
  var list = $('<ul class="menu"></ul>');
  
  for (var i = 0; i < items.length; ++i) {
    var item = items[i];
    
    // Get text for menu item
    var menuText = null;
    if (item.link) {
      menuText = item.name.link(item.link);
    }
    else {
      menuText = item.name;
    }
    
    // Create item
    var li = $('<li class="leaf"></li>');
    
    // figure out if this is first or last
    if (i == 0) {
      li.addClass('first');
    } 
    else if (i == items.length - 1) {
      li.addClass('last');
    }
    
    // Add item to list
    li.html(menuText).appendTo(list);
  }
  
  return list.parent().html();
};

$(document).ready(function () {
  var links = [
    {name: 'Drupal.org', link:'http://drupal.org'},
    {name: 'jQuery', link: 'http://jquery.org'},
    {name: 'No Link'}
  ];
  
  var text = Drupal.theme('shallow_menu', links);
  
  var blockInfo = {
    title: 'JavaScript Menu',
    content: text
  };
  var block = Drupal.theme('block', blockInfo);
  
  $('.block:first').before(block);
});

var TplHtml = {template: {}, observer:{}};

TplHtml.loadTemplate = function (name, uri) {
  var url = Drupal.settings.basePath + uri;
  
  jQuery.get(url, function (txt) {
    TplHtml.template[name] = txt;
  });
};

/*
$(document).ready(function () {
  TplHtml.loadTemplate('node','/sites/all/themes/frobnitz/node.tpl.html');
});
*/

Drupal.theme.node = function (node) {
  var out = '';
  if (TplHtml.template.node) {
    var tpl = $(TplHtml.template.node);
    
    // Is it sticky?
    if (node.sticky) {
      tpl.parent().find('.node').addClass('sticky');
    }
    
    // Do title and title's link at the same time.
    if (!node.nodeUrl) node.nodeUrl = '#';
    tpl.find('.title a').text(node.title)
      .attr('href', node.nodeUrl)
    
    // These are the things we are going to place in
    // the template.
    // Fortunately for us, class names match 1-to-1 with
    // the names of the node properties.
    var values = ['content','submitted','taxonomy','links'];
    for (var i = 0; i < values.length; ++i) {
      var value = values[i];
      if (node[value]) {
        tpl.find('.' + value).html(node[value]);
      }
      else {
        tpl.find('.' + value).hide();
      }
    }
    
    // Now we dump the template to a string.
    out = tpl.parent().html();
  }
  return out;
}

function addNode() {
  var node = {
    title: "New Node",
    content: "JavaScript created this node!",
    sticky: false,
    nodeUrl: 'http://drupal.org'
  };
  var filter = '.node:last';
  if (node.sticky) {
    filter = '.sticky:last';
  }
  var txt = Drupal.theme('node', node);
  console.log(txt);
  $(filter).after(Drupal.theme('node', node));
  Drupal.attachBehaviors();
}

var max_wait = 3000; // 3 seconds
var attempt = 0;
function addNode() {
  var wait = 200;
  var node = {
    title: "New Node",
    content: "JavaScript created this node!",
    nodeUrl: 'http://drupal.org'
  };
  
  if (TplHtml.template.node) {
    var txt = Drupal.theme('node', node);
    $('.node:last').after(txt);
    Drupal.attachBehaviors();
  }
  else if (attempt * wait < max_wait) {
    ++attempt;
    setTimeout(addNode, wait);
    console.log("delaying");
  }
  else {
    var txt = Drupal.theme('defaultNode', node);
    $('.node:last').after(txt);
    Drupal.attachBehaviors();
  }
}


function addTable() {
  var headers = ['Library', 'Purpose'];
  var rows = [
    ['jquery.js', 'Document manipulation'],
    ['drupal.js', 'Drupal interaction'],
    ['js_theming.js', 'Provide additional themes']
  ];
  var table = Drupal.theme('table',headers, rows);
  
  return table;
}

function advancedTable() {
  var headers = ['Library', 'Purpose'];
  var cell1 = {data: 'jQuery.js', class:'myClass'};
  var cell2 = {data: 'Document manipulation', class:'myClass'};
  var rows = [
    [cell1, cell2]
  ];
  var attrs = {'width': '100%'};
  var caption = "Drupal JS Libraries";
  var table = Drupal.theme('table',headers, rows, attrs, caption);
  
  return table;
}
