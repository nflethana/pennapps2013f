document.addEventListener('DOMContentLoaded', function () {
  chrome.runtime.getBackgroundPage(function(page){
    console.log(page);

    console.log(page.categories);

    function displayGroups(page){
			console.log(page.categories);
			var $list = $('#group-block');
			$list.html('');
		  for (var i=0;i<page.categories.length;i++){
		  	var checked;
		  	console.log(page.categoriesChecked);
		  	if (page.categoriesChecked[page.categories[i]]) {
		  		checked = "checked";
		  	} else {
		  		checked = "unchecked";
		  	}
		  	console.log('appending' + i);
		    $list.append('<div class="checkbox"><label class="groupLabel"><input type="checkbox" id="'+page.categories[i]+'" name="'+page.categories[i]+'" '+checked+'>'+page.categories[i]+'</label><a href="#"><span class="deleteX" id="'+page.categories[i]+'x"><i class="icon-remove"></i></span></a></div>');
		  }
		  bindDeleteX();
		}
		displayGroups(page);
		addUncheck();
      
      function addUncheck() {
	    //  Check to see if the user un-checks the group
	    for (var i=0; i < page.categories.length; i++) {
	    	var category = page.categories[i];

          $('#'+category).change(function() {
	    		var xcategory=$(this).attr('id');
          if (!this.checked) {
	    			console.log("in popup.js");
	    			page.categoriesChecked[xcategory] = false;
	    			var tabIds = [];
	    			console.log(page.currentTabs);
	    			var tabs = page.currentTabs[xcategory];
	    			console.log(tabs);
    				for(var i = 0; i < tabs.length; i++) {
    					console.log("In here");
    					tabIds.push(tabs[i].id);
    				}
    				if (tabIds.length > 0) {
		    			chrome.tabs.remove(tabIds, function() {

		    			});
	    			}
	    		} else {
	    			page.categoriesChecked[xcategory] = true;
	        	page.openTabs(this.id);
	     		 }
	    	});

	    }
	  }

	function addGroup(){
		var groupName = $('#newGroupName').val();
		if (groupName.length > 0){
			page.addCategory(groupName);
			$('#newGroupName').val('');
			$('#group-block').append('<div class="checkbox" style="display:none;"><label class="groupLabel"><input type="checkbox" id="'+groupName+'" name="'+groupName+'" checked>'+groupName+'</label><a href="#"><span class="deleteX" id="'+groupName+'x"><i class="icon-remove"></i></span></a></div>');
			$('.checkbox').show('slow');
		}

		bindDeleteX();
		addUncheck();
	}

		$('.plusButton').click(function(){
			addGroup();
		});

		$('#newGroupName').keypress(function(e){
			if (e.which == 13){
				addGroup();
			}
		});



    // Add functionality for Add current tab to...
    
    $('#submitAddTab').click(function() {

      console.log(page.currentTabs);
        var checkedCategories = [];
        var $tabsBlock = $('#addTabBlock');
        for (var i = 0; i < page.categories.length; i++) {
          var $listItem = $('#att'+page.categories[i]);
          if ($listItem.is(':checked')) {
            checkedCategories.push(page.categories[i]);
          }
        }
        chrome.tabs.getSelected(null, function(tab) {
          page.addTab(tab, checkedCategories);
          console.log(page.currentTabs);
         });

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
function bindDeleteX(){
  $('.deleteX').on('click', function(){
    var xID = ($(this).attr('id'));
    console.log(xID.slice(0, -1));
    page.removeCategory(xID.slice(0, -1));
    displayGroups(page);
  });
}
