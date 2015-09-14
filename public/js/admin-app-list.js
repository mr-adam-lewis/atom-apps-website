$(function () {
  PopulateAdminAppList ();
});

/**
 * Populates the admin app list
 */
function PopulateAdminAppList () {
  $.ajax ({
    accepts: 'application/json; charset=utf-8',
    method: 'GET',
    url: '../all-apps',
    success: function (response, status, jqXHR) {
      console.log ("Receiving admin app list json")
      // For each app in the response, add it to the menu
      for (var i=0; i<response.length; i++) {
        // Create row
        var row = $(document.createElement ('tr'));

        // Create icon cell
        var iconCell = $(document.createElement ('td'));

        // Create icon
        var icon = $(document.createElement ('img'))
          .addClass ('app-list-table-icon')
          .attr ('src', response[i].icon)
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
          .attr ('href', '../admin-edit-app/' + response[i].id)
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
