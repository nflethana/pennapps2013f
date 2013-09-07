document.addEventListener('DOMContentLoaded', function () {
  chrome.runtime.getBackgroundPage(function(page){
    chrome.tabs.getSelected(function(tab){

    });
    console.log(page.categories);
    var $list = $('#group-block');
    for (var i=0;i<page.categories.length;i++){
      $list.append('<input type="checkbox" id="'+page.categories[i]+'" name="'+page.categories[i]+'" checked></input><label>'+page.categories[i]+'</label><br>');
    }
      $('#createNewGroup').click(function() {
         createNewGroup();
     });
    //  Check to see if the user un-checks the group
    for (var i=0; i < page.categories.length; i++) {
    	$('#'+page.categories[i]).change(function() {
    		if (!this.checked) {
    			console.log("in popup.js");
    			var tabIds = [];
    			var tabs = page.currentTabs.get(page.categories[i]);
    			for(var i = 0; i < tabs.length; i++) {
    				tabIds.push(tabs[i].id);
    			}
    			chrome.tabs.remove(tabIds, function() {

    			});
    		}
    	});
    }

    // Add functionality for Add current tab to...
    $('#addCurrentTabTo').click(function() {
    	// chrome.tabs.query({
    	// 	active: true,
    	// 	lastFocusedWindow: true
    	// }, function(tabs) {
    	// 	console.log(tabs);
    	// 	var tab = tabs[0];
    	// 	console.log(tab);
    	// });

    	chrome.tabs.getSelected(function(tab) {
    		console.log(tab);
    	});
    });

  });
});


function createNewGroup() {
	$("#groupName").css("display", "block");

}

