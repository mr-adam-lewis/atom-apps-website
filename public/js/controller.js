var fileFields = [];

$(function () {
  PopulateAppsListDropdown ();

  if ($('#app-full-list').length)
    PopulateAppFullList ();

  if ($('#app-list-table-body').length)
    PopulateAdminAppList ();

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
 * Populates the app list dropdown with the top 10 new apps requested from the server
 */
function PopulateAppsListDropdown () {
  console.log ("Requesting app list json");
  $.ajax ({
    accepts: 'application/json; charset=utf-8',
    method: 'GET',
    url: '../all-apps',
    success: function (response, status, jqXHR) {
      console.log ("Receiving app list json")
      // For each app in the response, add it to the menu
      for (var i=0; i<Math.min(response.length, 10); i++) {
        // Create the list item
        var listItem = $(document.createElement ('li'));

        // Create the anchor
        var anchor = $(document.createElement ('a'));
        anchor.attr('href', '../apps/' + response[i].id);

        // Add the title
        anchor.append (response[i].title);

        // Add the android icon
        if (response[i].android) {
          // Create the icon
          var icon = $(document.createElement ('img'));
          icon.attr ('href', '../img/android-icon.png');
          anchor.append (icon);
        }

        // Add the iOS icon
        if (response[i].ios) {
          // Create the icon
          var icon = $(document.createElement ('img'));
          icon.attr ('href', '../img/apple-icon.png');
          anchor.append (icon);
        }

        // Add the windows phone icon
        if (response[i].windowsphone) {
          // Create the icon
          var icon = $(document.createElement ('img'));
          icon.attr ('href', '../img/windows-icon.png');
          anchor.append (icon);
        }

        // Add the anchor to the list item
        listItem.append (anchor);

        // Add the list item to the dropdown
        $('#app-list-dropdown').append(listItem);
      }

      // Show the number of apps in the list
      $('#app-count-badge').append (response.length);
    }
  });
}

/**
 * Populates the full list of apps
 */
function PopulateAppFullList () {
  console.log ("Requesting app list json");
  $.ajax ({
    accepts: 'application/json; charset=utf-8',
    method: 'GET',
    url: '../all-apps',
    success: function (response, status, jqXHR) {
      console.log ("Receiving app list json")
      // For each app in the response, add it to the menu
      for (var i=0; i<response.length; i++) {

        // Create the container
        var container = $(document.createElement ('div'))
          .addClass ('col-sm-3 col-xs-6 spacer-lg');

        // Create the inner container
        var innerContainer = $(document.createElement ('div'))
          .addClass ('app-list-app');

        // Create the anchor
        var anchor = $(document.createElement ('a'))
          .attr ('href', response[i].id);

        // Create the icon container
        var iconContainer = $(document.createElement ('div'))
          .addClass ('app-list-icon-container');

        // Create the icon
        var icon = $(document.createElement ('img'))
          .attr ('src', '../img/' + response[i].id + '/icon.png')
          .attr ('alt', response[i].title + ' icon');

        // Create the title
        var title = $(document.createElement ('h4'))
          .append (response[i].title);

        // Fit elements together
        iconContainer.append (icon);
        anchor.append ('iconContainer');
        anchor.append (title);
        innerContainer.append (anchor);
        container.append (innerContainer);

        // Add to the list
        $('#app-full-list').append (container);

        if (i%2 == 0)
          $('#app-full-list').append (
            $(document.createElement ('div'))
              .addClass ('clear hidden-sm hidden-md hidden-lg')
          );
        if (i%4 == 0)
          $('#app-full-list').append (
            $(document.createElement ('div'))
              .addClass ('clear hidden-xs')
          );
      }

      // If no apps have been added
      if (response.length == 0) {
        var alert = $(document.createElement ('div'))
          .addClass ('alert alert-info');
        alert.append (
          $(document.createElement ('p'))
            .append ('No apps have been added to the website yet, please try again later.')
        );
        $('#app-full-list').append (alert);
      }
    }
  });
}

/**
 * Populates the admin app list
 */
function PopulateAdminAppList () {
  $.ajax ({
    accepts: 'application/json; charset=utf-8',
    method: 'GET',
    url: '../all-apps',
    success: function (response, status, jqXHR) {
      console.log ("Receiving app list json")
      // For each app in the response, add it to the menu
      for (var i=0; i<response.length; i++) {
        // Create row
        var row = $(document.createElement ('tr'));

        // Create icon cell
        var iconCell = $(document.createElement ('td'));

        // Create icon
        var icon = $(document.createElement ('img'))
          .addClass ('app-list-table-icon')
          .attr ('src', '../img/' + response[i].id + '/icon.png')
          .attr ('alt', response[i].title + ' icon')

        // Create name cell
        var nameCell = $(document.createElement ('td'))
          .append (response[i].title);

        // Create id cell
        var idCell = $(document.createElement ('td'))
          .append ('/' + response[i].id);

        // Create options cell
        var optionsCell = $(document.createElement ('td'));

        // Create the view button
        var viewButton = $(document.createElement ('a'))
          .addClass ('btn btn-sm btn-success')
          .attr('href', '../apps/' + response[i].id)
          .append ('View');

        // Create the edit button
        var editButton = $(document.createElement ('a'))
          .addClass ('btn btn-sm btn-info')
          .append ('Edit');

        // Create the delete button
        var deleteButton = $(document.createElement ('a'))
          .addClass ('btn btn-sm btn-danger')
          .attr ('href', '../delete-app/' + response[i].id)
          .append ('Delete');

        // Append buttons to cell
        optionsCell.append (viewButton);
        optionsCell.append ($(document.createElement ('span')).addClass ('inline-spacer-lg'));
        optionsCell.append (editButton);
        optionsCell.append ($(document.createElement ('span')).addClass ('inline-spacer-lg'));
        optionsCell.append (deleteButton);

        // Append icon to cell
        iconCell.append (icon);

        // Append cells to row
        row.append (iconCell);
        row.append (nameCell);
        row.append (idCell);
        row.append (optionsCell);

        // Append row to table
        $('#app-list-table-body').append (row);
      }
    }
  });
}

/**
 * Validates then uploads the contents of the app form to the website
 */
function AddApp () {

  var error = ValidateAddAppForm ();

  if (error == '') {
    console.log ('Sending add-app form data.');
    return true;
  } else {
    $('#add-app-error').append (
      $(document.createElement ('div'))
        .addClass ('alert alert-dismissible alert-danger')
        .append (
          $(document.createElement ('button'))
            .addClass ('close')
            .attr ('data-dismiss', 'alert')
            .attr ('type', 'button')
            .append ('x'))
        .append (error)
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
