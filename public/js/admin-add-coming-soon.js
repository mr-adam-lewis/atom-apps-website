$(function () {
  $('#add-coming-soon-form').submit (AddPost);
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

  if ($('#add-pos-icon').val() == '')
    error += 'Please select an image to display beside the post.<br>';

  if ($('#add-post-title').val () == '')
    error += 'Please give the post a title.<br>';

  if ($('#add-post-content').val () == '')
    error += 'Please give the post some content.<br>';

  return error;

}
