document.addEventListener('DOMContentLoaded', function () {
  chrome.runtime.getBackgroundPage(function(page){
    console.log(page);

    console.log(page.categories);
      
    //  Check to see if the user un-checks the group
    if (typeof page.categories != "undefined") {
	    for (var i=0; i < page.categories.length; i++) {
	    	$('#'+page.categories[i]).change(function() {
	    		if (!this.checked) {
	    			console.log("in popup.js");
	    			var tabIds = [];
	    			var tabs = page.currentTabs[page.categories[i]];
	    			if(typeof tabs != "undefined") {
	    				for(var i = 0; i < tabs.length; i++) {
	    					tabIds.push(tabs[i].id);
	    				}
	    			}
	    			chrome.tabs.remove(tabIds, function() {

	    			});
	    		}
	    	});
	    }
	  }

		displayGroups = function(page){
			console.log(page.categories);
			var $list = $('#group-block');
			$list.html('');
		  for (var i=0;i<page.categories.length;i++){
		  	console.log('appending' + i);
		    $list.append('<div class="checkbox"><label class="groupLabel"><input type="checkbox" id="'+page.categories[i]+'" name="'+page.categories[i]+'" checked>'+page.categories[i]+'</label><a href="#"><span class="deleteX"><i class="icon-remove"></i></span></a></div>');
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
    		//page.addTab(tab, checkedCategories);
    	});
    });

    //  Add functionality for Add reminder to current page
    $('#addReminderToCurrentPage').click(function() {
    	// add logic for adding a reminder...
    	
    	var alarmInfo = {};
    	alarmInfo.when = Date.now() + 10;
    	chrome.alarms.create("alarm1", alarmInfo);
    	chrome.alarms.onAlarm.addListener(function(alarm) {
    		console.log("alarm sounded!");
    	});
    });
  });
});
