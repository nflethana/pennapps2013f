document.addEventListener('DOMContentLoaded', function () {
	chrome.runtime.getBackgroundPage(function(page) {
  	$('#finish').click(function() {
	    var input = $('#groupName');
		
			page.addCategory(input.val());
			console.log(page.categories);
			self.location="popup.html";
		});


  });
});