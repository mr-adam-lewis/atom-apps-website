var fileFields = [];

$(function () {

  $('#add-app-form').submit (AddApp);

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
    $('#add-app-error').append (
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

  if ($('#add-app-icon-field').val() == '')
    error += 'Please select an app icon.<br>';

  if ($('#add-app-title').val () == '')
    error += 'Please give the app a title.<br>';

  if ($('#add-app-description').val () == '')
    error += 'Please give an app description.<br>';

  if ($('#add-app-features').val () == '')
    error += 'Please give some app features.<br>';

  if ($('#add-app-review').val () == '')
    error += 'Please give the app average review.<br>';

  return error;

}
