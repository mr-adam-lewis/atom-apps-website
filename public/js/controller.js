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
      .attr ('name', 'screenshot' + fileFields.length)
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
        $(fileFields[i]).attr ('name', 'screenshot' + i);
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
          .append (results[i].title);

        // Create options cell
        var optionsCell = $(document.createElement ('td'));

        // Create the view button
        var viewButton = $(document.createElement ('a'))
          .addClass ('btn btn-success')
          .attr('href', '../apps/' + response[i].id)
          .append ('View');

        // Create the edit button
        var editButton = $(document.createElement ('a'))
          .addClass ('btn btn-info')
          .append ('Edit');

        // Create the delete button
        var deleteButton = $(document.createElement ('a'))
          .addClass ('btn btn-danger')
          .append ('Delete');

        // Append buttons to cell
        optionsCell.append (viewButton);
        optionsCell.append (editButton);
        optionsCell.append (deleteButton);

        // Append icon to cell
        iconCell.append (icon);

        // Append cells to row
        row.append (iconCell);
        row.append (nameCell);
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

  // Submit form
  $('#add-app-form').ajaxSubmit({

    // Handle error
    error: function(xhr) {
		  Alert('Error: ' + xhr.status);
    },

    // Handle success
    success: function(response) {
      if (response.path)
        alert("App added successfully");
      else if (response.error)
        alert (response.error);
    }

	});

	// Have to stop the form from submitting and causing
	// a page refresh - don't forget this
	return false;
}
