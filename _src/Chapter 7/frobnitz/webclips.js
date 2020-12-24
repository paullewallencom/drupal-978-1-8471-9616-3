// $Id$

/**
 * Create a web clips tool for displaying random RSS items.
 * @file
 */
var WebClips = WebClips || {settings:{}};
WebClips.settings.feed = '?q=rss.xml';
  
Drupal.behaviors.webclips = function (cxt) {

  // Return early if this has already been
  // attached.
  if ($('#main.webclips-processed').size() > 0) {
    return false;
  }
  
  var feedUrl = WebClips.settings.feed;
  if (
    feedUrl.indexOf('http://') != 0 
    && feedUrl.indexOf('https://') != 0
    && feedUrl.indexOf('/') != 0 
  ) {
    // The path is relative.
    feedUrl = Drupal.settings.basePath + feedUrl;
  }
  
  // Get the feed:
  jQuery.get(feedUrl, function (data, res) {
    if (res == 'success') {
      WebClips.items = $(data).find('item');
      
      var clip = Drupal.theme('webclipArea', 'webclips');
      
      $('#main').addClass('webclips-processed').prepend(clip);

      $('.webclip-area').css({
        "background-color":"#eef",
        "width":"100%"
      }).prepend(
        $('<span>[+]</span>').click(WebClips.showItem)
      );
      WebClips.showItem();
    }
  });
};

WebClips.showItem = function () {
  var items = WebClips.items;
  var theOne = Math.floor(Math.random() * items.length);
  var item = $(items.get(theOne));
  var theLink = Drupal.theme(
    "webclip", 
    item.find('title'), 
    item.find('link')
  );
  
  $('#webclips').html(theLink);
};

Drupal.theme.prototype.webclip = function (title, href) {
  return '&rarr; ' + title.text().link(href.text());
};

Drupal.theme.prototype.webclipArea = function (id) {
  var tpl = '<div class="webclip-area"><span id="' + 
    id + 
    '"></span></div>';
  return tpl;
};
