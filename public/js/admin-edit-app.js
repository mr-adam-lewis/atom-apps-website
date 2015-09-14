var fileFields = [];

$(function () {

  console.log ("Requesting app json");
  var id = location.pathname.split("/");
  id = id[id.length - 1];
  $.ajax ({
    accepts: 'application/json; charset=utf-8',
    method: 'GET',
    url: '../app/' + id,
    success: function (response, status, jqXHR) {
      console.log ("Receiving app json")

      document.title += ' Edit ' + response.title;

      $('#edit-app-title').val (response.title);

      $('#edit-app-id').val (response.id);

      $('#app-profile-icon')
        .attr ('src', response.icon)
        .attr ('alt', response.title + ' icon');

      if (response.googlePlayLink !== undefined) {
        $('#googlePlayToggle').attr ('checked', 'checked');
        $('#googlePlayLink').removeAttr ('disabled').val (response.googlePlayLink);
      }

      if (response.appStoreLink !== undefined) {
        $('#appStoreToggle').attr ('checked', 'checked');
        $('#appStoreLink').removeAttr ('disabled').val (response.appStoreLink);
      }

      if (response.windowsStoreLink !== undefined) {
        $('#windowsStoreToggle').attr ('checked', 'checked');
        $('#windowsStoreLink').removeAttr ('disabled').val (response.windowsStoreLink);
      }

      if (response.amazonLink !== undefined) {
        $('#amazonStoreToggle').attr ('checked', 'checked');
        $('#amazonLink').removeAttr ('disabled').val (response.amazonLink);
      }

      if (response.steamLink !== undefined) {
        $('#steamStoreToggle').attr ('checked', 'checked');
        $('#steamLink').removeAttr ('disabled').val (response.steamLink);
      }

      var regex = new RegExp ('<br>', 'g');
      $('#edit-app-description').val (response.description.replace (regex, '\n'));
      $('#edit-app-features').val (response.features.replace (regex, '\n'));
      $('#edit-app-review').val (response.review);

      var editKeepScreenshots = '';

      for (var i=0; i<response.screenshots.length; i++) {
        if (editKeepScreenshots == '')
          editKeepScreenshots += response.screenshots[i];
        else
          editKeepScreenshots += ',' + response.screenshots[i];
        $('#edit-app-screenshot-container').prepend (
          $(document.createElement ('div'))
            .addClass ('col-xs-4 admin-edit-screenshot-container')
            .append (
              $(document.createElement ('img'))
                .attr ('src', response.screenshots[i])
                .attr ('alt', 'screenshot')
                .addClass ('admin-edit-screenshot-thumb')
            ).append (
              $(document.createElement ('div'))
                .addClass ('screenshot-remove-button-container')
                .append (
                  $(document.createElement ('a'))
                    .addClass ('btn btn-sm btn-danger')
                    .append ('remove')
                    .attr ('data-screenshot-name', response.screenshots[i])
                    .click (function () {
                      $(this).parent ().parent ().remove ();
                      var data = $(this).attr ('data-screenshot-name');
                      if ($('#edit-remove-screenshots').val () != '')
                        data = $('#edit-remove-screenshots').val () + ',' + data
                      $('#edit-remove-screenshots').val (data);
                    })
              )
            )
        );
      }

      $('#edit-keep-screenshots').val (editKeepScreenshots);

    }
  });

  $('#edit-app-form').submit (AddApp);

  $('.toggle-disabled').change(function () {
    var id = $(this).attr('data-toggle-disabled');
    var field = $('#' + id);
    if (field.prop ('disabled'))
      field.removeAttr ('disabled');
    else {
      field.attr ('disabled', '');
      field.val('');
    }
  });

  $('#add-screenshot-button').click(function () {
    // Create file field
    var fileField = document.createElement ('input');
    $(fileField).addClass ('form-control file-field')
      .attr ('type', 'file')
      .attr ('name', 'screenshot')
      .attr ('accept', 'image/*');

    fileFields.push (fileField);

    // Create remove button
    var removeButton = $(document.createElement ('a'))
      .addClass ('btn btn-danger remove-screenshot-button')
      .append ('remove');

    removeButton.click (function () {
      var fieldOuter = $(this).parent ();
      var field = $(this).parent ().find ('.file-field');
      var index = fileFields.indexOf(field.get(0));

      // Remove from DOM and array
      fileFields.splice (index, 1);
      fieldOuter.remove ();

      // Resort field names
      for (var i=0; i<fileFields.length; i++) {
        $(fileFields[i]).attr ('name', 'screenshot');
      }

      // Set the screenshot count field value
      $('#screenshotCount').val(fileFields.length);
    });

    // Append all
    $('#file-field-container')
      .append ($(document.createElement ('div'))
        .addClass ('file-field-outer')
        .append (fileField)
        .append (removeButton)
        .append ($(document.createElement ('div'))
          .addClass ('clear')));


    // Set the screenshot count field value
    $('#screenshotCount').val(fileFields.length);
  });
});

/**
 * Processes the add app form
 */
function AddApp () {
  var error = ValidateAddAppForm ();

  if (error == '')
    return true;
  else {
    $('#eidt-app-error').append (
      $(document.createElement ('div'))
        .addClass ('alert alert-dismissable alert-danger')
        .append (
          $(document.createElement ('button'))
            .attr ('type', 'button')
            .attr ('data-dismiss', 'alert')
            .addClass ('close')
            .append ('x')
        ).append (error)
    );
    return false;
  }
}

/**
 * Validates the add app form
 */
function ValidateAddAppForm () {
  var error = '';

  var screenshotCount = $('#screenshotCount').val();
  for (var i=0; i<screenshotCount; i++) {
    if ($('#screenshot' + i).val () == '') {
      error += 'Please make sure all screenshots have been selected.<br>';
      break;
    }
  }

  if ($('#edit-app-title').val () == '')
    error += 'Please give the app a title.<br>';

  if ($('#edit-app-description').val () == '')
    error += 'Please give an app description.<br>';

  if ($('#edit-app-features').val () == '')
    error += 'Please give some app features.<br>';

  if ($('#edit-app-review').val () == '')
    error += 'Please give the app average review.<br>';

  return error;

}
