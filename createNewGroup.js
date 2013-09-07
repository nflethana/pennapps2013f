document.addEventListener('DOMContentLoaded', function () {
	chrome.runtime.getBackgroundPage(function(page) {
  	

  	$('.plusButton').click(function(){
  		var groupName = $('#newGroupName').val();
  		if (groupName.length > 0){
  			page.addCategory(groupName);
  			$('#newGroupName').val('');
  			$('#group-block').append('<div class="checkbox"><label class="groupLabel"><input type="checkbox" id="'+groupName+'" name="'+groupName+'" checked>'+groupName+'</label><a href="#"><span class="deleteX"><i class="icon-remove"></i></span></a></div>');
  		}
  	});


  });
});