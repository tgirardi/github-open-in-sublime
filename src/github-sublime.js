(function ($, chrome) {
  'use strict';

  // add Font Awesome @font-face (workaround)
  var styleNode = document.createElement ('style');
  styleNode.type = 'text/css';
  styleNode.textContent = '@font-face { font-family: ' +
    '"FontAwesome"; src: url("' +
    chrome.extension.getURL('lib/fontawesome/fontawesome-webfont.woff') +
    '"); }';
  document.head.appendChild (styleNode);

  // jQuery selector for "desired" lines
  var LINE_SELECTOR =
    'tr.file-diff-line,div.line,.diff-table tr,.blob-wrapper tr';

  /**
   * Repository Name (we get this from the DOM)
   * @type {string}
   */
  var repoName;
  var pathnameParts =  window.location.pathname.split('/');
  if(pathnameParts.length > 2) {
    repoName = pathnameParts[2];
  }

  // we can't continue if we could get a repository name
  if(!repoName) {
    return;
  }

  /**
   * Local path to the repository (working copy)
   * @type {string}
   */
  var localPath = null;

  // get the path mapping option so we can map the public repo name to the local
  // path
  chrome.storage.sync.get({
    localMapping: '',
  }, function(items) {
    localPath = items.localMapping[repoName];
    // we check if the path ends with a '/'. If not, we append that character
    if(localPath && localPath.charAt(localPath.length - 1) !== '/') {
      localPath += '/';
    }
  });

  // style for the div that will contain the buttons (this div will be inserted
  // in each "hovered" line. Each line is represented by a <tr> with <td>'s
  // inside. We will insert it in the last <td>)
  // The buttons are the ones who allow to open the file or copy the URI scheme
  var BUTTONS_STYLE = [
    'position: absolute',
    'height: 15px',
    'width: 30px'
  ];
  var BUTTONS_TOP_POSITION = '2px';
  var BUTTONS_LEFT_POSITION = '800px';
  var BUTTONS_MARGIN = '5px';

  // buttons creation
  var $buttons = $('<div id="github-open-in-sublime-button" style="' +
    BUTTONS_STYLE.join(';') + '"></div>');
  var $buttonOpen = $('<i class="fa fa-pencil-square-o"></i>');
  var $buttonClipboard = $('<i class="fa fa-clipboard" style="margin-left:' +
    BUTTONS_MARGIN + '"></i>');
  $buttons.append([$buttonOpen, $buttonClipboard]);

  /**
   * Returns the "subl://..." url that will open the "desired" file at the
   * "desired" line.
   * The "desired file" is the one containing the line that was double clicked
   * or right clicked. The clicked line is the "desired line".
   * @author Tomás Girardi <tgirardi@gmail.com>
   * @since  0.0.1
   * @return {string} URL for the file in the format subli://open/?url=file://
   * <path_to_file>&line=<line_number>
   */
  var getSublimeUrl = function () {
    var $element = $($buttons.data('$lineCell')),
      id = $element.attr('id'),
      // get the line number corresponding to the clicked line
      lineNum = ((id && id.match(/^LC(\d+)$/)) || [])[1] || $element
        .closest('tr')
        .children('[data-line-number]:not([data-line-number=""]):last')
        .attr('data-line-number'),
      // get the file path og the file that contains the clicked line
      file = $('#path').val() || $element
        .closest('.file,.inline-review-comment[id^="discussion-diff-"]')
        .children('[data-path]').attr('data-path') ||
        $('.breadcrumb').children().not('.repo-root').text().substr(1);

    // IMPORTANT: you need to set you OS to support subl:// URL Scheme
    // - For Mac OS X check https://github.com/asuth/subl-handler
    // - For windows check https://gist.github.com/sublimator/1074202
    return 'subl://open/?url=file://' + localPath + file + '&line=' +
      lineNum;
  };

  /**
   * Requests the corresponding "subl://" URI Scheme in order to open the file
   * related with the htmlElement in sublime,
   * @author Tomás Girardi <tgirardi@gmail.com>
   * @since  0.0.1
   * @return {undefined}
   */
  var openInSublime = function () {
    window.location.href = getSublimeUrl.call(this);
  };

  /**
   * Shows a prompt that will allow to copy the URL by pressing ctr+c or
   * command+c or other method .
   * @author Tomás Girardi <tgirardi@gmail.com>
   * @since  febrero  2014
   * @param  {string} text text that wants to be copied
   * @return {undefined}
   */
  var copyToClipboard = function (text) {
    window.prompt('Copy to clipboard: Ctrl+C / Cmnd+C, Enter', text);
  };

  /**
   * Gets the URI Scheme and then shows the clipboard prompt conatining that
   * scheme.
   * @author Tomás Girardi <tgirardi@gmail.com>
   * @since  0.0.1
   * @return {undefined}
   */
  var startCopyToClipboard = function () {
    copyToClipboard(getSublimeUrl.call(this));
  };

  /**
   * Hides the buttons
   * @author Tomás Girardi <tgirardi@gmail.com>
   * @since  0.0.1
   * @return {undefined}
   */
  var removeButtons = function () {
    $buttons.hide();
  };

  /**
   * Puts the button inside the <tr> representing a line of the file.
   * @author Tomás Girardi <tgirardi@gmail.com>
   * @since  0.0.1
   * @return {undefined}
   */
  var putButtons = function () {
    // we can't continue if we didn't get the local path to the repository
    if(!localPath) {
      return;
    }
    var $element = $(this).children('td').last();
    $buttons.appendTo($element).show().data('$lineCell', $element).css({
      top: BUTTONS_TOP_POSITION,
      left: BUTTONS_LEFT_POSITION
    });
  };

  // button actions
  $buttonOpen.on('click', openInSublime);
  $buttonClipboard.on('click', startCopyToClipboard);

  // puts the buttons close to the top right corner of the HTMLElement that
  // represents a line when the mouse gets over it (and remove it when it gets
  // out)
  // NOTE: the order is important. We must first rmeove the button before
  //       putting it again
  $(document.body)
    .append($buttons.hide())
    .on('mouseout', LINE_SELECTOR, removeButtons)
    .on('mouseover', LINE_SELECTOR, putButtons);
}(window.jQuery, window.chrome));
