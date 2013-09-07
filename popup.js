document.addEventListener('DOMContentLoaded', function () {

	chrome.runtime.getBackgroundPage(function(page){
  
  	console.log("ahhh");

    for(category in page.categories){
      console.log(category);
    
    }
    chrome.tabs.getSelected(function(tab){
      //chrome.tabs.remove(tab.id);
      page.addTab(tab.url,'foo');
    });
    $('#addTab').click(function(){
      console.log('clicked');
      page.openTabs('foo');
      page.categories.foo=[];
    });

    $('#createNewGroup').click(function() {
       createNewGroup();
   });
  });
});

function createNewGroup() {
	self.location="../createNewGroup.html";
}