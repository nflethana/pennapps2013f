document.addEventListener('DOMContentLoaded', function () {
  chrome.runtime.getBackgroundPage(function(page){
    console.log(page);

    console.log(page.categories);

		displayGroups(page);
		addUncheck(page);
      
      

		$('#showUngrouped').on('click', function(){
			if ($(this).text() == "Show ungrouped tabs"){
				$(this).text("Hide ungrouped tabs");
			}
			else {
				$(this).text("Show ungrouped tabs");
			}
		});

		$('.plusButton').click(function(){
			addGroup(page);
		});

		$('#newGroupName').keypress(function(e){
			if (e.which == 13){
				addGroup(page);
			}
		});

    // Add functionality for Add current tab to...
    
    $('#submitAddTab').click(function() {

      console.log(page.currentTabs);
        var checkedCategory;
        var $tabsBlock = $('#addTabBlock');
        for (var i = 0; i < page.categories.length; i++) {
          var $listItem = $('#att'+page.categories[i]);
          if ($listItem.is(':checked')) {
            checkedCategory=page.categories[i];
          }
        }
        chrome.tabs.getSelected(null, function(tab) {
          page.addTab(tab, checkedCategory);
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
function bindDeleteX(page){
  $('.deleteX').on('click', function(e){
    var xID = ($(this).attr('id'));
    console.log(xID.slice(0, -1));
    var realId= xID.slice(0,-1);
    page.removeCategory(realId);
    $('#top'+realId).hide(function(){
      $('#top'+realId).remove();
    });
    
  });
}
function addGroup(page){
    var groupName = $('#newGroupName').val();
    if (groupName.length > 0){
      page.addCategory(groupName);
      $('#newGroupName').val('');
      $('#group-block').append('<div class="checkbox" id="top'+groupName+'" style="display:none;"><label class="groupLabel"><input type="checkbox" id="'+groupName+'" name="'+groupName+'" checked>'+groupName+'</label><a href="#"><span class="deleteX" id="'+groupName+'x"><i class="icon-remove"></i></span></a></div>');
      $('.checkbox').show('slow');
    }

    bindDeleteX(page);
    addUncheck(page);
}
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
        $list.append('<div class="checkbox" id="top'+page.categories[i]+'"><label class="groupLabel"><input type="checkbox" id="'+page.categories[i]+'" name="'+page.categories[i]+'" '+checked+'>'+page.categories[i]+'</label><a href="#"><span class="deleteX" id="'+page.categories[i]+'x"><i class="icon-remove"></i></span></a></div>');
      }
      bindDeleteX(page);
    }
function addUncheck(page) {
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
            console.log(currentTabs);
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
