$(function () {
  $('#add-coming-soon-form').submit (AddPost);

  console.log ("Requesting coming soon json");
  var id = location.pathname.split("/");
  id = id[id.length - 1];
  $.ajax ({
    accepts: 'application/json; charset=utf-8',
    method: 'GET',
    url: '../coming-soon/' + id,
    success: function (response, status, jqXHR) {
      console.log ("Receiving coming soon json")

      document.title += ' Edit ' + response.title;

      $('#add-post-title').val (response.title);

      $('#edit-post-id').val (response.id);

      $('#post-profile-icon')
        .attr ('src', response.icon)
        .attr ('alt', response.title + ' icon');

      var regex = new RegExp ('<br>', 'g');
      $('#add-post-content').val (response.content.replace (regex, '\n'));
    }
  });
});

/**
 * Processes the add post form
 */
function AddPost () {
  var error = ValidateAddPostForm ();

  if (error == '')
    return true;
  else {
    $('#add-post-error').append (
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
 * Validates the add post form
 */
function ValidateAddPostForm () {
  var error = '';

  if ($('#add-post-title').val () == '')
    error += 'Please give the post a title.<br>';

  if ($('#add-post-content').val () == '')
    error += 'Please give the post some content.<br>';

  return error;

}
