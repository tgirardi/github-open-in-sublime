(function ($, chrome) {
'use strict';

/**
 * In this variable we will store a jQuery Object that contains an HTMLElement
 * that represents a local map pair (repository name -> local path).
 * Each pair is printed as a row with two inputs, one for the repository name
 * and the other for the local path of that repository
 */
var $localMappingRowTemplate;

/**
 * Saves options to chrome.storage
 * @author Tomás Girardi <tgirardi@gmail.com>
 * @since  0.0.1
 * @return {undefined}
 */
function saveOptions() {
  var localMapping = {};

  // fill the localMapping object
  $localMappingRowTemplate.prevAll().each(function () {
    var $localMappingRow = $(this);
    var repoName = $localMappingRow.find('[name="repo-name"]').val();

    // only add this pair if the repoName is not empty
    if(repoName && repoName.trim() !== '') {
      var localPath = $localMappingRow.find('[name="local-path"]').val();
      localMapping[repoName] = localPath;
    }
  });

  // store the local mapping object
  chrome.storage.sync.set({
    localMapping: localMapping
  }, function() {
    // Update status to let user know options were saved.
    var status = $('#status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

/**
 * Restores the options values stored in chrome.storage and prints them in the
 * option's form
 * @author Tomás Girardi <tgirardi@gmail.com>
 * @since  0.0.1
 * @return {undefined}
 */
function restoreOptions() {
  $localMappingRowTemplate = $('#local-mapping-row-template').removeAttr('id');

  chrome.storage.sync.get({
    localMapping: {},
  }, function(items) {
    var localMapping = items.localMapping;

    // print each local mapping pair
    for(var repoName in localMapping) {
      if(localMapping.hasOwnProperty(repoName)) {
        addLocalMappingRow(repoName, localMapping[repoName]);
      }
    }

    // empty row at the end
    addLocalMappingRow();
  });
}

/**
 * Prints a new row in the table that contains all local mapping pairs
 * @author Tomás Girardi <tgirardi@gmail.com>
 * @since  0.0.1
 * @param  {string} [repoName]  the name of the repository of the pair that
 *                              has to be "printed"
 * @param  {string} [localPath] the path to repository in the local machine, for
 *                              the local mapping pair thar has to be "printed"
 * @retun  {undefined}
 */
function addLocalMappingRow (repoName, localPath) {
  var $localMappingRow = $localMappingRowTemplate.clone().removeClass('hide');
  if(repoName) {
    $localMappingRow.find('[name="repo-name"]').val(repoName);
  }
  if(localPath) {
    $localMappingRow.find('[name="local-path"]').val(localPath);
  }
  $localMappingRowTemplate.before($localMappingRow);
}

/**
 * Removes the local mapping row whose delete button was pressed
 * @author Tomás Girardi <tgirardi@gmail.com>
 * @since  0.0.1
 * @return {undefined}
 */
function deleteLocalMappingRow () {
  // remove the row from the DOM
  $(this).closest('tr').remove();
}

// once the DOM is ready ...
$(function () {
  restoreOptions();

  // save button action
  $('#save').on('click', saveOptions);

  // button to add new rows
  $('#add-local-mapping-row').on('click', function () {
    // we need this anonymus function to avoid calling addLocalMappingRow with
    // the jQuery event as an argument
    addLocalMappingRow();
  });

  // button that deletes a row
  $(document.body).on('click', '.btn-local-mapping-delete',
    deleteLocalMappingRow);
});

})(window.jQuery, window.chrome);
