document.addEventListener('DOMContentLoaded', function () {
	console.log("blah");
	$("body").append("<p> YOOOO </p>");
  $('#finish').click(function() {
    var input = $('#groupName');
	$('body').append($("p").text(input.val()));
  });
});