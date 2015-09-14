$(function () {
  PopulateAdminComingSoonList ();
});

/**
 * Populates the admin coming soon list
 */
function PopulateAdminComingSoonList () {
  $.ajax ({
    accepts: 'application/json; charset=utf-8',
    method: 'GET',
    url: '../all-coming-soon',
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

        // Create options cell
        var optionsCell = $(document.createElement ('td'));

        // Create the edit button
        var editButton = $(document.createElement ('a'))
          .addClass ('btn btn-sm btn-info')
          .attr ('href', '../admin-edit-coming-soon/' + response[i].id)
          .append ('Edit');

        // Create the delete button
        var deleteButton = $(document.createElement ('a'))
          .addClass ('btn btn-sm btn-danger')
          .attr ('href', '../delete-coming-soon/' + response[i].id)
          .append ('Delete');

        // Append buttons to cell
        optionsCell.append (editButton);
        optionsCell.append ($(document.createElement ('span')).addClass ('inline-spacer-lg'));
        optionsCell.append (deleteButton);

        // Append icon to cell
        iconCell.append (icon);

        // Append cells to row
        row.append (iconCell);
        row.append (nameCell);
        row.append (optionsCell);

        // Append row to table
        $('#coming-soon-list-table-body').append (row);
      }
    }
  });
}
