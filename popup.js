var dragging = '';
var dragId;
document.addEventListener('DOMContentLoaded', function () {
  chrome.runtime.getBackgroundPage(function(page){
    chrome.tabs.query({},function(tabArr){
      $('UngroupedTabs').attr('checked',page.categoriesChecked['Ungrouped']);
      var newCurrentTabs = {};
      for(x in page.currentTabs){
        newCurrentTabs[x] = [];
      }
      var newUngrouped = [];
      for(var i=0;i<tabArr.length;i++){
        var group = page.findInObj(tabArr[i].id,page.currentTabs);
        if(group!="Ungrouped"){
          newCurrentTabs[group].push(tabArr[i]);
        }else{
          newUngrouped.push(tabArr[i]);
        }
      }
      page.currentTabs=newCurrentTabs;
      page.ungrouped=newUngrouped;
      console.log(page);
      var left = true;
      console.log(page.categories);

  		displayGroups(page);
  		addUncheck(page);
  		
  		$('.tab-draggable').draggable({containment: 'body',
  																		revert: 'invalid',
  																		start: startDrag});

  		function startDrag(event, ui){
  			dragging = $(this).parent('ul').prev().attr('id');
        dragId = parseInt($(this).attr('id'));
  		}

  	$('.down-caret').on('click', function(){
  		var $thisId = $(this).attr('id').slice(5);
  		console.log($thisId);
      if(left){
     	  $(this).addClass('left-caret');
    	  $(this).removeClass('down-caret');
    	  $('#list' + $thisId).hide("fast");
      } else{
        $(this).addClass('down-caret');
        $(this).removeClass('left-caret');
        $('#list' + $thisId).show("fast");
      }
      left=!left;
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
});
function bindDeleteX(page){
  $('.deleteX').on('click', function(e){
    var xID = ($(this).attr('id'));
    console.log(xID.slice(0, -1));
    var realId= xID.slice(0,-1);
    page.removeCategory(realId);
    $('#top'+realId.replace(' ','_')).hide(function(){
      $('#top'+realId.replace(' ','_')).remove();
    });
    
  });
}
function addGroup(page){
    var groupName = $('#newGroupName').val();
    if (groupName.length > 0){
      page.addCategory(groupName);
      $('#newGroupName').val('');
      groupName=groupName.replace(" ","_");
      $('#group-block').append('<div id="wrapper'+groupName+'"><div class="checkbox" id="top'+groupName+'" style="display:none;"><label class="groupLabel"><input type="checkbox" id="'+groupName+'" name="'+groupName+'" checked>'+groupName+'   </label><a href="#"><span><b id="caret'+groupName+'"class="down-caret"></b></span></a><a href="#"><span class="deleteX" id="'+groupName+'x"><i class="icon-remove"></i></span></a></div></div>');
      var $div = $('#top'+groupName);
      $ul = $('<ul id="list'+groupName+'" class="tab-list"></ul>');
      $div.after($ul);
      $('.checkbox').show('slow');
      $('#wrapper' + groupName).droppable({accept: '.tab-draggable',
        drop: function(event, ui){
          var first = dragging.slice(3);
          var second = $(this).attr("id").slice(7);
          chrome.tabs.get(dragId,function(tab){
            page.addTab(tab,second);
            refreshGroup(page,first);
            refreshGroup(page,second);
          });
        }
        });
    }
    bindDeleteX(page);
    addUncheck(page);
}
function refreshGroup(page,groupName){
  $('#list'+groupName.replace(' ','_')).empty();
  $ul = $('#list'+groupName.replace(' ','_'));
  console.log(groupName);
  console.log(page.currentTabs);
  console.log(page.currentTabs[groupName]);
  var arr;
  if(groupName=="Ungrouped"){
    arr=page.ungrouped;
  } else {
    arr = page.currentTabs[groupName];
  }
  for(var i=0;i<arr.length;i++){
      var $li = liFromTab(arr[i]);
      $ul.append($li);
  }
  $('.tab-draggable').draggable({containment: 'body',
                                    revert: 'invalid',
                                    start: startDrag});

  function startDrag(event, ui){
    dragging = $(this).parent('ul').prev().attr('id');
    dragId = parseInt($(this).attr('id'));
  }
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
        var name = page.categories[i].replace(' ','_');
        $list.append('<div id="wrapper'+name+'"><div class="checkbox" id="top'+name+'"><label class="groupLabel"><input type="checkbox" id="'+name+'" name="'+name+'" '+checked+'>'+page.categories[i]+'   </label><a href="#"><span><b id="caret'+page.categories[i]+'"class="down-caret"></b></span></a><a href="#"><span class="deleteX" id="'+name+'x"><i class="icon-remove"></i></span></a></div></div>');
        $('#wrapper' + name).droppable({accept: '.tab-draggable',
      																		drop: function(event, ui){
                                            var first = dragging.slice(3);
                                            var second = $(this).attr("id").slice(7);
      																			chrome.tabs.get(dragId,function(tab){
                                              page.addTab(tab,second);
                                              refreshGroup(page,first);
                                              refreshGroup(page,second);
                                            })
      																		}
      																		});
      }
      for (var x in page.currentTabs){
        var $div = $('#top'+x.replace(' ','_'));
        $ul = $('<ul id="list'+x.replace(' ','_')+'" class="tab-list"></ul>');
        $div.after($ul);
        for(var i=0;i<page.currentTabs[x].length;i++){
          var $li = liFromTab(page.currentTabs[x][i]);
          $ul.append($li);
        }
      }
      $ung= $('#topUngrouped');
      $ul = $('<ul id="listUngrouped" class="tab-list"></ul>');
      $ung.after($ul);
      for(var i=0;i<page.ungrouped.length;i++){
        var $li = liFromTab(page.ungrouped[i]);
        $ul.append($li);
      }
      $('#wrapperUngrouped').droppable({accept: '.tab-draggable',
                                          drop: function(event, ui){
                                            var first = dragging.slice(3);
                                            var second = $(this).attr("id").slice(7);
                                            chrome.tabs.get(dragId,function(tab){
                                              page.addTab(tab,second);
                                              refreshGroup(page,first);
                                              refreshGroup(page,second);
                                            })
                                          }
                                          });
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
    $('#UngroupedTabs').change(function() {
      if (!this.checked) {
        page.categoriesChecked['Ungrouped'] = false;
        var tabIds = [];
        var tabs = page.ungrouped;
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
        page.categoriesChecked['Ungrouped'] = true;
        page.openTabs('Ungrouped');
       }
    });

}
function liFromTab(tab){

  var title = tab.title;
  if (title.length>50){
    title=title.slice(0,51)+'...';
  }
  if(typeof tab.favIconUrl =='undefined' || tab.favIconUrl==null || tab.favIconUrl.length==0 || tab.favIconUrl.indexOf('chrome')==0){
    favIconUrl='favicon.ico';
  } else {
    console.log(tab.favIconUrl);
    favIconUrl = tab.favIconUrl;
  }
  $li = $('<li id="'+tab.id+'"" class="tab-draggable"><img class="tab-icon" src="'+favIconUrl+'"/>  '+title+'</li>');

  return $li;
}
