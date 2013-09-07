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

	$('.plusButton').click(function(){
		var groupName = $('#newGroupName').val();
		if (groupName.length > 0){
			page.addCategory(groupName);
			$('#newGroupName').val('');
			$('#group-block').append('<div class="checkbox"><label class="groupLabel"><input type="checkbox" id="'+groupName+'" name="'+groupName+'" checked>'+groupName+'</label><a class="anchorX" href="#"><span class="deleteX"><i class="icon-remove"></i></span></a></div>');
		}
	});

	$('.deleteX').click(function(){
		console.log('clicked this shit');
	});

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
    
    $('#submitAddTab').click(function() {

      console.log(page.currentTabs);
        var checkedCategories = [];
        var $tabsBlock = $('#addTabBlock');
        for (var i = 0; i < page.categories.length; i++) {
          var $listItem = $('#att'+page.categories[i]);
          if ($listItem.prop('checked', 'true')) {
            checkedCategories.push(page.categories[i]);
          }
        }


        chrome.tabs.getSelected(null, function(tab) {
           page.addTab(tab, checkedCategories);
         });

        console.log(page.currentTabs);

        $tabsBlock.css("display", "none");

    });

    $('#cancelAddTab').click(function() {
      var $tabsBlock = $('#addTabBlock');
      $tabsBlock.css("display", "none");
    });

    $('#addCurrentTabTo').click(function() {
    	// chrome.tabs.query({
    	// 	active: true,
    	// 	lastFocusedWindow: true
    	// }, function(tabs) {
    	// 	console.log(tabs);
    	// 	var tab = tabs[0];
    	// 	console.log(tab);
    	// });
    
      var $tabsBlock = $("#addTabBlock");
      var $tabsList = $("#addTabList");
      for (var i = 0; i < page.categories.length; i++) {
        if ($('#att'+page.categories[i]).length == 0)
        $tabsList.append('<li class="checkbox"><label><input type="checkbox" id="att'+page.categories[i]+'" name="'+page.categories[i]+'" unchecked>'+page.categories[i]+'</label></li>');
      }
      
      $tabsBlock.css("display","block");

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
