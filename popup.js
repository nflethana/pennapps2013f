document.addEventListener('DOMContentLoaded', function () {
  chrome.runtime.getBackgroundPage(function(page){
    console.log(page);
    chrome.tabs.getSelected(function(tab){

    });
    console.log(page.categories);



      
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

		displayGroups = function(page){
			console.log(page.categories);
			var $list = $('#group-block');
			$list.html('');
		  for (var i=0;i<page.categories.length;i++){
		  	console.log('appending' + i);
		    $list.append('<input type="checkbox" id="'+page.categories[i]+'" name="'+page.categories[i]+'" checked></input><label>'+page.categories[i]+'</label><br>');
		  }
		}
		displayGroups(page);
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

    	var categories = [];

    	console.log("yo");

    	chrome.tabs.getSelected(null, function(tab) {
    		page.addTab(tab, categories);
    	});
    });

  });
});
