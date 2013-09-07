document.addEventListener('DOMContentLoaded', function () {

  $('#finish').click(function() {
    var input = $('#groupName');
	$('body').append($("p").text(input.val()));
	chrome.runtime.getBackgroundPage(function(page) {
		page.addCategory(input.val());
		console.log(page.categories);
	});
  });
});