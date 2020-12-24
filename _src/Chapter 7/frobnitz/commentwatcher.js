// $Id$

/**
 * Watch for new comments and display a message when a comment 
 * is posted.
 *
 * @file
 */
var CommentWatcher = CommentWatcher || {settings: {}};

CommentWatcher.settings.path = 'newest_comment';
CommentWatcher.settings.maxLength = 128;
CommentWatcher.settings.showSeconds = 7;
CommentWatcher.settings.checkSeconds = 10;

Drupal.behaviors.commentWatcher = function () {
  if ($('#comment_watcher').length == 0) {
    $('body').append('<div id="comment_watcher"></div>');
    CommentWatcher.check();
    var checkInterval = CommentWatcher.settings.checkSeconds * 1000;
    setInterval(CommentWatcher.check, checkInterval);
  }
}

CommentWatcher.check = function () {
  var url = Drupal.settings.basePath + CommentWatcher.settings.path;
  
  jQuery.getJSON(url, function (data, result) {
    if (result != 'success') {
      return;
    }
    var comment = data[0];
    if (comment.cid > CommentWatcher.getLastID()) {
      CommentWatcher.setLastID(comment.cid);
      var content = Drupal.theme('commentArea', comment);
      var hideInterval = CommentWatcher.settings.showSeconds * 1000;
      
      $('#comment_watcher').append(content).show('slow');
      
      setTimeout(function () {
        $('#comment_watcher').hide('slow', function () {
          $(this).find('#' + comment.cid).remove();
        });
      }, hideInterval);
    }
    
  });
}

CommentWatcher.setLastID = function (lastCommentID) {
  var oneDay = 1000 * 60 * 60 * 24;
  var expireTime = (new Date()).getTime() + oneDay;
  var expire = new Date(expireTime).toGMTString();
  var myCookie = 'last_comment_id=' + lastCommentID + '; expires=' +
    expire + '; path=' + Drupal.settings.basePath;
  document.cookie = myCookie;
}

CommentWatcher.getLastID = function() {
  var found = document.cookie.match(/last_comment_id=([\d]+);/);
  if (!found || found.length < 2) {
    return 0;
  }
  return new Number(found[1]);
}

CommentWatcher.formatComment = function (text) {
  text = $(text).parent().text();//Drupal.checkPlain(text);
  if (text.length > CommentWatcher.settings.maxLength) {
    text = text.substring(0, CommentWatcher.settings.maxLength);
    var lastSpace = text.lastIndexOf(' ');
    if (lastSpace > 0) {
      text = text.substring(0, lastSpace);
    }
    text += '...';
  }
  return text;
}

Drupal.theme.prototype.commentArea = function (comment) {
  var text = CommentWatcher.formatComment(comment.comments_comment);
  var node_url = Drupal.settings.basePath + '/node/' + 
    comment.node_comments_nid;
  var title_link = 
      Drupal.checkPlain(comment.node_comments_title);
  title_link = title_link.link(node_url);
  var author = Drupal.checkPlain(comment.comments_name) +
    Drupal.t(' said...');
  
  var tpl = '<div class="new_comment"></div>';
  
  var out = $(tpl).attr('id', comment.cid)
    .append('<div class="node_title">' + title_link  + '</div>')
    .append('<span class="author">' + author +'</span>')
    .append('<blockquote>' + text + '</blockquote>')
    .parent().html();
    
  return out;
}
