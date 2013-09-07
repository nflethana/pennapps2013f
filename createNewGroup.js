document.addEventListener('DOMContentLoaded', function () {
	chrome.runtime.getBackgroundPage(function(page) {
  	

  	$('.plusButton').click(function(){
  		var groupName = $('#newGroupName').val();
  		if (groupName.length > 0){
  			page.addCategory(groupName);
  			$('#newGroupName').val('');
  			displayGroups(page);
  		}
  	});


  });
});